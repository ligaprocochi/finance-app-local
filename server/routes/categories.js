const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { getDb } = require('../database/turso');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const db = getDb();
    
    let query = 'SELECT * FROM categories';
    const args = [];
    
    if (type) {
      query += ' WHERE type = ?';
      args.push(type);
    }
    
    query += ' ORDER BY name ASC';
    
    const result = await db.execute({ sql: query, args });
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single category
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.execute({
      sql: 'SELECT * FROM categories WHERE id = ?',
      args: [req.params.id]
    });
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create category
router.post('/',
  [
    body('name').notEmpty().trim(),
    body('type').isIn(['income', 'expense']),
    body('icon').optional().trim(),
    body('color').optional().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const db = getDb();
      const { name, type, icon, color } = req.body;

      const result = await db.execute({
        sql: 'INSERT INTO categories (name, type, icon, color) VALUES (?, ?, ?, ?)',
        args: [name, type, icon || null, color || null]
      });

      const newCategory = await db.execute({
        sql: 'SELECT * FROM categories WHERE id = ?',
        args: [result.lastInsertRowid]
      });

      res.status(201).json({ success: true, data: newCategory.rows[0] });
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ 
          success: false, 
          error: 'Category name already exists' 
        });
      }
      console.error('Error creating category:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// Update category
router.put('/:id',
  [
    body('name').optional().trim(),
    body('type').optional().isIn(['income', 'expense']),
    body('icon').optional().trim(),
    body('color').optional().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const db = getDb();
      const updates = [];
      const args = [];

      Object.keys(req.body).forEach(key => {
        if (req.body[key] !== undefined) {
          updates.push(`${key} = ?`);
          args.push(req.body[key]);
        }
      });

      if (updates.length === 0) {
        return res.status(400).json({ success: false, error: 'No updates provided' });
      }

      args.push(req.params.id);

      await db.execute({
        sql: `UPDATE categories SET ${updates.join(', ')} WHERE id = ?`,
        args
      });

      const updated = await db.execute({
        sql: 'SELECT * FROM categories WHERE id = ?',
        args: [req.params.id]
      });

      res.json({ success: true, data: updated.rows[0] });
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// Delete category
router.delete('/:id', async (req, res) => {
  try {
    const db = getDb();
    
    // Check if category is being used
    const usage = await db.execute({
      sql: 'SELECT COUNT(*) as count FROM transactions WHERE category_id = ?',
      args: [req.params.id]
    });
    
    if (usage.rows[0].count > 0) {
      return res.status(400).json({ 
        success: false, 
        error: `Cannot delete category. It is being used by ${usage.rows[0].count} transaction(s).` 
      });
    }
    
    const result = await db.execute({
      sql: 'DELETE FROM categories WHERE id = ?',
      args: [req.params.id]
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
