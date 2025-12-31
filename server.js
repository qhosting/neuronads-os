
const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const Redis = require('ioredis');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:6af2bce2e625d3e224fd@qhosting_neuronads-os-db:5432/neuronads-os-db?sslmode=disable',
});

// Configuración de Redis
const redis = new Redis(process.env.REDIS_URL || 'redis://default:5faf81de3571e8b7146c@qhosting_redis:6379');

app.use(express.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '.')));

// API: Healthcheck para Easypanel
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = await pool.query('SELECT NOW()');
    const redisStatus = await redis.ping();
    
    res.json({
      status: 'ONLINE',
      node: 'ALPHA_CENTRAL',
      timestamp: new Date(),
      infrastructure: {
        database: dbStatus ? 'CONNECTED' : 'ERROR',
        cache: redisStatus === 'PONG' ? 'CONNECTED' : 'ERROR'
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'DEGRADED', error: err.message });
  }
});

// API: Ejemplo de log de transacción en Postgres
app.post('/api/transactions', async (req, res) => {
  const { clientId, total, items } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO transactions (client_id, total, items, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [clientId, total, JSON.stringify(items)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Manejo de SPA: Redirigir todas las peticiones al index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[NEURONADS OS] Node operativo en puerto ${PORT}`);
  console.log(`[INFRA] Handshake con Postgres y Redis establecido.`);
});
