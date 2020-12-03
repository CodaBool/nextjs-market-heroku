import React from 'react'
import { Load, isLoad } from '../components/Load'
import OrderCard from '../components/OrderCard'
import { useSession, signIn } from 'next-auth/client'
import { getEmail, getId, axios, BASE_URL } from '../constants'
import Card from 'react-bootstrap/Card'
import { idFromReqOrCtx } from '../lib/helper'

export async function getServerSideProps(context) {
  const id = idFromReqOrCtx(null, context)
  const intents = await axios.get(BASE_URL + '/api/st/getIntents', {params: {id}})
  let error = ''
  if (!intents) {
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
      {(Object.keys(intents).length == 0 && !error) &&
        <h4 className="text-center my-5">No orders on record</h4>
      }
      {Object.keys(intents).length > 0 &&
        intents.map(intent => (
          <OrderCard intent={intent} key={intent.id}/>
        ))
      }
    </>
  )
}
