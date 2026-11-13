def test_create_employee_success(client, auth_headers):
    payload = {
        "name": "Jane Miller",
        "email": "jane.miller@example.com",
        "phone": "+1-555-9876",
        "department": "Engineering",
        "designation": "Frontend Engineer",
        "joining_date": "2023-05-15",
        "status": "Active"
    }
    response = client.post("/employees", json=payload, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Jane Miller"
    assert data["email"] == "jane.miller@example.com"
    assert data["status"] == "Active"
    assert "id" in data


def test_create_employee_duplicate_email(client, auth_headers):
    payload = {
        "name": "Jane Miller",
        "email": "jane.unique@example.com",
        "phone": "+1-555-9876",
        "department": "Engineering",
        "designation": "Frontend Engineer",
        "joining_date": "2023-05-15",
        "status": "Active"
    }
    res1 = client.post("/employees", json=payload, headers=auth_headers)
    assert res1.status_code == 201

    res2 = client.post("/employees", json=payload, headers=auth_headers)
    assert res2.status_code == 409
    assert "already exists" in res2.json()["detail"]


def test_create_employee_validation_errors(client, auth_headers):
    payload = {
        "name": "   ",
        "email": "invalid-email-format",
        "phone": "123",
        "department": "IT",
        "designation": "Dev",
        "joining_date": "2023-05-15",
        "status": "InvalidStatus"
    }
    response = client.post("/employees", json=payload, headers=auth_headers)
    assert response.status_code == 422


def test_get_employee_by_id(client, auth_headers):
    payload = {
        "name": "Mark Spencer",
        "email": "mark.spencer@example.com",
        "phone": "+1-555-4321",
        "department": "Marketing",
        "designation": "Content Strategist",
        "joining_date": "2022-08-01",
        "status": "Active"
    }
    res = client.post("/employees", json=payload, headers=auth_headers)
    emp_id = res.json()["id"]

    get_res = client.get(f"/employees/{emp_id}", headers=auth_headers)
    assert get_res.status_code == 200
    assert get_res.json()["name"] == "Mark Spencer"

    not_found_res = client.get("/employees/99999", headers=auth_headers)
    assert not_found_res.status_code == 404


def test_update_employee(client, auth_headers):
    payload = {
        "name": "Robert Downey",
        "email": "robert.d@example.com",
        "phone": "+1-555-7777",
        "department": "Operations",
        "designation": "Lead",
        "joining_date": "2021-02-10",
        "status": "Active"
    }
    res = client.post("/employees", json=payload, headers=auth_headers)
    emp_id = res.json()["id"]

    update_res = client.put(
        f"/employees/{emp_id}",
        json={"designation": "Director of Operations", "status": "Inactive"},
        headers=auth_headers
    )
    assert update_res.status_code == 200
    data = update_res.json()
    assert data["designation"] == "Director of Operations"
    assert data["status"] == "Inactive"


def test_delete_employee(client, auth_headers):
    payload = {
        "name": "Temporary User",
        "email": "temp.user@example.com",
        "phone": "+1-555-0000",
        "department": "Sales",
        "designation": "Intern",
        "joining_date": "2024-01-01",
        "status": "Active"
    }
    res = client.post("/employees", json=payload, headers=auth_headers)
    emp_id = res.json()["id"]

    del_res = client.delete(f"/employees/{emp_id}", headers=auth_headers)
    assert del_res.status_code == 200

    assert client.get(f"/employees/{emp_id}", headers=auth_headers).status_code == 404


def test_search_and_filter_employees(client, auth_headers):
    emps = [
        {"name": "Alice Smith", "email": "alice@company.com", "phone": "+1-555-1111", "department": "Engineering", "designation": "Dev", "joining_date": "2023-01-01", "status": "Active"},
        {"name": "Bob Jones", "email": "bob@company.com", "phone": "+1-555-2222", "department": "Sales", "designation": "Rep", "joining_date": "2023-01-01", "status": "Inactive"},
        {"name": "Charlie Smith", "email": "charlie@other.com", "phone": "+1-555-3333", "department": "Engineering", "designation": "QA", "joining_date": "2023-01-01", "status": "Active"},
    ]
    for emp in emps:
        client.post("/employees", json=emp, headers=auth_headers)

    res = client.get("/employees?search=Smith", headers=auth_headers)
    assert res.status_code == 200
    assert res.json()["total"] == 2

    res = client.get("/employees?department=Engineering", headers=auth_headers)
    assert res.status_code == 200
    assert all(item["department"] == "Engineering" for item in res.json()["items"])

    res = client.get("/employees?search=Charlie&department=Engineering&status=Active", headers=auth_headers)
    assert res.status_code == 200
    assert res.json()["total"] == 1
    assert res.json()["items"][0]["name"] == "Charlie Smith"

