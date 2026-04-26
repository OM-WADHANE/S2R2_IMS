const bcrypt = require('bcryptjs');
const db = require('./config/database');

// SQL schema for creating tables
const createTablesSQL = `
-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Raw Materials table
CREATE TABLE IF NOT EXISTS raw_materials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL DEFAULT 0,
    unit VARCHAR(20) NOT NULL DEFAULT 'pcs',
    supplier VARCHAR(100),
    location VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active',
    min_stock_level INTEGER DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Components table
CREATE TABLE IF NOT EXISTS components (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    manufacturer VARCHAR(100),
    model_number VARCHAR(50),
    specifications JSONB,
    quantity INTEGER NOT NULL DEFAULT 0,
    unit VARCHAR(20) NOT NULL DEFAULT 'pcs',
    location VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Devices table
CREATE TABLE IF NOT EXISTS devices (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    model VARCHAR(100),
    serial_number VARCHAR(100) UNIQUE,
    device_id VARCHAR(100) UNIQUE,
    rack_no VARCHAR(50),
    device_case VARCHAR(100),
    mac_address VARCHAR(17),
    ip_address INET,
    status VARCHAR(20) DEFAULT 'active',
    location VARCHAR(100),
    installation_date DATE,
    last_maintenance DATE,
    specifications JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Finished Products table
CREATE TABLE IF NOT EXISTS finished_products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    serial_number VARCHAR(100) UNIQUE,
    batch_number VARCHAR(50),
    manufacturing_date DATE,
    quality_status VARCHAR(20) DEFAULT 'pending',
    status VARCHAR(20) DEFAULT 'active',
    location VARCHAR(100),
    specifications JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    area VARCHAR(100),
    contact_person VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    join_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Connections table
CREATE TABLE IF NOT EXISTS connections (
    id SERIAL PRIMARY KEY,
    source_type VARCHAR(20) NOT NULL,
    source_id INTEGER NOT NULL,
    target_type VARCHAR(20) NOT NULL,
    target_id INTEGER NOT NULL,
    connection_type VARCHAR(50) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_connection UNIQUE(source_type, source_id, target_type, target_id, connection_type)
);

-- Inventory movements table
CREATE TABLE IF NOT EXISTS inventory_movements (
    id SERIAL PRIMARY KEY,
    item_type VARCHAR(20) NOT NULL,
    item_id INTEGER NOT NULL,
    movement_type VARCHAR(20) NOT NULL,
    quantity INTEGER NOT NULL,
    previous_quantity INTEGER NOT NULL,
    new_quantity INTEGER NOT NULL,
    reason VARCHAR(100),
    location_from VARCHAR(100),
    location_to VARCHAR(100),
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_raw_materials_category ON raw_materials(category);
CREATE INDEX IF NOT EXISTS idx_raw_materials_status ON raw_materials(status);
CREATE INDEX IF NOT EXISTS idx_components_type ON components(type);
CREATE INDEX IF NOT EXISTS idx_components_status ON components(status);
CREATE INDEX IF NOT EXISTS idx_devices_type ON devices(type);
CREATE INDEX IF NOT EXISTS idx_devices_status ON devices(status);
CREATE INDEX IF NOT EXISTS idx_finished_products_type ON finished_products(type);
CREATE INDEX IF NOT EXISTS idx_finished_products_status ON finished_products(status);
CREATE INDEX IF NOT EXISTS idx_connections_source ON connections(source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_connections_target ON connections(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_item ON inventory_movements(item_type, item_id);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(name);
`;

const insertSampleDataSQL = `
-- Insert sample raw materials
INSERT INTO raw_materials (name, category, description, quantity, unit, supplier, location, status) VALUES
('PLC Controller', 'Electronics', 'Programmable Logic Controller', 48, 'pcs', 'Siemens', 'Warehouse A', 'active'),
('RFID Antenna', 'Sensors', 'RFID antenna', 12, 'pcs', 'Honeywell', 'Warehouse A', 'active'),
('ESP32 Module', 'Electronics', 'WiFi/Bluetooth module', 87, 'pcs', 'Espressif', 'Warehouse B', 'active'),
('Power Supply', 'Electronics', '24V DC power supply', 5, 'pcs', 'Mean Well', 'Production Floor', 'active'),
('Temperature Sensor', 'Sensors', 'Digital temperature sensor', 156, 'pcs', 'Adafruit', 'Warehouse A', 'active'),
('LED Strip', 'Electronics', 'RGB LED strip', 34, 'm', 'Philips', 'Warehouse B', 'active')
ON CONFLICT DO NOTHING;

-- Insert sample components
INSERT INTO components (name, type, description, manufacturer, model_number, quantity, unit, location, status) VALUES
('Microcontroller Board', 'Controller', 'Arduino board', 'Arduino', 'UNO R3', 25, 'pcs', 'Lab', 'active'),
('Relay Module', 'Actuator', '8-channel relay', 'SainSmart', 'SRD-05VDC', 18, 'pcs', 'Lab', 'active'),
('LCD Display', 'Display', '16x2 LCD', 'Samsung', '1602A', 42, 'pcs', 'Lab', 'active')
ON CONFLICT DO NOTHING;

-- Insert sample devices
INSERT INTO devices (name, type, model, serial_number, device_id, rack_no, mac_address, ip_address, status, location) VALUES
('Temperature Monitor 01', 'Sensor', 'DS18B20', 'TEMP-001', 'DEV-001', 'RACK-01', 'AA:BB:CC:DD:EE:01', '192.168.1.101', 'active', 'Building A'),
('Humidity Sensor 01', 'Sensor', 'DHT22', 'HUM-001', 'DEV-002', 'RACK-01', 'AA:BB:CC:DD:EE:02', '192.168.1.102', 'active', 'Building A')
ON CONFLICT DO NOTHING;

-- Insert sample finished products
INSERT INTO finished_products (name, type, serial_number, batch_number, quality_status, status, location) VALUES
('Temperature Sensor Unit', 'Sensor', 'TS-2023-001', 'TS-2023-06', 'passed', 'active', 'Production Floor'),
('Smart Lighting Unit', 'Actuator', 'SLU-2023-001', 'SLU-2023-05', 'passed', 'active', 'Production Floor')
ON CONFLICT DO NOTHING;
`;

const setupDatabase = async () => {
  try {
    console.log('🔄 Setting up PostgreSQL database...\n');
    
    const client = await db.pool.connect();
    
    try {
      console.log('📋 Creating tables...');
      await client.query(createTablesSQL);
      
      console.log('📊 Inserting sample data...');
      await client.query(insertSampleDataSQL);
      
      console.log('👤 Creating admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await client.query(
        `INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)
         ON CONFLICT (username) DO UPDATE SET password = $3`,
        ['admin', 'admin@s2r2.com', hashedPassword, 'admin']
      );
      
      console.log('\n✅ Database setup completed successfully!\n');
      console.log('📊 Tables created:');
      console.log('   ✓ users');
      console.log('   ✓ raw_materials');
      console.log('   ✓ components');
      console.log('   ✓ devices');
      console.log('   ✓ finished_products');
      console.log('   ✓ clients');
      console.log('   ✓ connections');
      console.log('   ✓ inventory_movements\n');
      console.log('👤 Admin credentials:');
      console.log('   Username: admin');
      console.log('   Password: admin123\n');
      
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  } finally {
    await db.end();
  }
};

if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('🎉 Ready! Start server with: npm start');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Setup failed:', error);
      process.exit(1);
    });
}

module.exports = setupDatabase;
