# Aplicación Full Stack con Flask y React

Una aplicación web moderna construida con backend en Flask, frontend en React y base de datos PostgreSQL, todo containerizado con Docker.

![Aplicación challenge](https://i.imgur.com/gfxrkyn.png)

## 📋 Características

-   API REST con Flask en el backend
-   Frontend con React
-   Base de datos PostgreSQL
-   Containerización con Docker
-   Entorno de desarrollo listo para usar
-   Orquestación de contenedores con Docker Compose
-   Suite de pruebas automatizadas para el backend
-   Documentación interactiva del API con Swagger

## 🔧 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

-   Docker
-   Docker Compose

## 🚀 Inicio Rápido

1. Clona el repositorio:

```bash
git clone https://github.com/horizonxt/challenge.git
cd challenge
```

2. Inicia la aplicación:

```bash
docker-compose up --build
```

3. Accede a la aplicación:

-   Frontend: http://localhost:3000
-   API Backend: http://localhost:5000
-   Documentación API (Swagger): http://localhost:5000/apidocs/

## 📚 Documentación del API

La documentación completa del API está disponible a través de Swagger UI en:

```
http://localhost:5000/apidocs/
```

Características de la documentación:

-   Interfaz interactiva para probar los endpoints
-   Descripción detallada de todos los endpoints disponibles
-   Esquemas de solicitud y respuesta
-   Ejemplos de uso
-   Documentación de códigos de estado HTTP
-   Prueba de endpoints directamente desde el navegador

## 🧪 Ejecutar Pruebas

Para ejecutar las pruebas del backend:

```bash
# Accede al contenedor del backend
docker exec -it flask-container bash

# Ejecuta las pruebas
pytest
```

![Test del backend](https://i.imgur.com/QmMeKM2.png)

## 🏗️ Estructura del Proyecto

```
.
├── backend/               # Aplicación Flask
│   ├── models/            # Tabla Article
│   ├── schemas/           # Modelos para validar datos de entrada y salida
│   ├── tests/             # Pruebas automatizadas
│   ├── app.py             # Punto de entrada de la aplicación
│   └── requirements.txt   # Dependencias de Python
├── frontend/              # Aplicación React
├── docker-compose.yml     # Configuración de Docker compose
└── postgresql.conf        # Configuración de PostgreSQL
```

## Arquitectura del Front

![Estructura del proyecto y componentes](https://i.imgur.com/6U47Uh5.png)
![Estructura de la tabla y formularios](https://i.imgur.com/3Czj9ZL_d.webp?maxwidth=760&fidelity=grand)

## 🛠️ Configuración de Servicios

### Base de Datos (PostgreSQL)

-   Puerto: 5432
-   Usuario por defecto: DEFAULT_USER
-   Nombre de la base de datos: postgres
-   Archivo de configuración personalizado montado

### Backend (Flask)

-   Puerto: 5000
-   Entorno de desarrollo habilitado
-   Recarga automática habilitada
-   Conectado a la base de datos PostgreSQL
-   Swagger UI disponible en /apidocs/

### Frontend (React)

-   Puerto: 3000
-   Entorno de desarrollo habilitado
-   Conectado al backend de Flask

## 🔒 Variables de Entorno

### Servicio de Base de Datos

```
POSTGRES_USER=DEFAULT_USER
POSTGRES_PASSWORD=Example1001@
POSTGRES_DB=postgres
```

### Servicio Backend

```
FLASK_APP=app.py
FLASK_ENV=development
DATABASE_URL=postgresql://DEFAULT_USER:Example1001%40@db:5432/postgres
```

### Servicio Frontend

```
NODE_ENV=development
```

## 🛑 Detener la Aplicación

Para detener la aplicación:

```bash
docker-compose down
```

Para detener la aplicación y eliminar los volúmenes:

```bash
docker-compose down -v
```

## 💻 Desarrollo

1. Los cambios en el backend se recargan automáticamente gracias al servidor de desarrollo de Flask
2. Los cambios en el frontend se recargan automáticamente gracias al servidor de desarrollo de React
3. Los datos de la base de datos persisten en el volumen `postgres-data`
4. Las pruebas se pueden ejecutar en cualquier momento para verificar la funcionalidad del backend
5. La documentación del API se actualiza automáticamente al modificar los endpoints

## 🔍 Solución de Problemas

1. Si la conexión a la base de datos falla:

    - Asegúrate de que el contenedor de PostgreSQL está ejecutándose: `docker ps`
    - Revisa los logs: `docker-compose logs db`
    - Verifica las credenciales de la base de datos en docker-compose.yml

2. Si los servicios no inician:

    - Asegúrate de que los puertos 5432, 5000 y 3000 están disponibles
    - Revisa los logs de los servicios: `docker-compose logs [nombre_servicio]`

3. Si las pruebas fallan:

    - Verifica que estás dentro del contenedor del backend
    - Revisa los logs de las pruebas para más detalles
    - Asegúrate de que la base de datos está accesible

4. Si la documentación Swagger no carga:
    - Verifica que el servidor Flask está ejecutándose correctamente
    - Revisa los logs del backend por posibles errores
    - Asegúrate de que la ruta /apidocs/ está correctamente configurada

## 📝 Contribuir

1. Haz un fork del repositorio
2. Crea tu rama de características
3. Realiza tus cambios
4. Envía un push a la rama
5. Crea un nuevo Pull Request

## 📄 Licencia

MIT
