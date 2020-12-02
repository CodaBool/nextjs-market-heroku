const stripe = require('stripe')(process.env.STRIPE_SK)
import axios from 'axios'

export default async function (req, res) {
  console.log('body', req.body)
  let user = {err: null}
  if (user) {
    res.status(200).json(user)
  } else {
    res.status(500).send('Error, could not get customer')
  }
}

