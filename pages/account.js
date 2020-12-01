import React from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Image from 'react-bootstrap/Image'
import { useSession, signIn, getSession } from 'next-auth/client'
import { Load, isLoad } from '../components/Load'
import { getEmail, getId } from '../constants'
import { format } from 'timeago.js'
import { axios } from '../constants'
import { getCustomer } from './api/auth/[...nextauth]'

export async function getServerSideProps(context) {
  let customer = { err: null }
  const id = getId(context)
  const email = getEmail(context)

  const result = await getCustomer(id, email, true) // will use id if defined or will use email from session as backup
  if (customer) {
    customer = result
  } else {
    console.log('error getting customer')
  }
  
  return { props: { customer } }
}

export default function Account({ customer }) {
  const [session, loading] = useSession()
  if (isLoad(session, loading, false)) return <Load />

  return (
    <>
      <Image fluid className="mb-5" />
      <Row>
        <Col md={4}>
          <Image roundedCircle />
        </Col>
        <Col md={8}>
          <div className="border border-info p-5">
            {customer.id &&
              <>
                <p>Welcome, {customer.name}</p>
                <p>{customer.email}</p>
                <p>Active: {customer.metadata.active ? 'True' : 'False'}</p>
                <p>Admin: {customer.metadata.admin ? 'True' : 'False'}</p>
                <p>Joined: {format(customer.created * 1000)}</p>
              </>
            }
            {customer.err && <p>{customer.err}</p>}
          </div>
        </Col>
      </Row>
    </>
  )
}