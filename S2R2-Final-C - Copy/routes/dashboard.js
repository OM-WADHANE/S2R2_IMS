const express = require('express');
const db = require('../config/database');

const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    const [rawCounts, finishedCounts, clientCounts, lowStockList, recentActivity] = await Promise.all([
      db.query(`
        SELECT
          COUNT(*)::int AS total_items,
          COUNT(*) FILTER (WHERE quantity <= COALESCE(min_stock_level, 10))::int AS low_stock_count
        FROM raw_materials
      `),
      db.query(`
        SELECT
          COUNT(*)::int AS total_products,
          COUNT(*) FILTER (WHERE status = 'active')::int AS ready_stock
        FROM finished_products
      `),
      db.query(`
        SELECT
          COUNT(*)::int AS total_clients,
          COUNT(*) FILTER (WHERE created_at >= date_trunc('month', now()))::int AS new_this_month
        FROM clients
      `),
      db.query(`
        SELECT id, name, quantity, unit, min_stock_level, updated_at
        FROM raw_materials
        WHERE quantity <= COALESCE(min_stock_level, 10)
        ORDER BY quantity ASC, updated_at DESC
        LIMIT 8
      `),
      db.query(`
        SELECT 'client' AS module, id, name AS label, created_at AS event_time
        FROM clients
        UNION ALL
        SELECT 'raw_material' AS module, id, name AS label, updated_at AS event_time
        FROM raw_materials
        UNION ALL
        SELECT 'finished_product' AS module, id, name AS label, updated_at AS event_time
        FROM finished_products
        ORDER BY event_time DESC
        LIMIT 10
      `)
    ]);

    res.json({
      success: true,
      generated_at: new Date().toISOString(),
      stats: {
        raw_materials: rawCounts.rows[0],
        finished_products: finishedCounts.rows[0],
        clients: clientCounts.rows[0]
      },
      low_stock_alerts: lowStockList.rows,
      recent_activity: recentActivity.rows,
      stock_movement: {
        labels: ['Raw Materials', 'Finished Products', 'Clients'],
        values: [
          rawCounts.rows[0].total_items || 0,
          finishedCounts.rows[0].total_products || 0,
          clientCounts.rows[0].total_clients || 0
        ]
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

module.exports = router;
