import pool from '../config/db.js';

export async function getStores(req, res, next) {
  try {
    const { name, address } = req.query;
    const userId = req.user.id;

    const conditions = [];
    const params = [];

    if (name) { conditions.push('s.name LIKE ?'); params.push(`%${name}%`); }
    if (address) { conditions.push('s.address LIKE ?'); params.push(`%${address}%`); }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [rows] = await pool.query(
      `SELECT s.id, s.name, s.email, s.address,
              COALESCE(ROUND(AVG(r.value), 1), 0) as avg_rating,
              COUNT(r.id) as rating_count,
              my.value as my_rating,
              my.id as my_rating_id
       FROM stores s
       LEFT JOIN ratings r   ON r.store_id = s.id
       LEFT JOIN ratings my  ON my.store_id = s.id AND my.user_id = ?
       ${where}
       GROUP BY s.id, my.value, my.id
       ORDER BY s.name ASC`,
      [userId, ...params]
    );

    return res.json(rows);
  } catch (err) {
    next(err);
  }
}

export async function getStoreById(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [rows] = await pool.execute(
      `SELECT s.id, s.name, s.email, s.address,
              COALESCE(ROUND(AVG(r.value), 1), 0) as avg_rating,
              COUNT(r.id) as rating_count,
              my.value as my_rating,
              my.id as my_rating_id
       FROM stores s
       LEFT JOIN ratings r  ON r.store_id = s.id
       LEFT JOIN ratings my ON my.store_id = s.id AND my.user_id = ?
       WHERE s.id = ?
       GROUP BY s.id, my.value, my.id`,
      [userId, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }

    return res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}
