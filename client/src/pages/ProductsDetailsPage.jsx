import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Footer from '../components/Layout/Footer'
import Header from '../components/Layout/Header'
import ProductDetails from "../components/Products/ProductDetails";
import SuggestedProduct from "../components/Products/SuggestedProduct";
import { useSelector } from 'react-redux';

const ProductDetailsPage = () => {
    const {name} = useParams();
    const [data,setData] = useState(null);
    const productName = name.replace(/-/g," ");

    const { allProducts } = useSelector((state) => state.products);

    useEffect(() => {
        const data = allProducts && allProducts.find((i) => i.name === productName);
        setData(data);
    }, [allProducts])

    // console.log("data",data);
    
  return (
    <div>
        <Header />
        <ProductDetails data={data} />
         {
            data && <SuggestedProduct data={data} />
         }
        <Footer />
    </div>
  )
}

export default ProductDetailsPage