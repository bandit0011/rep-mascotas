CREATE DATABASE IF NOT EXISTS gestion_mascotas;
    USE gestion_mascotas;

    CREATE TABLE IF NOT EXISTS mascotas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        especie VARCHAR(50) NOT NULL,
        edad INT NOT NULL,
        dueno VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    INSERT INTO mascotas (nombre, especie, edad, dueno) VALUES 
    ('Firulais', 'Perro', 5, 'Juan Perez'),
    ('Michi', 'Gato', 3, 'Maria Lopez'),
    ('Nemo', 'Pez', 1, 'Ana Gomez');
    ```
3.  Súbelo a GitHub con estos comandos en la terminal (desde la carpeta principal):
    ```powershell
    git add .
    git commit -m "Agregando script de base de datos faltante"
    git push
    ```

---

### ✅ LO QUE ESTÁ PERFECTO

1.  **Frontend Configurado:** `src/App.jsx` tiene `USE_MOCK_DATA = false`, lo cual es correcto para la entrega final (se conectará al backend real).
2.  **Estilos:** Tailwind está bien instalado (`postcss.config.js` y `tailwind.config.js` están correctos).
3.  **Backend:** El `server.js` tiene todas las rutas requeridas.
4.  **Limpieza:** El `.gitignore` funcionó bien, no subiste la carpeta pesada `node_modules`, así que tu repositorio está limpio y profesional.

### 💡 UN ÚLTIMO DETALLE (Ojo con la contraseña)

En tu archivo `backend/server.js`, línea 15, tienes esto:
```javascript
password: 'admin',      // <--- PON TU CONTRASEÑA AQUÍ SI TIENES