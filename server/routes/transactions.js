const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { getDb } = require('../database/turso');

// Get all transactions with optional filters
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate, type, categoryId, limit = 50, offset = 0 } = req.query;
    const db = getDb();
    
    let query = `
      SELECT 
        t.*,
        c.name as category_name,
        c.icon as category_icon,
        c.color as category_color
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE 1=1
    `;
    
    const args = [];
    
    if (startDate) {
      query += ' AND t.date >= ?';
      args.push(startDate);
    }
    
    if (endDate) {
      query += ' AND t.date <= ?';
      args.push(endDate);
    }
    
    if (type) {
      query += ' AND t.type = ?';
      args.push(type);
    }
    
    if (categoryId) {
      query += ' AND t.category_id = ?';
      args.push(categoryId);
    }
    
    query += ' ORDER BY t.date DESC, t.created_at DESC LIMIT ? OFFSET ?';
    args.push(parseInt(limit), parseInt(offset));
    
    const result = await db.execute({ sql: query, args });
    
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single transaction
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.execute({
      sql: `
        SELECT 
          t.*,
          c.name as category_name,
          c.icon as category_icon,
          c.color as category_color
        FROM transactions t
        LEFT JOIN categories c ON t.category_id = c.id
        WHERE t.id = ?
      `,
      args: [req.params.id]
    });
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create transaction
router.post('/',
  [
    body('description').notEmpty().trim(),
    body('amount').isFloat({ min: 0.01 }),
    body('type').isIn(['income', 'expense']),
    body('date').isISO8601(),
    body('payment_type').optional().isIn(['cash', 'credit', 'debit', 'pix', 'installment']),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const db = getDb();
      const {
        description,
        amount,
        type,
        category_id,
        payment_type,
        date,
        notes,
        total_installments
      } = req.body;

      // If it's an installment purchase, create multiple transactions
      if (payment_type === 'installment' && total_installments > 1) {
        const installmentAmount = amount / total_installments;
        const transactions = [];
        const baseDate = new Date(date);
        
        for (let i = 1; i <= total_installments; i++) {
          const installmentDate = new Date(baseDate);
          installmentDate.setMonth(baseDate.getMonth() + (i - 1));
          
          const result = await db.execute({
            sql: `
              INSERT INTO transactions 
              (description, amount, type, category_id, payment_type, installment_number, total_installments, date, notes)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            args: [
              `${description} (${i}/${total_installments})`,
              installmentAmount,
              type,
              category_id || null,
              payment_type,
              i,
              total_installments,
              installmentDate.toISOString().split('T')[0],
              notes || null
            ]
          });
          
          transactions.push({ id: result.lastInsertRowid, installment: i });
        }
        
        res.status(201).json({
          success: true,
          message: `${total_installments} installments created`,
          data: transactions
        });
      } else {
        // Single transaction
        const result = await db.execute({
          sql: `
            INSERT INTO transactions 
            (description, amount, type, category_id, payment_type, date, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `,
          args: [description, amount, type, category_id || null, payment_type || null, date, notes || null]
        });

        const newTransaction = await db.execute({
          sql: 'SELECT * FROM transactions WHERE id = ?',
          args: [result.lastInsertRowid]
        });

        res.status(201).json({
          success: true,
          data: newTransaction.rows[0]
        });
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// Update transaction
router.put('/:id',
  [
    body('description').optional().trim(),
    body('amount').optional().isFloat({ min: 0.01 }),
    body('type').optional().isIn(['income', 'expense']),
    body('date').optional().isISO8601(),
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

      updates.push('updated_at = CURRENT_TIMESTAMP');
      args.push(req.params.id);

      await db.execute({
        sql: `UPDATE transactions SET ${updates.join(', ')} WHERE id = ?`,
        args
      });

      const updated = await db.execute({
        sql: 'SELECT * FROM transactions WHERE id = ?',
        args: [req.params.id]
      });

      res.json({ success: true, data: updated.rows[0] });
    } catch (error) {
      console.error('Error updating transaction:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// Delete transaction
router.delete('/:id', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.execute({
      sql: 'DELETE FROM transactions WHERE id = ?',
      args: [req.params.id]
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }

    res.json({ success: true, message: 'Transaction deleted' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
