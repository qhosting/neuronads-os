
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

// Configuración de PostgreSQL (Producción)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:6af2bce2e625d3e224fd@qhosting_neuronads-os-db:5432/neuronads-os-db?sslmode=disable',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// Configuración de Redis (Cache & PubSub)
const redis = new Redis(process.env.REDIS_URL || 'redis://default:5faf81de3571e8b7146c@qhosting_redis:6379');

/**
 * MIGRACIONES Y ESQUEMA DE BASE DE DATOS
 */
const initDB = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Tabla de Clientes
    await client.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT CHECK (type IN ('SATELLITE', 'EXTERNAL')),
        status TEXT DEFAULT 'ACTIVE',
        fee NUMERIC DEFAULT 0,
        renewal_date DATE,
        contracted_services JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Tabla de Proyectos
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        progress INTEGER DEFAULT 0,
        synapse_level INTEGER DEFAULT 50,
        tasks JSONB DEFAULT '[]',
        roadmap JSONB DEFAULT '[]',
        feedbacks JSONB DEFAULT '[]',
        status TEXT DEFAULT 'EXECUTING',
        progress_image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Tabla de Transacciones (POS)
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        client_id TEXT, -- Puede ser un ID de tabla clients o un string temporal
        client_name TEXT,
        items JSONB NOT NULL,
        total NUMERIC NOT NULL,
        status TEXT DEFAULT 'COMPLETED',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Tabla de Cotizaciones
    await client.query(`
      CREATE TABLE IF NOT EXISTS quotations (
        id TEXT PRIMARY KEY, -- Formato QT-XXXX
        client_name TEXT NOT NULL,
        title TEXT NOT NULL,
        items JSONB NOT NULL,
        total NUMERIC NOT NULL,
        status TEXT DEFAULT 'DRAFT',
        ai_justification TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Tabla de Solicitudes Entrantes (Leads)
    await client.query(`
      CREATE TABLE IF NOT EXISTS incoming_requests (
        id SERIAL PRIMARY KEY,
        platform TEXT NOT NULL,
        client_name TEXT NOT NULL,
        message TEXT,
        processed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. Tabla de Campañas AdTech
    await client.query(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        platform TEXT NOT NULL,
        budget NUMERIC DEFAULT 0,
        spent NUMERIC DEFAULT 0,
        status TEXT DEFAULT 'ACTIVE',
        roas NUMERIC DEFAULT 0,
        last_sync TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 7. Tabla de Configuración de Aplicación (PDF Config, etc)
    await client.query(`
      CREATE TABLE IF NOT EXISTS app_settings (
        key TEXT PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // SEED: Datos iniciales si la tabla de clientes está vacía
    const clientCount = await client.query('SELECT COUNT(*) FROM clients');
    if (parseInt(clientCount.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO clients (name, type, status, fee, renewal_date) 
        VALUES ('Corporación Alpha', 'SATELLITE', 'ACTIVE', 5000, '2025-12-31');
      `);
      console.log('[SEED] Cliente inicial creado.');
    }

    await client.query('COMMIT');
    console.log('[DB] Estructura sináptica de tablas establecida correctamente.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[DB ERROR] Error en migración:', err);
  } finally {
    client.release();
  }
};

initDB();

app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

/**
 * WEBSOCKETS
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
  ws.send(JSON.stringify({ type: 'SYSTEM_HANDSHAKE', payload: { status: 'STABLE' } }));
});

/**
 * API ENDPOINTS ACTUALIZADOS
 */

// Configuración persistente (PDF)
app.get('/api/settings/:key', async (req, res) => {
  try {
    const result = await pool.query('SELECT value FROM app_settings WHERE key = $1', [req.params.key]);
    res.json(result.rows[0]?.value || {});
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/settings', async (req, res) => {
  const { key, value } = req.body;
  try {
    await pool.query(
      'INSERT INTO app_settings (key, value, updated_at) VALUES ($1, $2, NOW()) ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()',
      [key, JSON.stringify(value)]
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Clientes & Proyectos
app.get('/api/clients', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clients ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/projects', async (req, res) => {
  try {
    const result = await pool.query('SELECT p.*, c.name as client_name FROM projects p LEFT JOIN clients c ON p.client_id = c.id ORDER BY p.created_at DESC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Transacciones
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

// Leads Entrantes
app.get('/api/leads', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM incoming_requests ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(PORT, () => console.log(`[NEURONADS OS] Operativo en puerto ${PORT}`));
