import React, { useState, useEffect } from 'react'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { makeShallow } from '../../constants/index'
import { useSession, signIn } from 'next-auth/client'
import { parseCookies } from 'nookies'
import Button from 'react-bootstrap/Button'
import CartCards from '../../components/CartCards'
import { useShoppingCart } from 'use-shopping-cart'
import { axios } from '../../constants'
import { useRouter } from 'next/router'
import useScreen from '../../components/useScreen'
import { BagCheckFill, BoxSeam } from 'react-bootstrap-icons'
import { isLoad, Load } from '../../components/Load'

export default function Cart() {
  const { cartDetails, formattedTotalPrice } = useShoppingCart()
  const router = useRouter()
  const [session, loading] = useSession()
  var size = useScreen()
  if (!size) size = 'medium'

  if (isLoad(session, loading, false)) return <Load />

  return (
    <>
      <Col className={`mx-auto shrink ${size == 'small' || size == 'xsmall' || size == 'medium' ? 'w-100' : 'w-50'}`}>
        <h1 className="display-3">Cart</h1>
        <CartCards isSimple={false} size={size} />
        {Object.keys(cartDetails).length > 0 &&
          <>
            <Card className="p-3 mt-4">
              <Row>
                <Col><h3 className="shrink">Total</h3></Col>
                <Col className="text-right"><h3>{formattedTotalPrice}</h3></Col>
              </Row>
            </Card>
            <Row>
              <Button className="w-100 mx-3 my-5" variant="primary" onClick={() => router.push('/checkout/shipping')}>
                Add Shipping <BoxSeam className="ml-2 mb-1" size={14}/>
              </Button>
            </Row>
          </>
        }
      </Col>
    </>
  )
}


// const handleCheckout: React.FormEventHandler<HTMLFormElement> = async (
//   event
// ) => {
//   event.preventDefault()
//   setLoading(true)

//   const response = await fetchPostJSON(
//     '/api/checkout_sessions/cart',
//     cartDetails
//   )

//   if (response.statusCode === 500) {
//     console.error(response.message)
//     return
//   }

//   redirectToCheckout({ sessionId: response.id })
// }