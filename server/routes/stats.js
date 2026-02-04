const express = require('express');
const router = express.Router();
const { getDb } = require('../database/turso');

// Get summary stats for a date range
router.get('/summary', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const db = getDb();
    
    if (!startDate || !endDate) {
      return res.status(400).json({ 
        success: false, 
        error: 'startDate and endDate are required' 
      });
    }
    
    // Total income
    const income = await db.execute({
      sql: `
        SELECT COALESCE(SUM(amount), 0) as total
        FROM transactions
        WHERE type = 'income' AND date BETWEEN ? AND ?
      `,
      args: [startDate, endDate]
    });
    
    // Total expenses
    const expenses = await db.execute({
      sql: `
        SELECT COALESCE(SUM(amount), 0) as total
        FROM transactions
        WHERE type = 'expense' AND date BETWEEN ? AND ?
      `,
      args: [startDate, endDate]
    });
    
    // Balance
    const balance = income.rows[0].total - expenses.rows[0].total;
    
    // Transaction count
    const count = await db.execute({
      sql: `
        SELECT COUNT(*) as total
        FROM transactions
        WHERE date BETWEEN ? AND ?
      `,
      args: [startDate, endDate]
    });
    
    res.json({
      success: true,
      data: {
        income: income.rows[0].total,
        expenses: expenses.rows[0].total,
        balance: balance,
        transactionCount: count.rows[0].total
      }
    });
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get expenses by category
router.get('/by-category', async (req, res) => {
  try {
    const { startDate, endDate, type = 'expense' } = req.query;
    const db = getDb();
    
    if (!startDate || !endDate) {
      return res.status(400).json({ 
        success: false, 
        error: 'startDate and endDate are required' 
      });
    }
    
    const result = await db.execute({
      sql: `
        SELECT 
          c.id,
          c.name,
          c.icon,
          c.color,
          COALESCE(SUM(t.amount), 0) as total,
          COUNT(t.id) as count
        FROM categories c
        LEFT JOIN transactions t ON c.id = t.category_id
          AND t.date BETWEEN ? AND ?
          AND t.type = ?
        WHERE c.type = ?
        GROUP BY c.id
        ORDER BY total DESC
      `,
      args: [startDate, endDate, type, type]
    });
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching category stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get monthly comparison (current vs previous month)
router.get('/monthly-comparison', async (req, res) => {
  try {
    const { year, month } = req.query;
    const db = getDb();
    
    if (!year || !month) {
      return res.status(400).json({ 
        success: false, 
        error: 'year and month are required' 
      });
    }
    
    // Current month
    const currentStart = `${year}-${String(month).padStart(2, '0')}-01`;
    const currentEnd = new Date(year, month, 0).toISOString().split('T')[0];
    
    // Previous month
    const prevMonth = month === '1' ? '12' : String(parseInt(month) - 1).padStart(2, '0');
    const prevYear = month === '1' ? String(parseInt(year) - 1) : year;
    const prevStart = `${prevYear}-${prevMonth}-01`;
    const prevEnd = new Date(prevYear, prevMonth, 0).toISOString().split('T')[0];
    
    const current = await db.execute({
      sql: `
        SELECT 
          type,
          COALESCE(SUM(amount), 0) as total
        FROM transactions
        WHERE date BETWEEN ? AND ?
        GROUP BY type
      `,
      args: [currentStart, currentEnd]
    });
    
    const previous = await db.execute({
      sql: `
        SELECT 
          type,
          COALESCE(SUM(amount), 0) as total
        FROM transactions
        WHERE date BETWEEN ? AND ?
        GROUP BY type
      `,
      args: [prevStart, prevEnd]
    });
    
    const currentData = {
      income: current.rows.find(r => r.type === 'income')?.total || 0,
      expense: current.rows.find(r => r.type === 'expense')?.total || 0
    };
    
    const previousData = {
      income: previous.rows.find(r => r.type === 'income')?.total || 0,
      expense: previous.rows.find(r => r.type === 'expense')?.total || 0
    };
    
    res.json({
      success: true,
      data: {
        current: currentData,
        previous: previousData,
        change: {
          income: previousData.income > 0 
            ? ((currentData.income - previousData.income) / previousData.income * 100).toFixed(2)
            : 0,
          expense: previousData.expense > 0
            ? ((currentData.expense - previousData.expense) / previousData.expense * 100).toFixed(2)
            : 0
        }
      }
    });
  } catch (error) {
    console.error('Error fetching monthly comparison:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get daily/weekly/monthly trend data
router.get('/trend', async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;
    const db = getDb();
    
    if (!startDate || !endDate) {
      return res.status(400).json({ 
        success: false, 
        error: 'startDate and endDate are required' 
      });
    }
    
    let dateFormat;
    switch(groupBy) {
      case 'week':
        dateFormat = '%Y-%W';
        break;
      case 'month':
        dateFormat = '%Y-%m';
        break;
      default:
        dateFormat = '%Y-%m-%d';
    }
    
    const result = await db.execute({
      sql: `
        SELECT 
          strftime('${dateFormat}', date) as period,
          type,
          SUM(amount) as total
        FROM transactions
        WHERE date BETWEEN ? AND ?
        GROUP BY period, type
        ORDER BY period ASC
      `,
      args: [startDate, endDate]
    });
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching trend data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
