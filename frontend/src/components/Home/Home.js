import React from 'react'
import { GiMouse } from 'react-icons/gi';
import "./Home.css"
import Product from "./Product.js"
import MetaData from '../layout/MetaData';


const Home = () => {
    const product = {
        name :"blue t shirt",
        price: 500,
        _id:"verma",
        numOfReviews:4,
        images:[{url:"https://images.unsplash.com/photo-1617854818583-09e7f077a156?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"}]
    }
  return (
   <>
   <MetaData title={"home is working"}/>
   <div className='banner'>
    <p>Welcome to e commerce</p>
    <h1>Find Amazing Products</h1>
    <a href='#container'>
        <button>Scroll <GiMouse/></button>
    </a>
   </div>
   <h2 className='homeHeading'>Featured Products</h2>
  <div className='container' id="container">
    <Product product = {product}/>
    <Product product = {product}/>
    <Product product = {product}/>
    <Product product = {product}/>
    <Product product = {product}/>
    <Product product = {product}/>
    <Product product = {product}/>
    
  </div>
   
   </>
  )
}

export default Home
