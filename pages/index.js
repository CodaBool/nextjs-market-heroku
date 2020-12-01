import axios from 'axios'
import {useEffect} from 'react'

export default function Index() {
  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/todos/1')
      .then(res => console.log(res))
      .catch(err => console.log(err))
    axios.get('/api/test')
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }, [])

  function makeRequest() {
    console.log('request sent')
    axios.get('/api/test')
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }
  return (
    <>
      <button onClick={makeRequest}>Request</button>
    </>
  )
}
