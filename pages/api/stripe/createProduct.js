const stripe = require('stripe')(process.env.STRIPE_SK)

export default async function (req, res) {
  // admin authentication
  console.log('session', req.body.session)
  const isAdmin = await getAdminStatus(req.body.session.user.email)
  console.log('admin?', isAdmin)

  if (isAdmin) { // admin only endpoint
    try {
      let metadata = {} // only update relevant data
      if (req.body.quantity) {
        metadata.quantity =  req.body.quantity
      } if (req.body.price) {
        metadata.price = req.body.price
      } if (req.body.currency) {
        metadata.currency = req.body.currency
      } if (req.body.categories.length > 0) {
        metadata.categories = String(req.body.categories)
      }

      let productObj = {}
      if (req.body.type) {
        productObj.type = req.body.type
      } if (req.body.active) {
        productObj.active = req.body.active
      } if (req.body.description) {
        productObj.description = req.body.description
      } if  (req.body.description) {
        productObj.description = req.body.description
      } 

      productObj.metadata = metadata
      productObj.name = req.body.name

      let product
      try {
        product = await stripe.products.create(productObj)
      } catch (err) {
        console.log('error making product', err.message)
      }
      res.status(200).json({ error: false, product: product})
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message })
    }
  } else { // not an admin account
    res.status(200).json({error: true })
  }
}