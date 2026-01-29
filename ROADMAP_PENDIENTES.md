# Roadmap de Pendientes - NeuronAds OS

Lista de características y mejoras pendientes por implementar para alcanzar la versión estable completa.

## 1. Backend & API
-   [x] **Persistencia de Cotizaciones:** Crear endpoints (POST, PUT, DELETE) para guardar las cotizaciones generadas en la base de datos.
-   [x] **Gestión de Campañas:** Implementar endpoints CRUD para la tabla `campaigns`.
-   [ ] **Autenticación y Seguridad:**
    -   Reemplazar el sistema de login simulado por autenticación real (JWT/OAuth).
    -   Middleware de protección de rutas.
-   [x] **Proxy de IA:** Mover la lógica de Google GenAI al backend para proteger la API Key y centralizar el control de uso.
-   [ ] **Validación:** Implementar validación de datos de entrada (ej. Zod o Joi) en todos los endpoints.

## 2. Frontend
-   [x] **Conexión de Formularios:** Conectar los formularios de creación (Clientes, Proyectos) a sus respectivos endpoints de backend.
-   [x] **Gestión de Estado Global:** Evaluar el uso de Context API o Redux para manejar el estado de usuario y datos compartidos de manera más robusta.
-   [x] **Manejo de Errores:** Mejorar la retroalimentación al usuario en caso de fallos de red o errores de API.

## 3. DevOps & Calidad
-   [ ] **Testing:**
    -   Implementar pruebas unitarias para el backend (Jest/Supertest).
    -   Implementar pruebas de componentes para el frontend (React Testing Library).
-   [ ] **Redis:** Implementar caché efectiva para consultas frecuentes (ej. configuración, dashboard).
-   [ ] **CI/CD:** Configurar pipelines de despliegue automatizado.
-   [ ] **Variables de Entorno:** Refinar la gestión de variables para separar entornos de desarrollo y producción de manera segura.
