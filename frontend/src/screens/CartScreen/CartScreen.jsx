import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaTrash,
  FaMinus,
  FaPlus,
  FaArrowLeft,
  FaShoppingCart,
} from "react-icons/fa";
import { removeFromCart, updateQty } from "../../slices/cartSlice";
import Message from "../../components/global/Message";
import "./CartScreen.css";

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice } =
    useSelector((state) => state.cart);

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const updateQtyHandler = (item, newQty) => {
    if (newQty >= 1 && newQty <= item.countInStock) {
      dispatch(updateQty({ _id: item._id, qty: newQty }));
    }
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <div className="cart-container">
      <h1>
        <FaShoppingCart /> Mon Panier
      </h1>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <Message variant="info">
            Votre panier est vide. <Link to="/">Continuer vos achats</Link>
          </Message>
        </div>
      ) : (
        <div className="cart-content">
          {/* Liste des produits */}
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>

                <div className="cart-item-details">
                  <Link to={`/product/${item._id}`} className="cart-item-name">
                    {item.name}
                  </Link>
                  <p className="cart-item-price">{item.price} XPF</p>
                </div>

                <div className="cart-item-qty">
                  <button
                    className="qty-btn"
                    onClick={() => updateQtyHandler(item, item.qty - 1)}
                    disabled={item.qty <= 1}
                  >
                    <FaMinus />
                  </button>
                  <span className="qty-value">{item.qty}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQtyHandler(item, item.qty + 1)}
                    disabled={item.qty >= item.countInStock}
                  >
                    <FaPlus />
                  </button>
                </div>

                <div className="cart-item-subtotal">
                  {item.price * item.qty} XPF
                </div>

                <button
                  className="cart-item-remove"
                  onClick={() => removeFromCartHandler(item._id)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          {/* Récapitulatif */}
          <div className="cart-summary">
            <h2>Récapitulatif</h2>

            <div className="summary-row">
              <span>
                Articles ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
              </span>
              <span>{itemsPrice} XPF</span>
            </div>

            <div className="summary-row">
              <span>Livraison</span>
              <span>
                {shippingPrice === 0 ? (
                  <span className="free-shipping">Gratuite</span>
                ) : (
                  `${shippingPrice} XPF`
                )}
              </span>
            </div>

            <div className="summary-row">
              <span>TVA (22%)</span>
              <span>{taxPrice} XPF</span>
            </div>

            {shippingPrice > 0 && (
              <p className="shipping-info">
                Plus que {10000 - itemsPrice} XPF pour la livraison gratuite !
              </p>
            )}

            <div className="summary-total">
              <span>Total TTC</span>
              <span>{totalPrice} XPF</span>
            </div>

            <button
              className="btn-checkout"
              onClick={checkoutHandler}
              disabled={cartItems.length === 0}
            >
              Passer la commande
            </button>

            <Link to="/" className="btn-continue">
              <FaArrowLeft /> Continuer mes achats
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartScreen;
