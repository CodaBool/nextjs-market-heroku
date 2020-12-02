import query from '../../../lib/db'

export default async function (req, res) {
  try {
    const result = await query('SELECT * FROM users WHERE user_id = 54')
    if (result.err) {
      res.status(500).send(result.err)
    } else {
      res.status(200).json({result: result.rows[0].email})
    }
  } catch (err) {
    res.status(500).send('General Create User/Customer Error')
  }
}