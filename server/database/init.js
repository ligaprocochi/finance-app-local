const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../data/finance.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

function initDatabase() {
  console.log('🗄️  Initializing database...');

  // Categories table
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
      icon TEXT,
      color TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Transactions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
      category_id INTEGER,
      payment_type TEXT CHECK(payment_type IN ('cash', 'credit', 'debit', 'pix', 'installment')),
      installment_number INTEGER,
      total_installments INTEGER,
      parent_transaction_id INTEGER,
      date DATE NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
      FOREIGN KEY (parent_transaction_id) REFERENCES transactions(id) ON DELETE CASCADE
    )
  `);

  // Insert default categories if table is empty
  const count = db.prepare('SELECT COUNT(*) as count FROM categories').get();
  
  if (count.count === 0) {
    console.log('📝 Inserting default categories...');
    
    const defaultCategories = [
      // Income categories
      { name: 'Salário', type: 'income', icon: 'Briefcase', color: '#10B981' },
      { name: 'Freelance', type: 'income', icon: 'Code', color: '#3B82F6' },
      { name: 'Investimentos', type: 'income', icon: 'TrendingUp', color: '#8B5CF6' },
      { name: 'Outros Ganhos', type: 'income', icon: 'Plus', color: '#06B6D4' },
      
      // Expense categories
      { name: 'Alimentação', type: 'expense', icon: 'UtensilsCrossed', color: '#EF4444' },
      { name: 'Transporte', type: 'expense', icon: 'Car', color: '#F59E0B' },
      { name: 'Moradia', type: 'expense', icon: 'Home', color: '#EC4899' },
      { name: 'Saúde', type: 'expense', icon: 'Heart', color: '#EF4444' },
      { name: 'Educação', type: 'expense', icon: 'GraduationCap', color: '#8B5CF6' },
      { name: 'Lazer', type: 'expense', icon: 'Gamepad2', color: '#06B6D4' },
      { name: 'Compras', type: 'expense', icon: 'ShoppingCart', color: '#EC4899' },
      { name: 'Contas', type: 'expense', icon: 'Receipt', color: '#F59E0B' },
      { name: 'Outros Gastos', type: 'expense', icon: 'MoreHorizontal', color: '#6B7280' }
    ];

    const insertCategory = db.prepare(
      'INSERT INTO categories (name, type, icon, color) VALUES (?, ?, ?, ?)'
    );

    const insertMany = db.transaction((categories) => {
      for (const cat of categories) {
        insertCategory.run(cat.name, cat.type, cat.icon, cat.color);
      }
    });

    insertMany(defaultCategories);
    console.log('✅ Default categories created');
  }

  console.log('✅ Database initialized successfully');
}

function getDb() {
  return db;
}

module.exports = { initDatabase, getDb };
