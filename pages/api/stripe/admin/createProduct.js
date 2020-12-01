const stripe = require('stripe')(process.env.STRIPE_SK)
import isAdmin from './isAdmin'

export default async function (req, res) {
  const admin = await isAdmin(req)
  if (admin) {
    const product = await stripe.products.create(req.body)
    if (product) {
      res.status(200).json(product)
    } else {
      res.status(500).send('Could not update Product')
    }
  } else {
    res.status(500).send('Not an admin')
  }
}