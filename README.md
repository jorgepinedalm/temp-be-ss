# Institutions API

Una API RESTful desarrollada en Node.js con TypeScript para gestionar equipos y atletas de instituciones deportivas.

## 🚀 Características

- **Framework**: Express.js con TypeScript
- **Datos simulados**: Equipos y atletas con información realista
- **Paginación**: Soporte para paginación en todos los endpoints
- **CORS habilitado**: Permite conexiones desde cualquier origen
- **Arquitectura modular**: Código organizado por responsabilidades

## 📋 Endpoints

### GET /institutions/teams/

Obtiene una lista paginada de equipos deportivos.

**Parámetros de consulta:**
- `page` (opcional): Número de página (por defecto: 1)
- `per_page` (opcional): Elementos por página (por defecto: 10)

**Respuesta:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Los Tigres",
      "color": "#FF6B35",
      "initials": "TIG",
      "image": "https://via.placeholder.com/150/FF6B35/FFFFFF?text=TIG",
      "athletes_count": 25
    }
  ],
  "pagination": {
    "total_rows": 10,
    "per_page": 10,
    "page": 1
  }
}
```

### GET /institutions/athletes/

Obtiene una lista paginada de atletas.

**Parámetros de consulta:**
- `page` (opcional): Número de página (por defecto: 1)
- `per_page` (opcional): Elementos por página (por defecto: 10)

**Respuesta:**
```json
{
  "data": [
    {
      "id": 1,
      "full_name": "Carlos Alberto Rodríguez",
      "photo": "https://via.placeholder.com/200x200/FF6B35/FFFFFF?text=CAR",
      "birthday": "1995-03-15",
      "age": 29,
      "institution_image": "https://via.placeholder.com/100x100/000080/FFFFFF?text=INST",
      "latest_status": {
        "id": 101,
        "date": "2024-12-10",
        "status": 1
      },
      "teams": [
        {
          "id": 1,
          "name": "Los Tigres",
          "color": "#FF6B35",
          "initials": "TIG",
          "image": "https://via.placeholder.com/150/FF6B35/FFFFFF?text=TIG",
          "athletes_count": 25
        }
      ]
    }
  ],
  "pagination": {
    "total_rows": 12,
    "per_page": 10,
    "page": 1
  }
}
```

## 🛠️ Instalación y Configuración

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn

### Instalación

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd temp-be-ss
```

2. Instalar dependencias:
```bash
npm install
```

3. Compilar el proyecto:
```bash
npm run build
```

## 🏃‍♂️ Ejecución

### Modo desarrollo (con recarga automática)
```bash
npm run dev
```

### Modo producción
```bash
npm start
```

El servidor se ejecutará en `http://localhost:3000` por defecto.

## 📁 Estructura del Proyecto

```
src/
├── data/           # Datos simulados
│   ├── teams.ts    # Datos de equipos
│   └── athletes.ts # Datos de atletas
├── routes/         # Rutas de la API
│   └── institutions.ts
├── types/          # Interfaces TypeScript
│   └── index.ts
└── index.ts        # Archivo principal
```

## 🧪 Pruebas

### Probar endpoints con curl

**Obtener equipos:**
```bash
curl http://localhost:3000/institutions/teams/
```

**Obtener equipos con paginación:**
```bash
curl "http://localhost:3000/institutions/teams/?page=1&per_page=5"
```

**Obtener atletas:**
```bash
curl http://localhost:3000/institutions/athletes/
```

**Obtener atletas con paginación:**
```bash
curl "http://localhost:3000/institutions/athletes/?page=2&per_page=3"
```

## 🚀 Despliegue

### Variables de entorno

- `PORT`: Puerto del servidor (por defecto: 3000)

### Despliegue en producción

1. Compilar el proyecto:
```bash
npm run build
```

2. Iniciar el servidor:
```bash
npm start
```

### Docker (opcional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 Scripts disponibles

- `npm run build`: Compila TypeScript a JavaScript
- `npm run dev`: Inicia el servidor en modo desarrollo
- `npm start`: Inicia el servidor en modo producción
- `npm run watch`: Inicia el servidor con recarga automática

## 📊 Datos de ejemplo

El proyecto incluye datos simulados para:
- **10 equipos deportivos** con colores, iniciales e imágenes
- **12 atletas** con información personal, fotos y equipos asignados
- **Estados de atletas** con fechas y códigos de estado
- **Paginación funcional** para ambos endpoints

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.