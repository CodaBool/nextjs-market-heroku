import axios from 'axios'
import {useEffect} from 'react'
import { useSession } from 'next-auth/client'

export default function Index() {
  const [ session, loading ] = useSession()

  useEffect(() => {
  }, [])

  function makeRequest() {
    // console.log('request sent')
    // axios.post('/api/other/test', {data: 'nice'})
    //   .then(res => console.log('my response', res.data))
    //   .catch(err => console.log(err.response.data))
  }
  return (
    <>
      <button onClick={makeRequest}>Request</button>
      Home Page
    </>
  )
}
