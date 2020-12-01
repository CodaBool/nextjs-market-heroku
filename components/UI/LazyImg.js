import React from 'react'
import { Img } from 'react-image'
import { Image } from 'react-bootstrap-icons'

export default function MyComponent(props) {
  return (
      <Img 
        {...props}
        loader={
          <div className="imgPlaceholder d-flex align-items-center">
            <Image size={50} className="mx-auto" />
          </div>
        }
      />
  )
}