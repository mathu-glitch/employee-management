def test_dashboard_stats(client, auth_headers):
    client.post("/employees", json={
        "name": "User One", "email": "user1@stat.com", "phone": "+1-555-1111",
        "department": "Engineering", "designation": "Dev", "joining_date": "2023-01-01", "status": "Active"
    }, headers=auth_headers)
    client.post("/employees", json={
        "name": "User Two", "email": "user2@stat.com", "phone": "+1-555-2222",
        "department": "Engineering", "designation": "Dev", "joining_date": "2023-01-01", "status": "Active"
    }, headers=auth_headers)
    client.post("/employees", json={
        "name": "User Three", "email": "user3@stat.com", "phone": "+1-555-3333",
        "department": "Finance", "designation": "Analyst", "joining_date": "2023-01-01", "status": "Inactive"
    }, headers=auth_headers)

    res = client.get("/dashboard/stats", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["total_employees"] == 3
    assert data["active_employees"] == 2
    assert data["inactive_employees"] == 1
    assert data["department_counts"]["Engineering"] == 2
    assert data["department_counts"]["Finance"] == 1

