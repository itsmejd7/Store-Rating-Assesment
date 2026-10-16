import pool from '../config/db.js';

export async function getDashboard(req, res, next) {
  try {
    const ownerId = req.user.id;

    const [storeRows] = await pool.execute(
      'SELECT id, name, email, address FROM stores WHERE owner_id = ?',
      [ownerId]
    );

    if (storeRows.length === 0) {
      return res.status(404).json({ error: 'No store found for your account. Ask an administrator to create your store.' });
    }

    const store = storeRows[0];

    const [[{ avgRating, ratingCount }]] = await pool.execute(
      'SELECT COALESCE(ROUND(AVG(value), 1), 0) as avgRating, COUNT(*) as ratingCount FROM ratings WHERE store_id = ?',
      [store.id]
    );

    const [ratings] = await pool.execute(
      `SELECT r.id, r.value, r.created_at, r.updated_at,
              u.name as user_name, u.email as user_email
       FROM ratings r
       JOIN users u ON u.id = r.user_id
       WHERE r.store_id = ?
       ORDER BY r.created_at DESC`,
      [store.id]
    );

    return res.json({
      store,
      avgRating,
      ratingCount,
      ratings,
    });
  } catch (err) {
    next(err);
  }
}
