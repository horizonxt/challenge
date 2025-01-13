import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from pydantic import ValidationError
from sqlmodel import SQLModel, create_engine, Session, desc, select
from models.Article import Article
from schemas import ArticleCreate, ArticleRead
from flasgger import Swagger
from dotenv import load_dotenv
import json
from faker import Faker

load_dotenv()

fake = Faker()

app = Flask(__name__)
CORS(app)
Swagger(
    app,
    template={
        "swagger": "2.0",
        "info": {
            "title": "Article API",
            "description": "API for managing articles",
            "version": "1.0.0",
        },
        "basePath": "/",
        "schemes": ["http", "https"],
        "definitions": {
            "ArticleCreate": {
                "type": "object",
                "properties": {
                    "name": {"type": "string", "minLength": 1, "maxLength": 255},
                    "description": {"type": "string", "minLength": 1, "maxLength": 255},
                },
                "required": ["name", "description"],
            },
            "ArticleRead": {
                "type": "object",
                "properties": {
                    "id": {"type": "integer"},
                    "name": {"type": "string", "minLength": 1, "maxLength": 255},
                    "description": {"type": "string", "minLength": 1, "maxLength": 255},
                    "createdAt": {"type": "string", "format": "date-time"},
                },
                "required": ["id", "name", "description", "createdAt"],
            },
        },
    },
)


DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def create_fake_data(session, num_articles=10):
    for _ in range(num_articles):
        article = Article(
            name=fake.sentence(nb_words=6), description=fake.text(max_nb_chars=200)
        )
        session.add(article)
        session.commit()


@app.before_request
def before_request():
    create_db_and_tables()
    with Session(engine) as session:
        results = session.exec(select(Article)).all()
        if len(results) == 0:
            create_fake_data(session)


def to_camel_case(snake_str):
    components = snake_str.split("_")
    return components[0] + "".join(x.title() for x in components[1:])


def dict_to_camel_case(snake_dict):
    return {to_camel_case(key): value for key, value in snake_dict.items()}


@app.after_request
def after_request(response):
    if response.is_json:
        data = response.get_json()
        if isinstance(data, list):
            data = [dict_to_camel_case(item) for item in data]
        elif isinstance(data, dict):
            data = dict_to_camel_case(data)
        response.set_data(json.dumps(data))
    return response


@app.route("/articles/", methods=["POST"])
def create_article():
    """
    Crear un nuevo artículo
    ---
    parameters:
      - in: body
        name: body
        schema:
          $ref: '#/definitions/ArticleCreate'
    responses:
      201:
        description: Artículo creado exitosamente
        schema:
          $ref: '#/definitions/ArticleRead'
    """
    try:
        article_data = ArticleCreate(**request.json)
    except ValidationError as e:
        return jsonify(e.errors()), 422

    article_dict = article_data.model_dump()
    article = Article(**article_dict)

    with Session(engine) as session:
        session.add(article)
        session.commit()
        session.refresh(article)
        return jsonify(ArticleRead.model_validate(article).model_dump()), 201


@app.route("/articles/", methods=["GET"])
def read_articles():
    """
    Listar todos los artículos
    ---
    responses:
      200:
        description: Lista de artículos
        schema:
          type: array
          items:
            $ref: '#/definitions/ArticleRead'
    """
    with Session(engine) as session:
        statement = select(Article).order_by(desc(Article.createdAt))
        results = session.exec(statement)
        articles = results.all()
        return jsonify(
            [ArticleRead.model_validate(article).model_dump() for article in articles]
        )


@app.route("/articles/<int:article_id>", methods=["DELETE"])
def delete_article(article_id):
    """
    Eliminar un artículo por ID
    ---
    parameters:
      - in: path
        name: article_id
        description: ID del artículo a eliminar
        required: true
        type: integer
        example: 1
    responses:
      200:
        description: Artículo eliminado exitosamente
        schema:
          $ref: '#/definitions/ArticleRead'
      404:
        description: Artículo no encontrado
        schema:
          type: object
          properties:
            success:
              type: boolean
              description: Indica si la operación fue exitosa
              example: false
            error:
              type: string
              description: Mensaje de error indicando que el artículo no fue encontrado
              example: "Article not found"
    """
    with Session(engine) as session:
        statement = select(Article).where(Article.id == article_id)
        results = session.exec(statement)
        article = results.first()
        if article is None:
            return jsonify({"success": False, "error": "Article not found"}), 404
        session.delete(article)
        session.commit()
        return jsonify(
            ArticleRead.model_validate(article).model_dump(),
        )


# Manejo de errores personalizados
@app.errorhandler(500)
def internal_server_error(e):
    response = {
        "error": "Internal Server Error",
        "message": "Something went wrong on our end. Our team has been notified and is working to resolve the issue.",
        "status_code": 500,
    }
    return jsonify(response), 500


if __name__ == "__main__":
    app.run(debug=True)
