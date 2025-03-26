@auth_routes.route('/google', methods=['POST'])
def google_auth():
    try:
        data = request.get_json()
        if not data or 'credential' not in data or 'userInfo' not in data:
            logger.error("❌ Missing required data in request")
            return jsonify({'error': 'Missing required data'}), 400

        access_token = data['credential']
        user_info = data['userInfo']
        
        logger.debug("🔍 Received Google auth request", {
            'email': user_info.get('email'),
            'name': user_info.get('name')
        })

        # Verify the access token with Google
        try:
            id_info = id_token.verify_oauth2_token(
                access_token, 
                requests.Request(), 
                os.getenv('VITE_GOOGLE_CLIENT_ID')
            )
            
            if id_info['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                raise ValueError('Wrong issuer.')
                
            logger.debug("✅ Token verified successfully")
            
        except ValueError as e:
            logger.error(f"❌ Token verification failed: {str(e)}")
            return jsonify({'error': f'Invalid token: {str(e)}'}), 401

        # Get or create user
        user = User.query.filter_by(email=user_info['email']).first()
        if not user:
            logger.info("👤 Creating new user")
            user = User(
                email=user_info['email'],
                name=user_info.get('name', ''),
                profile_picture=user_info.get('picture', '')
            )
            db.session.add(user)
            db.session.commit()
            logger.info("✅ New user created successfully")
        else:
            logger.info("👤 Existing user found")
            # Update user info if needed
            if user.name != user_info.get('name', '') or user.profile_picture != user_info.get('picture', ''):
                user.name = user_info.get('name', '')
                user.profile_picture = user_info.get('picture', '')
                db.session.commit()
                logger.info("✅ User information updated")

        # Create access token
        access_token = create_access_token(identity=user.id)
        
        logger.info("🔑 Authentication successful")
        return jsonify({
            'access_token': access_token,
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'profile_picture': user.profile_picture
            }
        }), 200

    except Exception as e:
        logger.error(f"❌ Authentication error: {str(e)}")
        return jsonify({'error': str(e)}), 500 