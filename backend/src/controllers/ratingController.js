import { validationResult } from 'express-validator';
import pool from '../config/db.js';

function formatValidationErrors(result) {
  return result.array().map((e) => ({ field: e.path, message: e.msg }));
}

export async function createRating(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: formatValidationErrors(errors) });
    }

    const { store_id, value } = req.body;
    const userId = req.user.id;

    const [store] = await pool.execute('SELECT id FROM stores WHERE id = ?', [store_id]);
    if (store.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }

    try {
      const [result] = await pool.execute(
        'INSERT INTO ratings (user_id, store_id, value) VALUES (?, ?, ?)',
        [userId, store_id, value]
      );

      const [newRating] = await pool.execute(
        'SELECT id, user_id, store_id, value, created_at, updated_at FROM ratings WHERE id = ?',
        [result.insertId]
      );

      return res.status(201).json(newRating[0]);
    } catch (dbErr) {
      if (dbErr.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'You have already rated this store. Update your existing rating instead.' });
      }
      throw dbErr;
    }
  } catch (err) {
    next(err);
  }
}

export async function updateRating(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: formatValidationErrors(errors) });
    }

    const { id } = req.params;
    const { value } = req.body;
    const userId = req.user.id;

    const [rows] = await pool.execute(
      'SELECT id, user_id FROM ratings WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Rating not found' });
    }

    if (rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'You can only update your own ratings' });
    }

    await pool.execute('UPDATE ratings SET value = ? WHERE id = ?', [value, id]);

    const [updated] = await pool.execute(
      'SELECT id, user_id, store_id, value, created_at, updated_at FROM ratings WHERE id = ?',
      [id]
    );

    return res.json(updated[0]);
  } catch (err) {
    next(err);
  }
}
