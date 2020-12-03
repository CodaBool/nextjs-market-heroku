const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 19, // default = 10
  connectionTimeoutMillis: 0, // wait before timing out when connecting a new client, 0 = no timeout
  idleTimeoutMillis: 30000, // client must sit idle in the pool and not be checked out before it is disconnected from the backend and discarded, default = 10000, 0 = disabled
})

export default async function Query(q, values) {
  return await pool.query(q, values)
    .then(res => {
      return res // TODO: check what the res looks like for other CRUD, only checked with 
    })
    .catch(err => {
      return {err: err.message} // passes to nearest error handler
    })
}