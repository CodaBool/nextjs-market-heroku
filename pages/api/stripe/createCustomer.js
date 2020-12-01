const stripe = require('stripe')(process.env.STRIPE_SK)
import { axios } from '../../../constants'
import { setCookie } from 'nookies'
import { getCustomer } from '../auth/[...nextauth]'

export default async function (req, res) {
  try {
    let { body } = req
    const valid = await verify(body.token)
    delete body.token
    if (valid) {
      const customer = await getCustomer(null, body.email.toLowerCase(), true) // will return undefined if error occurs
      if (!customer) {
        await stripe.customers.create(body)
          .then(r => {
            setCookie({ res }, 'id-email', r.id + '-' + r.email, { // store cookie for easy Stripe api use 
              path: '/',
              maxAge: 30 * 24 * 60 * 60 * 12 * 5, // 5 years
              sameSite: 'strict' // use httpOnly: true for added security
            })
            res.status(200).json({password: r.metadata.password, email: r.email, id: r.id})
          })
          .catch(err => {
            res.status(500).send('Cannot Create Customer')
          })
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