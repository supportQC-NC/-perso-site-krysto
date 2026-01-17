import ProductCard from "../../components/ProductCard/ProductCard";
import products from "../../products";
import "./HomeScreen.css";

const HomeScreen = () => {
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
