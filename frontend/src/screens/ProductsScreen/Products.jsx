import { useState, useEffect } from "react";
import Loader from "../../components/global/Loader";
import ProductCard from "../../components/ProductCard/ProductCard";
import { useGetProductsQuery } from "../../slices/productApiSlice";

import "./ProductScreen.css";

const HomeScreen = () => {
  const { data: products, isLoading, error } = useGetProductsQuery();
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading || showLoader) return <Loader />;
  if (error) return <div>Erreur: {error?.data?.message || error.error}</div>;

  return (
    <div className="home-container">
      <h3>Nos derniers produits</h3>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default HomeScreen;
