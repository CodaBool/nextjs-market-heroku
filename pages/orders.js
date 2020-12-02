import React from 'react'
import { Load, isLoad } from '../components/Load'
import OrderCard from '../components/OrderCard'
import { useSession, signIn } from 'next-auth/client'
import { getEmail, getId, axios } from '../constants'
import Card from 'react-bootstrap/Card'
import { idFromReqOrCtx } from '../lib/helper'

export async function getServerSideProps(context) {
  const id = idFromReqOrCtx(null, context)
  const stripe = require('stripe')(process.env.STRIPE_SK)
  let intents = []
  let error = ''
  const paymentIntents = await stripe.paymentIntents.list({limit: 100, customer: id }) // need email backup
  if (paymentIntents) {
    if (paymentIntents.has_more) {
      error = 'Error too many intents to display'
      console.log('pagination needed') // TODO: pagination
    } else {
      intents = paymentIntents.data
    }
  } else {
    error = 'Error getting intents'
  }
  return { props: { intents, error } }
}

export default function Orders({ intents, error }) {
  const [session, loading] = useSession()
  
  if (isLoad(session, loading, true)) return <Load />

  console.log('intents', intents, error)
  
  return (
    <>
      <h3 className="display-3">Orders</h3>
      {error && <p>{error}</p>}
      {(intents.length == 0 && !error) &&
        <h4 className="text-center my-5">No orders on record</h4>
      }
      {intents.length > 0 &&
        intents.map(intent => (
          <OrderCard intent={intent} key={intent.id}/>
        ))
      }
    </>
  )
}
