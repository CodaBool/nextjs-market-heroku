import query from '../../lib/db'

export default async function (req, res) {
  const result = await query('SELECT * FROM users WHERE user_id = $1', [1])
  console.log('result', result)
  res.status(200).json({name: 'john', result})
}