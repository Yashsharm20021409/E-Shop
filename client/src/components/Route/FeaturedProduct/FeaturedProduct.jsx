import React, { useEffect } from "react";
// import { productData } from "../../../static/data";
import styles from "../../../styles/style";
import ProductCard from "../ProductCard/ProductCard";
import { useSelector } from "react-redux";
import { getAllProducts } from "../../../redux/actions/product";
import  Store  from "../../../redux/store";

const FeaturedProduct = () => {
  const {allProducts} = useSelector((state) => state.products);
  // console.log(products)
  useEffect(() => {
    Store.dispatch(getAllProducts());
  }, []);

  return (
    <div> 
      <div className={`${styles.section}`}>
        <div className={`${styles.heading}`}>
          <h1>Featured Products</h1>
        </div>
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0">
          {
          allProducts && allProducts.length !== 0 &&(
              <>
               {allProducts && allProducts.map((i, index) => <ProductCard data={i} key={index} />)}
              </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProduct;