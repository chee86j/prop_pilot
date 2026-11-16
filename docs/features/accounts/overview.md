# Accounts and profile

## Registration and sign in

At `/authform`, users can register with a first name, last name, email, and password, or sign in with email and password. Registration requires at least 12 characters, including an uppercase letter, lowercase letter, number, and a symbol. The server validates the request and returns an access token on success. Duplicate email addresses return a conflict response. The form also implements Google sign in, which requires the Google client configuration described in the project README.

Registration switches the form back to sign in after success. Login stores the access token and navigates to the property list. The app uses the token to retrieve the profile on startup; logout is handled by the authentication API.

## Profile

The `/profile` page loads account information and provides profile editing, avatar selection, and password change controls. Password changes require the current password. Profile and password updates use `/api/profile` and `/api/profile/password`.

**Source:** `frontend/src/components/AuthForm.jsx`, `Profile.jsx`, `AvatarUpload.jsx`, `frontend/src/utils/auth.js`, `backend/routes/auth.py`, and `backend/routes/user.py`.

## Request and response details

| Action | Method and API path | Input and outcome |
| --- | --- | --- |
| Register | `POST /api/register` | JSON `first_name`, `last_name`, `email`, `password`; returns user and token on success, 400 for invalid input, 409 for an existing email. |
| Sign in | `POST /api/login` | JSON `email` and `password`; invalid credentials return 401. |
| Google sign in | `POST /api/google` | The frontend obtains Google user and token information and sends `token_info` and `userInfo`. |
| Sign out | `POST /api/logout` | Clears the authentication session and access cookie. |
| View profile | `GET /api/profile` | Uses the authenticated identity to retrieve profile data. |
| Edit profile | `PUT /api/profile` | Accepts `first_name`, `last_name`, `email`, and `avatar`. |
| Change password | `PUT /api/profile/password` | Accepts `current_password` and `new_password`; checks the current password. |

The backend creates a JWT whose identity is the email address, sets an access cookie, and records session information. The frontend also stores the token using `AuthManager`. The app checks the stored token and requests the profile at startup. A missing Google client ID causes the top-level app to return no UI, even for email sign in. See `frontend/src/App.jsx` for that configuration dependency.

The server's allowed special characters are `!@#$%^&*(),.?":{}|<>`. The frontend accepts a broader set of symbols, so a password containing only a symbol outside the server's set can still be rejected. Email validation also differs between client and server. Read the response message when registration returns 400.
