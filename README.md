# 🐾 Sistema de Gestión de Mascotas

Una aplicación web Full Stack para administrar el registro de mascotas. Permite crear, leer, actualizar y eliminar (CRUD) registros de animales, calculando estadísticas como el promedio de edad.

## 🚀 Tecnologías Utilizadas

### Frontend 🎨
* **React + Vite**: Para una interfaz rápida y reactiva.
* **Tailwind CSS**: Para el estilizado moderno y responsivo.
* **Lucide React**: Para los íconos de animales e interfaz.

### Backend ⚙️
* **Node.js + Express**: Servidor REST API.
* **MySQL**: Base de datos relacional.
* **MySQL2**: Driver para conectar Node.js con MySQL.

---

## 🛠️ Instalación y Configuración Local

Sigue estos pasos para correr el proyecto en tu computadora.

### 1. Prerrequisitos
* Tener instalado [Node.js](https://nodejs.org/).
* Tener instalado y corriendo un servidor MySQL (como XAMPP, MySQL Workbench o Docker).

### 2. Configuración de la Base de Datos
1.  Entra a tu gestor de base de datos MySQL.
2.  Crea una nueva base de datos o ejecuta el script incluido:
    * Abre el archivo `database.sql` ubicado en la raíz.
    * Copia y ejecuta su contenido para crear la base de datos `gestion_mascotas`, la tabla y datos de prueba.

### 3. Configuración del Backend
1.  Navega a la carpeta del servidor:
    ```bash
    cd backend
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  **(Opcional)** Si tu base de datos tiene contraseña, edita el archivo `backend/server.js` o configura variables de entorno (ver sección de Despliegue).
4.  Inicia el servidor:
    ```bash
    # Opción recomendada si configuraste el script start
    npm start
    
    # Alternativa directa
    node server.js
    ```
    *El backend correrá en `http://localhost:3000`.*

### 4. Configuración del Frontend
1.  Abre una nueva terminal y navega a la carpeta del cliente:
    ```bash
    cd frontend
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Inicia la aplicación:
    ```bash
    npm run dev
    ```
    *El frontend correrá generalmente en `http://localhost:5173`.*

---

## ☁️ Despliegue en Render (Producción)

Para subir este proyecto a Render.com, asegúrate de configurar las siguientes **Variables de Entorno (Environment Variables)** en el panel de control de tu servicio web.

### Variables para el Backend (Web Service)
| Variable | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `DB_HOST` | Host de tu base de datos en la nube | `junction.proxy.rlwy.net` |
| `DB_USER` | Usuario de la base de datos | `root` |
| `DB_PASSWORD` | Contraseña de la base de datos | `tu_contraseña_segura` |
| `DB_NAME` | Nombre de la base de datos | `gestion_mascotas` |
| `DB_PORT` | Puerto de la base de datos | `3306` |
| `PORT` | Puerto del servidor (Render lo asigna solo) | `10000` (No es necesario definirlo manual) |

### Variables para el Frontend (Static Site)
| Variable | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `VITE_API_URL` | URL de tu backend desplegado | `https://api-mascotas-pablo.onrender.com/mascotas` |

---

## 📁 Estructura del Proyecto

```text
/
├── backend/          # Código del servidor (Node/Express)
│   ├── server.js     # Punto de entrada y rutas API
│   └── package.json
│
├── frontend/         # Código del cliente (React/Vite)
│   ├── src/
│   │   ├── App.jsx   # Lógica principal y componentes
│   │   └── main.jsx  # Montaje de la app
│   └── tailwind.config.js
│
└── database.sql      # Script SQL para crear la estructura
✨ Características
Iconos Dinámicos: Detecta automáticamente si es Perro, Gato, Pez o Ave y asigna el ícono correspondiente.

Cálculo de Promedio: Muestra en tiempo real el promedio de edad de las mascotas registradas.

Modo Demo Automático: Si el backend falla, el frontend carga datos de prueba para no romper la interfaz.

Diseño Responsivo: Adaptable a móviles y escritorio gracias a Tailwind CSS.

Hecho con ❤️ por Pablo Andrés Correa Rojas.
