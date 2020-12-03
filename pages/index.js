import axios from 'axios'
import {useEffect} from 'react'
import { useSession } from 'next-auth/client'

export default function Index() {
  const [ session, loading ] = useSession()

  useEffect(() => {
  }, [])

  function makeRequest() {
    // console.log('request sent')
    // axios.post('/api/other/newTest', {data: 'nice'})
    //   .then(res => console.log('new test =', res.data))
    //   .catch(err => console.log(err.response.data))
    axios.post('/api/pg/putAddress', {
      shipData: {
        address: {
          line1: "2 big meaty",
          line2: "claws",
          postal_code: "82343",
          city: "ornasd",
          state: "WY",
        },
        name: "new around",
        phone: "",
      },
      customer: {
        id: "cus_IV90mjbc5Sskjc",
        email: "new@around.com",
        metadata: {
          admin: "false",
          active: "true",
          joined: "2020-12-02T18:10:47.134Z",
          updated: "2020-12-02T18:10:47.134Z",
          trust: "0",
          spent: "0",
        },
        name: "new around",
        phone: null,
      },
    })
      .then(res => console.log(res.data))
      .catch(err => {console.log(err); console.log(err.response.data)})
  }
  return (
    <>
      <button onClick={makeRequest}>Request</button>
      Home Page
    </>
  )
}
