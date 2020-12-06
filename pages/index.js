import axios from 'axios'
import {useEffect} from 'react'
import { useSession } from 'next-auth/client'
import { BASE_URL } from '../constants'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'next/image'

export async function getServerSideProps(context) {
  const envTest = BASE_URL
  return { props: { general: envTest }}
}

export default function Index({ general }) {
  const [ session, loading ] = useSession()

  useEffect(() => {
  }, [])

  function testCall() {
    // axios.post('/api/pg/putAddress')
    //   .then(res => console.log(res.data))
    //   .catch(err => {console.log(err); console.log(err.response.data)})

  }
  return (
    <Col className="p-4 m-2 text-center">
      <h1 className="m-5">Valencia College CEN 4930C Final</h1>
      {/* <h2 className="m-5 text-muted">Douglas Moore</h2> */}
      {/* <button onClick={testCall}>test</button> */}
      <Image src="/image/valencia.png" alt="Valencia College" width={380} height={380} />
    </Col>
  )
}
