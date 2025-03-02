def test_user_registration(client):
    response = client.post('/api/register', json={
        'first_name': 'Test',
        'last_name': 'User',
        'email': 'test@example.com',
        'password': 'TestPass123!'
    })
    assert response.status_code == 201
    assert 'User Created successfully' in response.json['message']

def test_duplicate_registration(client, test_user):
    response = client.post('/api/register', json={
        'first_name': 'Test',
        'last_name': 'User',
        'email': test_user.email,
        'password': 'TestPass123!'
    })
    assert response.status_code == 409 