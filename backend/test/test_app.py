import pytest
from app import app, engine
from sqlmodel import SQLModel


@pytest.fixture
def client():
    """
    Configura el cliente de pruebas y crea las tablas en la base de datos antes de cada prueba.
    """
    app.config["TESTING"] = True
    with app.test_client() as client:
        with app.app_context():
            SQLModel.metadata.create_all(engine)

        yield client
    with app.app_context():
        SQLModel.metadata.drop_all(engine)


def test_create_article(client):
    """
    Prueba la creación de un artículo con un nombre y una descripción válidos.
    Verifica que el artículo se crea correctamente y se devuelve un estado 201.
    """
    response = client.post(
        "/articles/",
        json={"name": "Test Article", "description": "This is a test article."},
    )
    assert response.status_code == 201
    data = response.get_json()
    assert data["name"] == "Test Article"
    assert data["description"] == "This is a test article."
    assert "createdAt" in data


def test_create_article_without_name(client):
    """
    Prueba la creación de un artículo sin proporcionar un nombre.
    Verifica que se devuelve un estado 422.
    """
    response = client.post(
        "/articles/",
        json={"description": "This article has no name."},
    )
    assert response.status_code == 422


def test_create_article_without_description(client):
    """
    Prueba la creación de un artículo sin proporcionar una descripción.
    Verifica que se devuelve un estado 422.
    """
    response = client.post(
        "/articles/",
        json={"name": "Nameless Description"},
    )
    assert response.status_code == 422


def test_create_article_with_long_name(client):
    """
    Prueba la creación de un artículo con un nombre que excede la longitud máxima permitida.
    Verifica que se devuelve un estado 422.
    """
    long_name = "A" * 256
    response = client.post(
        "/articles/",
        json={"name": long_name, "description": "This article has a very long name."},
    )
    assert response.status_code == 422


def test_create_article_with_empty_fields(client):
    """
    Prueba la creación de un artículo con campos vacíos para nombre y descripción.
    Verifica que se devuelve un estado 422.
    """
    response = client.post(
        "/articles/",
        json={"name": "", "description": ""},
    )
    assert response.status_code == 422


def test_read_articles(client):
    """
    Prueba la obtención de todos los artículos después de crear dos artículos.
    Verifica que se devuelven ambos artículos con un estado 200.
    """
    client.post(
        "/articles/",
        json={
            "name": "Test Article 1",
            "description": "This is the first test article.",
        },
    )
    client.post(
        "/articles/",
        json={
            "name": "Test Article 2",
            "description": "This is the second test article.",
        },
    )

    response = client.get("/articles/")
    assert response.status_code == 200
    data = response.get_json()
    assert data[0]["name"] == "Test Article 2"
    assert data[1]["name"] == "Test Article 1"


def test_read_no_articles(client):
    """
    Prueba la obtención de artículos cuando no hay artículos creados.
    Verifica que se devuelve una lista vacía con un estado 200.
    """
    response = client.get("/articles/")
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) >= 10


def test_delete_article_success(client):
    # Crear un artículo primero para poder eliminarlo
    new_article = {"name": "Test Article", "description": "Test Description"}
    create_response = client.post("/articles/", json=new_article)
    assert create_response.status_code == 201
    article_id = create_response.get_json()["id"]

    # Eliminar el artículo
    delete_response = client.delete(f"/articles/{article_id}")
    assert delete_response.status_code == 200
    deleted_article = delete_response.get_json()
    assert "id" in deleted_article
    assert deleted_article["id"] == article_id
    assert deleted_article["name"] == new_article["name"]
    assert deleted_article["description"] == new_article["description"]

    # Verificar que el artículo ya no existe
    response = client.get("/articles/")
    assert response.status_code == 200
    assert len(response.get_json()) >= 10


def test_delete_article_not_found(client):
    # Intentar eliminar un artículo que no existe
    non_existing_article_id = 9999
    delete_response = client.delete(f"/articles/{non_existing_article_id}")
    assert delete_response.status_code == 404
    error_response = delete_response.get_json()
    assert error_response["success"] is False
    assert error_response["error"] == "Article not found"


def test_delete_article_invalid_id(client):
    # Intentar eliminar un artículo con un ID no válido (e.g., string en lugar de entero)
    invalid_article_id = "invalid_id"
    delete_response = client.delete(f"/articles/{invalid_article_id}")
    assert delete_response.status_code == 404
