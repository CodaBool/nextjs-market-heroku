import React, { useState, useRef } from 'react'
import { makeQuantityArr } from '../../constants/index'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Toast from '../../components/Toast'
import Tags from '../../components/UI/Tags'
import { useSession, signIn } from 'next-auth/client'
import { BagCheckFill } from 'react-bootstrap-icons'
import { useRouter } from 'next/router'
import { useShoppingCart } from 'use-shopping-cart'
import { usdPretty } from '../../constants'

export default function Item({ product }) {
  const [ session, loading ] = useSession()
  const { addItem, totalPrice, cartDetails, formattedTotalPrice, clearCart } = useShoppingCart()
  const [showSucc, setShowSucc] = useState(false)
  const [showErr, setShowErr] = useState(false)
  const [showMaxErr, setShowMaxErr] = useState(false)
  const [overflow, setOverflow] = useState(0)
  const router = useRouter()
  const quantity = useRef(null)

  function addToCart() {
    if (session) {
      const item = { max: Number(product.metadata.quantity), name: product.name, description: product.description, sku: product.id, price: Number(product.metadata.price), currency: product.metadata.currency, image: product.images[0]}
      let total = Number(quantity.current.value)
      if (cartDetails[product.id]) { // already exists in cart
        total += cartDetails[product.id].quantity
      }
      
      if (total > product.metadata.quantity) { // check if below max quantity
        if (cartDetails[product.id].quantity < product.metadata.quantity) { // can add a fraction of desired amount
          const overflow = total - product.metadata.quantity
          const maxAdd = Math.abs(quantity.current.value - overflow)
          setOverflow(maxAdd)
          setShowErr(true)
          addItem(item, maxAdd)
        } else { // already at the max of the item
          setShowMaxErr(true)
        }
      } else {
        setShowSucc(true)
        addItem(item, Number(quantity.current.value))
      }
    } else {
      signIn()
    }
  }

  return (
    <>
      <Card key={product.id} className="p-3">
        <Row>
          <Col>
            {product.images[0] 
              ? <img src={product.images[0]} alt={product.name} className="mx-auto d-block" style={{width: '500px'}} />
              : <div className="border p-4" style={{width: '150px', height: '150px'}}>No Image Added 😔</div>
            }
            <p className="text-center">option picker placeholder</p>
          </Col>
          <Col>
            <h1>{product.name}</h1>
            <Tags tags={product.metadata.categories} size="sm" />
            <h4>{product.description}</h4>
            <div className="" style={{width: '200px'}}>
              <Row>
                <Col sm={6} className="text-center">
                  {usdPretty(product.metadata.price)}
                </Col>
                <Col className="my-auto" sm={6}>
                  <select className="form-control" name="quantity" defaultValue="1" ref={quantity}>
                    {makeQuantityArr(Number(product.metadata.quantity)).map((option, index) => <option key={index}>{option}</option>)}
                  </select>
                </Col>
              </Row>
              <p>shipping placeholder</p>
              <p>Rating placeholder</p>
              <Button variant="primary" className="w-100" onClick={addToCart}>Add to cart</Button>
            </div>
          </Col>
        </Row>
      </Card>
      <Card className="p-5">
        <h1>Details</h1>
      </Card>
      <Card className="p-5">
        <h1>Other items in this category</h1>
      </Card>
      <Card className="p-5">
        <h1>Reviews</h1>
      </Card>
      <div style={{position: 'fixed', top: '80px', right: '10px'}}>
        <Toast show={showSucc} setShow={setShowSucc} title='Product Added' body={<>
          <p>You Added <strong>{quantity.current && quantity.current.value} {product.name}</strong> To Your Cart</p>
          <Button className="w-100" variant="info" onClick={() => router.push('/checkout/cart')}>See Cart <BagCheckFill className="ml-2 mb-1" size={14}/></Button>
        </>} />
        <Toast show={showErr} setShow={setShowErr} title='Limited Availablity' error body={<>
          <p>We could only add <strong>{overflow}</strong> to your cart</p>
          <p>We have limited supply of {product.name}</p>
          <Button className="w-100" variant="info" onClick={() => router.push('/checkout/cart')}>See Cart <BagCheckFill className="ml-2 mb-1" size={14}/></Button>
        </>} />
        <Toast show={showMaxErr} setShow={setShowMaxErr} title='No More Available' error body={<>
          <p className="text-danger">Unfortunately we have limited availability of that item and cannot add anymore.</p>
          <Button className="w-100" variant="light" onClick={() => router.push('/checkout/cart')}>See Cart <BagCheckFill className="ml-2 mb-1" size={14}/></Button>
        </>} />
      </div>
    </>
  )
}

export async function getStaticProps(context) {
  const stripe = require('stripe')(process.env.STRIPE_SK)
  let { slug } = context.params
  let product = { err: null }
  await stripe.products.retrieve(slug)
    .then(res => product = res)
    .catch(err => console.log(err))
  return { props: { product } }
}

export async function getStaticPaths() {
  const stripe = require('stripe')(process.env.STRIPE_SK)
  let paths = []
  if (stripe) {
    const products = await stripe.products.list({limit: 100, active: true}) // starting_after: pagination, uses id
    if (products.has_more === true) {
      console.log('over 100 active products, build pagination') // TODO: pagination
    } else {
      if (products) {
        paths = products.data.map(product => ({
          params: { slug: product.id },
        }))
      } else {
        console.log('could not define products from stripe')
      }
    }
  } else {
    console.log('could not make instantiate stripe')
  }
  console.log('item/[slug] paths', paths)
  return { paths, fallback: false } // { fallback: false } means other routes should 404.
}