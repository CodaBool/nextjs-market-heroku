const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DB_URI,
  ssl: { rejectUnauthorized: false },
  max: 19, // default = 10
  connectionTimeoutMillis: 0, // wait before timing out when connecting a new client, 0 = no timeout
  idleTimeoutMillis: 30000, // client must sit idle in the pool and not be checked out before it is disconnected from the backend and discarded, default = 10000, 0 = disabled
})

// 'SELECT * FROM users WHERE id = $1', [1]

export default async function(q, values) {
  try {
    let result
    await pool.query(q, values)
      .then(res => {
        console.log('success', res.rows[0].email)
        result = res.rows[0].email
      })
      .catch(err => console.log(err))
    return result
  } catch (e) {
    throw Error(e.message)
  }
}