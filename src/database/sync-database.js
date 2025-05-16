const { query } = require(".");

async function syncDatabase() {
  await query(
    `
    CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(255) DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `
  )

  await query(
    `
    CREATE TABLE IF NOT EXISTS spaces(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      capacity INT NOT NULL,
      location VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `
  )

  await query(
    `
    CREATE TABLE IF NOT EXISTS reservations(
      id SERIAL PRIMARY KEY,
      user_id INT,
      space_id INT,
      start_time TIMESTAMP NOT NULL,
      end_time TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (space_id) REFERENCES spaces (id),
      UNIQUE (space_id, start_time)
    );
    `
  )

  process.exit(1)
}

syncDatabase()