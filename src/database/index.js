const pg = require("pg");

const pool = new pg.Pool({
  connectionString: "postgres://postgres:123@localhost:5432/gestao_reservas",
});

async function query(queryString, params, callback) {
  return pool.query(queryString, params, callback);
}

async function getClient() {
  return pool.connect()
}

module.exports = { query, getClient };
