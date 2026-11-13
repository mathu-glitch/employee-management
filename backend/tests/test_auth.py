def test_login_success(client):
    response = client.post(
        "/auth/login",
        json={"username": "testadmin", "password": "password123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "testadmin@example.com"


def test_login_invalid_password(client):
    response = client.post(
        "/auth/login",
        json={"username": "testadmin", "password": "wrongpassword"}
    )
    assert response.status_code == 401
    assert "Invalid username/email or password" in response.json()["detail"]


def test_login_user_not_found(client):
    response = client.post(
        "/auth/login",
        json={"username": "nonexistent", "password": "password123"}
    )
    assert response.status_code == 401


def test_get_current_user_profile(client, auth_headers):
    response = client.get("/auth/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testadmin"
    assert data["email"] == "testadmin@example.com"


def test_unauthorized_access_without_token(client):
    response = client.get("/employees")
    assert response.status_code == 401

