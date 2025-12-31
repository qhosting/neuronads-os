
const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const { Pool } = require('pg');
const Redis = require('ioredis');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

// Configuración de PostgreSQL con fallback para desarrollo local/Easypanel
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:6af2bce2e625d3e224fd@qhosting_neuronads-os-db:5432/neuronads-os-db?sslmode=disable',
});

// Configuración de Redis
const redis = new Redis(process.env.REDIS_URL || 'redis://default:5faf81de3571e8b7146c@qhosting_redis:6379');

app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

/**
 * WEBSOCKETS: Gestión de Nodos Conectados
 */
const broadcast = (data) => {
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

wss.on('connection', (ws) => {
  console.log('[NEURONADS OS] Nuevo nodo de cliente sincronizado vía WebSocket.');
  
  ws.send(JSON.stringify({ 
    type: 'SYSTEM_HANDSHAKE', 
    payload: { status: 'STABLE', node: 'ALPHA_CENTRAL', protocol: '8888' } 
  }));

  ws.on('close', () => {
    console.log('[NEURONADS OS] Nodo de cliente desconectado.');
  });
});

/**
 * API ENDPOINTS
 */

// Healthcheck enriquecido para Easypanel y Monitoreo de Red
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = await pool.query('SELECT NOW()');
    const redisStatus = await redis.ping();
    
    const healthData = {
      status: 'ONLINE',
      node: 'ALPHA_CENTRAL',
      timestamp: new Date(),
      infrastructure: {
        database: dbStatus ? 'CONNECTED' : 'ERROR',
        cache: redisStatus === 'PONG' ? 'CONNECTED' : 'ERROR',
        websockets: wss.clients.size
      }
    };

    // Notificar actualización de estado a través de WS
    broadcast({ type: 'NODE_STATUS_UPDATE', payload: healthData });

    res.json(healthData);
  } catch (err) {
    res.status(500).json({ status: 'DEGRADED', error: err.message });
  }
});

// Registro de Transacción con Notificación en Tiempo Real
app.post('/api/transactions', async (req, res) => {
  const { clientId, total, items, clientName } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO transactions (client_id, total, items, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [clientId, total, JSON.stringify(items)]
    );

    const transaction = result.rows[0];

    // Transmitir evento de abundancia a todos los nodos conectados (Broadcasting)
    broadcast({
      type: 'NEW_TRANSACTION',
      payload: {
        id: transaction.id,
        clientName: clientName || 'Anonymous Node',
        total: transaction.total,
        timestamp: transaction.created_at
      }
    });

    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Manejo de SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor consolidado (HTTP + WS)
server.listen(PORT, () => {
  console.log(`[NEURONADS OS] Servidor operativo en puerto ${PORT}`);
  console.log(`[INFRA] Handshake con Postgres y Redis establecido.`);
  console.log(`[UPLINK] WebSocket Server escuchando para sincronización en tiempo real.`);
});
