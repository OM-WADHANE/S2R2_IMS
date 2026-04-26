const express = require('express');
const db = require('../config/database');

const router = express.Router();

let schemaReady = false;
async function ensureClientSchema() {
  if (schemaReady) return;
  await db.query(`
    ALTER TABLE clients
      ADD COLUMN IF NOT EXISTS company_name VARCHAR(150),
      ADD COLUMN IF NOT EXISTS address TEXT,
      ADD COLUMN IF NOT EXISTS gst_no VARCHAR(30),
      ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active'
  `);
  schemaReady = true;
}

function mapClientRow(row) {
  return {
    id: row.id,
    client_name: row.name || '',
    company_name: row.company_name || row.name || '',
    phone: row.phone || '',
    email: row.email || '',
    address: row.address || row.area || '',
    gst_no: row.gst_no || '',
    status: row.status || 'active',
    created_at: row.created_at,
    contact_person: row.contact_person || '',
    area: row.area || '',
    join_date: row.join_date
  };
}

// GET /api/clients
router.get('/', async (req, res) => {
  try {
    await ensureClientSchema();
    const result = await db.query(`
      SELECT id, name, company_name, phone, email, address, gst_no, status, created_at, area, contact_person, join_date
      FROM clients
      ORDER BY created_at DESC
    `);
    const clients = result.rows.map(mapClientRow);
    res.json({ success: true, count: clients.length, clients });
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// GET /api/clients/export/pdf
router.get('/export/pdf', async (req, res) => {
  try {
    await ensureClientSchema();
    const result = await db.query(`
      SELECT id, name, company_name, phone, email, address, gst_no, status, created_at
      FROM clients
      ORDER BY created_at DESC
    `);
    res.json({
      success: true,
      generated_at: new Date().toISOString(),
      company_name: 'Inventory Management System | S2R2',
      clients: result.rows.map(mapClientRow)
    });
  } catch (error) {
    console.error('Export clients pdf data error:', error);
    res.status(500).json({ error: 'Failed to build PDF export data' });
  }
});

// GET /api/clients/:id
router.get('/:id', async (req, res) => {
  try {
    await ensureClientSchema();
    const { id } = req.params;
    const result = await db.query(`
      SELECT id, name, company_name, phone, email, address, gst_no, status, created_at, area, contact_person, join_date
      FROM clients
      WHERE id = $1
    `, [id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Client not found' });
    res.json({ success: true, client: mapClientRow(result.rows[0]) });
  } catch (error) {
    console.error('Get client error:', error);
    res.status(500).json({ error: 'Failed to fetch client' });
  }
});

// POST /api/clients
router.post('/', async (req, res) => {
  try {
    await ensureClientSchema();
    const {
      client_name,
      company_name,
      phone,
      email,
      address,
      gst_no,
      status
    } = req.body;
    if (!client_name?.trim()) return res.status(400).json({ error: 'client_name is required' });

    const result = await db.query(
      `INSERT INTO clients (name, company_name, phone, email, address, gst_no, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, name, company_name, phone, email, address, gst_no, status, created_at, area, contact_person, join_date`,
      [
        client_name.trim(),
        company_name?.trim() || client_name.trim(),
        phone?.trim() || null,
        email?.trim() || null,
        address?.trim() || null,
        gst_no?.trim() || null,
        status?.trim() || 'active'
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      client: mapClientRow(result.rows[0])
    });
  } catch (error) {
    console.error('Create client error:', error);
    if (error.code === '23505') return res.status(409).json({ error: 'Email already exists' });
    res.status(500).json({ error: 'Failed to create client' });
  }
});

// PUT /api/clients/:id
router.put('/:id', async (req, res) => {
  try {
    await ensureClientSchema();
    const { id } = req.params;
    const {
      client_name,
      company_name,
      phone,
      email,
      address,
      gst_no,
      status
    } = req.body;

    const result = await db.query(
      `UPDATE clients
       SET name = COALESCE($1, name),
           company_name = COALESCE($2, company_name),
           phone = COALESCE($3, phone),
           email = COALESCE($4, email),
           address = COALESCE($5, address),
           gst_no = COALESCE($6, gst_no),
           status = COALESCE($7, status)
       WHERE id = $8
       RETURNING id, name, company_name, phone, email, address, gst_no, status, created_at, area, contact_person, join_date`,
      [
        client_name?.trim() || null,
        company_name?.trim() || null,
        phone?.trim() || null,
        email?.trim() || null,
        address?.trim() || null,
        gst_no?.trim() || null,
        status?.trim() || null,
        id
      ]
    );

    if (!result.rows.length) return res.status(404).json({ error: 'Client not found' });
    res.json({ success: true, message: 'Client updated successfully', client: mapClientRow(result.rows[0]) });
  } catch (error) {
    console.error('Update client error:', error);
    if (error.code === '23505') return res.status(409).json({ error: 'Email already exists' });
    res.status(500).json({ error: 'Failed to update client' });
  }
});

// DELETE /api/clients/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM clients WHERE id = $1 RETURNING id, name', [id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Client not found' });
    res.json({ success: true, message: 'Client deleted successfully', client: result.rows[0] });
  } catch (error) {
    console.error('Delete client error:', error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

module.exports = router;
