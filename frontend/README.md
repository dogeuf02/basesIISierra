# Frontend - Biblioteca Digital Universitaria

Frontend moderno desarrollado con React, TypeScript, Vite y Tailwind CSS.

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview
```

## 📦 Dependencias Principales

- **React 19** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool rápido
- **Tailwind CSS** - Framework CSS utility-first
- **React Router** - Enrutamiento
- **React Query** - Manejo de estado del servidor
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos modernos

## 🏗 Estructura

```
src/
├── components/          # Componentes reutilizables
│   ├── Header.tsx      # Navegación principal
│   ├── Footer.tsx      # Pie de página
│   ├── SearchBar.tsx   # Barra de búsqueda
│   ├── ResourceCard.tsx # Tarjeta de recurso
│   └── ...
├── pages/              # Páginas principales
│   ├── Home.tsx        # Página de inicio
│   ├── Resources.tsx   # Lista de recursos
│   ├── ResourceDetail.tsx # Detalle de recurso
│   ├── Categories.tsx  # Categorías
│   ├── Stats.tsx       # Estadísticas
│   └── Search.tsx      # Búsqueda
├── services/           # Servicios API
│   ├── api.ts         # Configuración Axios
│   ├── resources.ts   # Servicio de recursos
│   ├── search.ts      # Servicio de búsqueda
│   └── ...
├── types/              # Tipos TypeScript
│   └── index.ts
├── App.tsx            # Componente principal
└── main.tsx           # Punto de entrada
```

## ⚙️ Configuración

Crea un archivo `.env` en la raíz del frontend:

```env
VITE_API_URL=http://localhost:8000
```

## 🎨 Estilos

El proyecto utiliza Tailwind CSS para los estilos. Los colores principales están definidos en `tailwind.config.js`:

- **Primary**: Azul (#0ea5e9)
- **Gray**: Escala de grises
- Diseño responsive con breakpoints estándar

## 📱 Características

- ✨ Interfaz moderna y atractiva
- 📱 Totalmente responsive
- 🔍 Búsqueda en tiempo real
- ⚡ Carga rápida con React Query
- 🎯 TypeScript para type safety
- 🎨 Diseño con Tailwind CSS