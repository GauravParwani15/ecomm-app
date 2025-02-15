import React, { Fragment, useEffect } from 'react'
import Metadata from './layouts/Metadata';
import './Home.css';
import Loader from './layouts/Loader';
import Product from './product/Product';
import {useDispatch, useSelector} from 'react-redux';
import { getProducts } from '../actions/productActions';

const Home = () => {

  const dispatch = useDispatch();

  const state = useSelector((state) => state);
  // console.log("Entire State:", state);
  const {products, loading, error, productsCount} = useSelector(state => state.products)

  // const { loading, products, error, productsCount } = useSelector(state => state.products);
  // console.log("Products from state:", products);
  // console.log("State.products:", state.products);


  useEffect(()=>{
    dispatch(getProducts());

    
  }, [dispatch])


  return (
    <Fragment>
      {loading ? <Loader />: (
        <Fragment>
   <Metadata title={`Buy Best ptoducts online`}/>
    <div>
      <div className="row">
        <div className="col-12 col-sm-6 col-md-12">
          
          <h1 id="products_heading" className="text-secondary">Latest Products</h1>

          <section id="products" className="mt-5">
            <div className="row">

            {products && products.map(products => (
              <Product key ={products._id} product={products} />
            ))}
              

            </div>


             <div class="todo">
              <ul>
                {/* <li>            {JSON.stringify(state)+"state"}</li> */}
                <li>complete fronend 1-3 modules</li>
                <li>make a docker of this project</li>
                <li>learn system design and how to scale projects</li>
              </ul>
            </div> 
          </section>
        </div>
      </div>

   
    </div>
        </Fragment>
      )}
   
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js"></script>

    <script src="https://kit.fontawesome.com/9edb65c86a.js"></script>
    </Fragment>
  )
}

export default Home