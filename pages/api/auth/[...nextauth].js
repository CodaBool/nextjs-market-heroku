const stripe = require('stripe')(process.env.STRIPE_SK)
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { compare } from 'bcryptjs'
import { setCookie, parseCookies } from 'nookies'
// import db from '../../../lib/db'

export const config = { // nextjs doc for custom config https://nextjs.org/docs/api-routes/api-middlewares#custom-config
  api: { // was getting warning that API resolved without sending a response for /api/auth/session, this may result in stalled requests.
    // following stackoverflow answer I set this config but may be dangerous since I may not always return a response
    externalResolver: true,
  },
}

export default (req, res) => {
  NextAuth(req, res, {
    providers: [
      Providers.Credentials({
        // The name to display on the sign in form (e.g. 'Sign in with...')
        name: 'Credentials',
        // The credentials is used to generate a suitable form on the sign in page.
        // You can specify whatever fields you are expecting to be submitted.
        // e.g. domain, username, password, 2FA token, etc.
        credentials: {
          email: { label: "Email", type: "email", placeholder: "Email" },
          password: { label: "Password", type: "password", placeholder: "Password" }
        },
  
        // can use throw new Error('message') to send to err.message catch block 
        authorize: async (clientData) => {
          try {
            const customer = await getCustomer(null, clientData.email, false)
            if (customer) {
              console.log()
              const validPassword = await compare(clientData.password, customer.metadata.password)
              if (validPassword) {
                setCookie({ res }, 'id-email', customer.id + '-' + customer.email, { // store cookie for easy Stripe api use 
                  path: '/',
                  maxAge: 30 * 24 * 60 * 60 * 12 * 5, // 5 years
                  sameSite: 'strict' // use httpOnly: true for added security
                })
                return { id: customer.id, name: customer.name, email: customer.email } // complete successful login
              } else { // invalid password
                return Promise.reject('/login?error=invalid')
              }
            } else { // no account
              // console.log('Promise.resolve(null)', clientData.email)
              // return Promise.resolve(null)
              return Promise.reject('/login?error=invalid')
            }
          } catch (err) {
            console.log(err)
            return Promise.reject('/login?error=invalid')
          }
        },
      })
    ],
    callbacks: {
      session: async (session, user, sessionToken) => {
        const customer = await getCustomer(null, user.email, true)
        if (customer) {
          if (customer.email === user.email) {
            session.id = customer.id // Add property to session
          }
        }
        return Promise.resolve(session)
      }
    },
    pages: {
      signIn: '/login',
      signOut: '/logout',
      newUser: '/singup',
      error: '/login', // Error code passed in query string as ?error=
    },
    session: {
      jwt: true, 
      // Seconds - How long until an idle session expires and is no longer valid.
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    debug: true,
    secret: process.env.SECRET,
    database: process.env.DATABASE_URL,
  })
}

export function getCustomer(id, email, deletePass) { // search Stripe Customers to see if the email already exists
  console.log('got id =', id, ' | email =', email)
  if (id) {
    return stripe.customers.retrieve(id)
      .then(res => {
        if (deletePass) {
          delete res.metadata.password
        }
        return res
      })
      .catch(err => { // returns undefined
        console.log('Stripe Error', err)
      })
  } else if (email) {
    return stripe.customers.list({ limit: 2, email: email })
      .then(res => {
        if (res.data.length > 0) { // maybe email exists
          if (res.has_more === true) { // duplicate email exists, returns undefined
            Promise.reject(new Error('Duplicate Email found in Stripe Customer')).then(() => {
              // resolve the issue here
          }, (err) => console.error(err))
          } else if (res.data[0].email === email.toLowerCase()) { // email exists
            if (deletePass) {
              delete res.data[0].metadata.password
            }
            return res.data[0]
          }
        }
      })
      .catch(err => { // returns undefined
        console.log('Stripe Error', err)
      })
  }
}