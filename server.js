
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

// Configuración de PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:6af2bce2e625d3e224fd@qhosting_neuronads-os-db:5432/neuronads-os-db?sslmode=disable',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// Configuración de Redis
const redis = new Redis(process.env.REDIS_URL || 'redis://default:5faf81de3571e8b7146c@qhosting_redis:6379');

// Inicialización de DB: Esquema de Producción Completo
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT DEFAULT 'EXTERNAL',
        status TEXT DEFAULT 'ACTIVE',
        fee NUMERIC DEFAULT 0,
        renewal_date DATE,
        contracted_services JSONB DEFAULT '[]'
      );

      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        client_id INTEGER REFERENCES clients(id),
        progress INTEGER DEFAULT 0,
        synapse_level INTEGER DEFAULT 50,
        tasks JSONB DEFAULT '[]',
        roadmap JSONB DEFAULT '[]',
        feedbacks JSONB DEFAULT '[]',
        progress_image TEXT
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        client_id TEXT,
        client_name TEXT,
        total NUMERIC,
        items JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS campaign_metrics (
        id SERIAL PRIMARY KEY,
        platform TEXT,
        roas NUMERIC,
        spent NUMERIC,
        budget NUMERIC,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('[DB] Infraestructura de tablas de producción verificada.');
  } catch (err) {
    console.error('[DB ERROR] Fallo en inicialización de tablas:', err);
  }
};

initDB();

app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

const broadcast = (data) => {
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

/**
 * API ENDPOINTS: PRODUCCIÓN REAL
 */

// CLIENTES
app.get('/api/clients', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clients ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PROYECTOS
app.get('/api/projects', async (req, res) => {
  try {
    const result = await pool.query('SELECT p.*, c.name as client_name FROM projects p LEFT JOIN clients c ON p.client_id = c.id');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// MÉTRICAS DASHBOARD
app.get('/api/metrics', async (req, res) => {
  try {
    const transactions = await pool.query('SELECT SUM(total) as total_revenue, COUNT(*) as count FROM transactions');
    const clients = await pool.query('SELECT COUNT(*) as count FROM clients WHERE status = $1', ['ACTIVE']);
    
    res.json({
      revenue: transactions.rows[0].total_revenue || 0,
      activeClients: clients.rows[0].count || 0,
      globalRoas: 4.2 // En producción real, esto se calcularía de APIs externas
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/transactions', async (req, res) => {
  const { clientId, total, items, clientName } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO transactions (client_id, client_name, total, items, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [clientId, clientName, total, JSON.stringify(items)]
    );
    broadcast({ type: 'NEW_TRANSACTION', payload: result.rows[0] });
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(PORT, () => console.log(`[NEURONADS OS] Producción Uplink en puerto ${PORT}`));
