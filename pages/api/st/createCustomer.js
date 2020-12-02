const stripe = require('stripe')(process.env.STRIPE_SK)
import { getCustomer } from '../../../lib/helper'
import axios from 'axios'
import createUser from '../pg/createUser'

export default async function (req, res) {
  try {
    let { body } = req
    const valid = await verify(body.token)
    delete body.token
    if (valid) {
      const customer = await getCustomer(null, body.email.toLowerCase(), false) // will return undefined if error occurs
      if (!customer) {
        const customer = await stripe.customers.create(body)
        if (customer) { // create a customer on pg
          console.log('sending body', body)
          const user = await axios.post('/api/pg/createUser', body)
          console.log('got user obj back', user)

          res.status(200).json({password: r.metadata.password, email: r.email, id: r.id})
        } else {
          res.status(500).send('Cannot Create Customer')
        }
      } else {
        res.status(500).send('Duplicate Email')
      }
    } else {
      res.status(500).send('Invalid Captcha')
    }
  } catch (err) {
    res.status(500).send('General Create User/Customer Error')
  }
}

async function verify(token) {
  const { data } = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${token}`)
  const valid = data.success || false
  return valid
}