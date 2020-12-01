import React from 'react'
import { Load, isLoad } from '../components/Load'
import OrderCard from '../components/OrderCard'
import { useSession, signIn } from 'next-auth/client'
import { getEmail, getId, axios } from '../constants'
import Card from 'react-bootstrap/Card'

export async function getServerSideProps(context) {
  const stripe = require('stripe')(process.env.STRIPE_SK)
  const id = getId(context)
  // const email = getEmail(context)
  let intents = []

  const paymentIntents = await stripe.paymentIntents.list({limit: 100, customer: id }) // need email backup
  if (paymentIntents) {
    if (paymentIntents.has_more) {
      console.log('pagination needed') // TODO: pagination
    } else {
      intents = paymentIntents.data
    }
  } else {
    console.log('no intents')
  }
  return { props: { intents } }
}

export default function Orders({ intents }) {
  const [session, loading] = useSession()
  
  if (isLoad(session, loading, true)) return <Load />

  console.log('client intents', intents)
  
  return (
    <>
      <h3 className="display-3">Orders</h3>
      {Object.keys(intents).length > 0
      ? intents.map(intent => (
        <OrderCard intent={intent} key={intent.id}/>
      ))
      : <Load />
      }
      
    </>
  )
}
