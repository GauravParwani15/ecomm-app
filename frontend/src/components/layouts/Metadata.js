import React from 'react'
import { Helmet } from 'react-helmet';

const Metadata = ({ title }) => {
  console.log(title);

  return (
    
      <title>{`${title} - Ecommerce App`}</title>
  )
}

export default Metadata