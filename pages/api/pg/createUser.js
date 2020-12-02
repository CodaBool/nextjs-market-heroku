import query from '../../../lib/db'

export default async function (req, res) {
  try {
    let created = false
    await query(
      'INSERT INTO users(email, stripe_id, name, password, joined, updated) VALUES ($1, $2, $3, $4, $5, $6)', 
      [body.email.toLowerCase(), body.stripe_id, body.name, body.metadata.password, body.metadata.joined, body.metadata.updated]
    )
      .then(response => {
        console.log('response', response)
        if (response.rowCount === 1) {
          created = true
        }
      })
      .catch(err => {
        if (err.constraint === 'users_email_key') { // email already exists
          console.log('Email Already Exists in Database')
        }
        created = false
      })
    
    if (created) {
      
    } else {
      res.status(500).send('General Create User/Customer Error')
    }
  } catch (err) {
    res.status(500).send('General Create User/Customer Error')
  }
}