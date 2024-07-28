import React from 'react'
import { Helmet } from 'react-helmet';

const Metadata = ({ title }) => {
  console.log(title);

  return (
    <Helmet>
      <title>{`${title} - Ecommerce App`}</title>
    </Helmet>
  )
}

export default Metadata