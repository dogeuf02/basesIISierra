# Biblioteca Digital Universitaria

Sistema completo de gestión de recursos académicos digitales con backend en FastAPI y frontend en React + TypeScript.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Frontend](#frontend)
- [Estructura de Base de Datos](#estructura-de-base-de-datos)

## ✨ Características

### Backend
- **API RESTful** completa con FastAPI
- **Base de datos PostgreSQL** para datos estructurados
- **MongoDB** para búsqueda de texto completo y logs
- **Sistema de búsqueda** avanzado con índice de texto
- **Estadísticas diarias** automatizadas
- **Sistema de logs** de eventos
- **Reseñas y calificaciones** de recursos
- **Arquitectura limpia** con separación de capas (API, Servicios, Repositorios)

### Frontend
- **Interfaz moderna y responsive** con Tailwind CSS
- **Búsqueda en tiempo real** de recursos
- **Visualización de estadísticas** y métricas
- **Sistema de reseñas** interactivo
- **Navegación intuitiva** entre categorías y recursos
- **Diseño adaptable** para móviles y tablets
- **Manejo de estado** eficiente con React Query

## 🛠 Tecnologías

### Backend
- **Python 3.13+**
- **FastAPI** - Framework web moderno y rápido
- **SQLAlchemy** - ORM para PostgreSQL
- **Pymongo** - Driver para MongoDB
- **Pydantic** - Validación de datos
- **Poetry** - Gestión de dependencias
- **PostgreSQL** - Base de datos relacional
- **MongoDB** - Base de datos NoSQL para búsqueda y logs

### Frontend
- **React 19** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de estilos
- **React Router** - Enrutamiento
- **React Query** - Manejo de estado del servidor
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos modernos

## 📁 Estructura del Proyecto

```
basesIISierra/
├── frontend/                  # Aplicación React
│   ├── src/
│   │   ├── components/       # Componentes reutilizables
│   │   ├── pages/            # Páginas principales
│   │   ├── services/         # Servicios API
│   │   ├── types/            # Tipos TypeScript
│   │   ├── App.tsx           # Componente principal
│   │   └── main.tsx          # Punto de entrada
│   ├── package.json
│   └── vite.config.ts
├── src/
│   └── app/
│       ├── api/              # Endpoints de la API
│       ├── models/           # Modelos de datos
│       ├── repositories/     # Acceso a datos
│       ├── services/         # Lógica de negocio
│       ├── sql/              # Configuración SQL
│       ├── nosql/            # Configuración MongoDB
│       ├── batch/            # Scripts de procesamiento
│       └── main.py           # Aplicación FastAPI
├── SCRIPTS_DB/               # Scripts SQL
│   ├── scriptCreationSQL.sql
│   └── scriptSeedSQL.sql
├── pyproject.toml            # Configuración Poetry
└── README.md
```

## 📦 Requisitos Previos

- **Python 3.13+**
- **Node.js 18+** y npm
- **PostgreSQL 14+**
- **MongoDB 6+**
- **Poetry** (para gestión de dependencias Python)

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd basesIISierra
```

### 2. Configurar el Backend

```bash
# Instalar Poetry si no lo tienes
curl -sSL https://install.python-poetry.org | python3 -

# Instalar dependencias
poetry install

# Activar el entorno virtual
poetry shell
```

### 3. Configurar las Bases de Datos

#### PostgreSQL

```bash
# Crear base de datos
createdb digital_library

# Ejecutar scripts de creación
psql -d digital_library -f SCRIPTS_DB/scriptCreationSQL.sql

# (Opcional) Ejecutar scripts de seed
psql -d digital_library -f SCRIPTS_DB/scriptSeedSQL.sql
```

#### MongoDB

Asegúrate de que MongoDB esté corriendo:

```bash
# En macOS
brew services start mongodb-community

# En Linux
sudo systemctl start mongod

# Verificar que esté corriendo
mongosh
```

### 4. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# PostgreSQL
PG_HOST=localhost
PG_PORT=5432
PG_DB=digital_library
PG_USER=postgres
PG_PASSWORD=postgres

# MongoDB
MONGO_URL=mongodb://localhost:27017
MONGO_DB_NAME=digital_library
```

### 5. Construir Índice de Búsqueda

```bash
# Desde el entorno virtual de Poetry
python -m app.batch.build_search_index
```

### 6. Configurar el Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Crear archivo .env
echo "VITE_API_URL=http://localhost:8000" > .env
```

## ⚙️ Configuración

### Variables de Entorno Backend

El backend utiliza las siguientes variables de entorno (definidas en `.env`):

- `PG_HOST`: Host de PostgreSQL (default: localhost)
- `PG_PORT`: Puerto de PostgreSQL (default: 5432)
- `PG_DB`: Nombre de la base de datos (default: digital_library)
- `PG_USER`: Usuario de PostgreSQL (default: postgres)
- `PG_PASSWORD`: Contraseña de PostgreSQL (default: postgres)
- `MONGO_URL`: URL de conexión a MongoDB (default: mongodb://localhost:27017)
- `MONGO_DB_NAME`: Nombre de la base de datos MongoDB (default: digital_library)

### Variables de Entorno Frontend

El frontend utiliza:

- `VITE_API_URL`: URL del backend API (default: http://localhost:8000)

## 🎮 Uso

### Iniciar el Backend

```bash
# Desde la raíz del proyecto, con Poetry activado
uvicorn src.app.main:app --reload --host 0.0.0.0 --port 8000
```

O usando el script de Poetry:

```bash
poetry run uvicorn src.app.main:app --reload
```

El API estará disponible en: `http://localhost:8000`

Documentación interactiva:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Iniciar el Frontend

```bash
cd frontend
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

### Scripts de Batch

```bash
# Construir índice de búsqueda
python -m app.batch.build_search_index

# Generar estadísticas diarias
python -m app.batch.generate_daily_stats
```

## 📡 API Endpoints

### Recursos

- `GET /resources/` - Listar todos los recursos
- `GET /resources/{id}` - Obtener un recurso específico
- `GET /resources/{id}/authors` - Obtener autores de un recurso
- `GET /resources/{id}/categories` - Obtener categorías de un recurso
- `GET /resources/{id}/keywords` - Obtener palabras clave de un recurso
- `GET /resources/{id}/reviews` - Obtener reseñas de un recurso
- `POST /resources/{id}/reviews` - Añadir una reseña

### Búsqueda

- `GET /search/?query={query}` - Buscar recursos

### Categorías

- `GET /categories/` - Listar todas las categorías

### Programas

- `GET /programs/` - Listar todos los programas académicos

### Estadísticas

- `GET /stats/latest` - Obtener últimas estadísticas
- `GET /stats/{date}` - Obtener estadísticas por fecha

### Logs

- `POST /logs/` - Registrar un evento de log
- `GET /logs/user/{user_id}` - Obtener logs de un usuario
- `GET /logs/resource/{resource_id}` - Obtener logs de un recurso

## 🎨 Frontend

### Páginas Principales

1. **Home (`/`)**: Página principal con búsqueda y recursos recientes
2. **Recursos (`/resources`)**: Lista completa de recursos con paginación
3. **Detalle de Recurso (`/resources/:id`)**: Información completa de un recurso con reseñas
4. **Categorías (`/categories`)**: Lista de categorías disponibles
5. **Estadísticas (`/stats`)**: Métricas y estadísticas de uso
6. **Búsqueda (`/search?q=query`)**: Resultados de búsqueda

### Componentes Principales

- `Header`: Navegación principal con menú responsive
- `SearchBar`: Barra de búsqueda reutilizable
- `ResourceCard`: Tarjeta de visualización de recurso
- `Footer`: Pie de página con enlaces
- `LoadingSpinner`: Indicador de carga
- `ErrorMessage`: Mensajes de error
- `EmptyState`: Estados vacíos

## 🗄 Estructura de Base de Datos

### PostgreSQL (Datos Estructurados)

- **program**: Programas académicos
- **app_user**: Usuarios del sistema
- **license**: Licencias de recursos
- **resource**: Recursos digitales
- **author**: Autores
- **category**: Categorías
- **keyword**: Palabras clave
- **review**: Reseñas de recursos
- **daily_stats**: Estadísticas diarias
- **resource_author**: Relación N:M recursos-autores
- **resource_category**: Relación N:M recursos-categorías
- **resource_keyword**: Relación N:M recursos-palabras clave

### MongoDB (Búsqueda y Logs)

- **search_index**: Índice de búsqueda de texto completo
- **log_events**: Eventos de log del sistema

## 🔧 Desarrollo

### Backend

La aplicación sigue una arquitectura de capas:

```
API Layer (api/) → Service Layer (services/) → Repository Layer (repositories/) → Database
```

### Frontend

El frontend utiliza:

- **React Query** para el manejo del estado del servidor
- **React Router** para navegación
- **Tailwind CSS** para estilos
- **TypeScript** para type safety

### Ejecutar Tests

```bash
# Backend (si hay tests configurados)
poetry run pytest

# Frontend
cd frontend
npm test
```

## 📝 Notas Adicionales

- El sistema requiere que el índice de búsqueda de MongoDB esté construido antes de usar la búsqueda
- Las estadísticas diarias deben generarse mediante el script batch correspondiente
- CORS está configurado para permitir conexiones desde `localhost:5173` y `localhost:3000`

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es parte de un curso académico.

## 👨‍💻 Autor

David Muñoz - dsmunoza@udistrital.edu.co

---

**Nota**: Asegúrate de tener todas las bases de datos corriendo y configuradas antes de iniciar la aplicación.