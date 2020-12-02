const stripe = require('stripe')(process.env.STRIPE_SK)

export default async function (req, res) {
  const updatedCustomer = await stripe.customers.update(req.body.customer.id, {shipping: req.body.shipData})
  if (updatedCustomer) {
    res.status(200).json(updatedCustomer)
  } else {
    res.status(500).send('Error, could not get customer')
  }
}