import ProductCard from "../../components/ProductCard/ProductCard";
import { useGetProductsQuery } from "../../slices/productApiSlice";

import "./HomeScreen.css";

const HomeScreen = () => {
  const { data: products, isLoading, error } = useGetProductsQuery();

  if (isLoading) return <div>Chargement...</div>;
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
