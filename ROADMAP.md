# Roadmap del Proyecto NeuronAds OS

Este documento detalla el estado actual del proyecto y la arquitectura implementada.

## 1. Arquitectura General
-   **Frontend:** Desarrollado en React utilizando Vite, TypeScript y TailwindCSS.
-   **Backend:** Servidor Node.js con Express.
-   **Base de Datos:** PostgreSQL para persistencia de datos (Córtex Persistente).
-   **Cache:** Configuración inicial de Redis (Sinapsis Rápida).
-   **Tiempo Real:** Implementación de WebSockets para notificaciones de transacciones.

## 2. Módulos Implementados

### Frontend
-   **Dashboard:** Vista general del sistema.
-   **CRM (Córtex de Clientes):** Visualización de clientes (conectado a API).
-   **ProjectCore:** Gestión de proyectos (conectado a API).
-   **QuotationEngine:** Generador de cotizaciones con integración de IA (Google GenAI).
-   **CampaignCortex:** Visualización de campañas publicitarias.
-   **SalesPOS:** Punto de venta para transacciones rápidas.
-   **AurumUplink:** Centro de notificaciones y estado de conexión.
-   **Settings:** Configuración del sistema (conectado a API).

### Backend (API REST & WebSocket)
-   **Base de Datos:** Migraciones automáticas al inicio (`initDB`) para tablas:
    -   `clients`
    -   `projects`
    -   `transactions`
    -   `quotations`
    -   `incoming_requests`
    -   `campaigns`
    -   `app_settings`
-   **Endpoints Funcionales:**
    -   `GET /api/health`: Estado del servidor.
    -   `GET /api/clients`: Listado de clientes.
    -   `GET /api/projects`: Listado de proyectos.
    -   `POST /api/transactions`: Registro de transacciones con broadcast WebSocket.
    -   `GET /api/leads`: Listado de solicitudes entrantes.
    -   `GET/POST /api/settings`: Gestión de configuración.
    -   `GET/POST/DELETE /api/quotations`: Gestión de cotizaciones.
    -   `GET/POST/PUT/DELETE /api/campaigns`: Gestión de campañas.
    -   `POST /api/ai/generate`: Proxy seguro para IA (Google GenAI).

## 3. Integraciones
-   **Google GenAI:** Integrado en el frontend para generación de justificaciones en cotizaciones.
-   **WebSocket:** Sistema de transmisión de eventos en tiempo real (ej. nuevas ventas).
