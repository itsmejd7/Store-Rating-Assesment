import { validationResult } from 'express-validator';
import pool from '../config/db.js';
import bcrypt from 'bcrypt';

const BCRYPT_ROUNDS = 12;

const ALLOWED_USER_SORT = ['name', 'email', 'role', 'created_at'];
const ALLOWED_STORE_SORT = ['name', 'email', 'address', 'created_at', 'avg_rating'];

function formatValidationErrors(result) {
  return result.array().map((e) => ({ field: e.path, message: e.msg }));
}

export async function getDashboard(req, res, next) {
  try {
    const [[{ totalUsers }]] = await pool.execute('SELECT COUNT(*) as totalUsers FROM users');
    const [[{ totalStores }]] = await pool.execute('SELECT COUNT(*) as totalStores FROM stores');
    const [[{ totalRatings }]] = await pool.execute('SELECT COUNT(*) as totalRatings FROM ratings');
    return res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    next(err);
  }
}

export async function getUsers(req, res, next) {
  try {
    const { name, email, role, sort, order } = req.query;

    const conditions = [];
    const params = [];

    if (name) { conditions.push('u.name LIKE ?'); params.push(`%${name}%`); }
    if (email) { conditions.push('u.email LIKE ?'); params.push(`%${email}%`); }
    if (role && ['admin', 'user', 'store_owner'].includes(role)) {
      conditions.push('u.role = ?');
      params.push(role);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const sortCol = ALLOWED_USER_SORT.includes(sort) ? `u.${sort}` : 'u.name';
    const sortDir = order === 'desc' ? 'DESC' : 'ASC';

    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, u.role, u.address, u.created_at FROM users u ${where} ORDER BY ${sortCol} ${sortDir}`,
      params
    );

    return res.json(rows);
  } catch (err) {
    next(err);
  }
}

export async function createUser(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: formatValidationErrors(errors) });
    }

    const { name, email, password, role, address } = req.body;

    const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    const password_hash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password_hash, role, address) VALUES (?, ?, ?, ?, ?)',
      [name, email, password_hash, role, address || null]
    );

    const [newUser] = await pool.execute(
      'SELECT id, name, email, role, address, created_at FROM users WHERE id = ?',
      [result.insertId]
    );

    return res.status(201).json(newUser[0]);
  } catch (err) {
    next(err);
  }
}

export async function getUserById(req, res, next) {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(
      'SELECT id, name, email, role, address, created_at FROM users WHERE id = ?',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = rows[0];

    if (user.role === 'store_owner') {
      const [stores] = await pool.execute(
        `SELECT s.id, s.name, s.email, s.address, s.created_at,
                COALESCE(ROUND(AVG(r.value), 1), 0) as avg_rating
         FROM stores s
         LEFT JOIN ratings r ON r.store_id = s.id
         WHERE s.owner_id = ?
         GROUP BY s.id`,
        [id]
      );
      user.store = stores[0] || null;
    }

    if (user.role === 'user') {
      const [[{ ratingCount }]] = await pool.execute(
        'SELECT COUNT(*) as ratingCount FROM ratings WHERE user_id = ?',
        [id]
      );
      user.ratingCount = ratingCount;
    }

    return res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function getStores(req, res, next) {
  try {
    const { name, address, sort, order } = req.query;

    const conditions = [];
    const params = [];

    if (name) { conditions.push('s.name LIKE ?'); params.push(`%${name}%`); }
    if (address) { conditions.push('s.address LIKE ?'); params.push(`%${address}%`); }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const sortCol = ALLOWED_STORE_SORT.includes(sort)
      ? (sort === 'avg_rating' ? 'avg_rating' : `s.${sort}`)
      : 's.name';
    const sortDir = order === 'desc' ? 'DESC' : 'ASC';

    const [rows] = await pool.query(
      `SELECT s.id, s.name, s.email, s.address, s.created_at,
              u.id as owner_id, u.name as owner_name, u.email as owner_email,
              COALESCE(ROUND(AVG(r.value), 1), 0) as avg_rating,
              COUNT(r.id) as rating_count
       FROM stores s
       JOIN users u ON u.id = s.owner_id
       LEFT JOIN ratings r ON r.store_id = s.id
       ${where}
       GROUP BY s.id
       ORDER BY ${sortCol} ${sortDir}`,
      params
    );

    return res.json(rows);
  } catch (err) {
    next(err);
  }
}

export async function createStore(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: formatValidationErrors(errors) });
    }

    const { name, email, address, owner_id } = req.body;

    const [ownerRows] = await pool.execute(
      "SELECT id FROM users WHERE id = ? AND role = 'store_owner'",
      [owner_id]
    );
    if (ownerRows.length === 0) {
      return res.status(400).json({ error: 'owner_id must reference a user with role store_owner' });
    }

    const [existing] = await pool.execute('SELECT id FROM stores WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Store email already in use' });
    }

    const [result] = await pool.execute(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address || null, owner_id]
    );

    const [newStore] = await pool.execute(
      `SELECT s.id, s.name, s.email, s.address, s.created_at, u.name as owner_name
       FROM stores s JOIN users u ON u.id = s.owner_id
       WHERE s.id = ?`,
      [result.insertId]
    );

    return res.status(201).json(newStore[0]);
  } catch (err) {
    next(err);
  }
}

export async function getStoreById(req, res, next) {
  try {
    const { id } = req.params;

    const [storeRows] = await pool.execute(
      `SELECT s.id, s.name, s.email, s.address, s.created_at, s.owner_id,
              u.name as owner_name, u.email as owner_email, u.address as owner_address,
              COALESCE(ROUND(AVG(r.value), 1), 0) as avg_rating,
              COUNT(r.id) as rating_count
       FROM stores s
       JOIN users u ON u.id = s.owner_id
       LEFT JOIN ratings r ON r.store_id = s.id
       WHERE s.id = ?
       GROUP BY s.id`,
      [id]
    );

    if (storeRows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const store = storeRows[0];

    const [ratings] = await pool.execute(
      `SELECT r.id, r.value, r.created_at, r.updated_at,
              u.id as user_id, u.name as user_name, u.email as user_email
       FROM ratings r
       JOIN users u ON u.id = r.user_id
       WHERE r.store_id = ?
       ORDER BY r.created_at DESC`,
      [id]
    );

    store.ratings = ratings;

    return res.json(store);
  } catch (err) {
    next(err);
  }
}
