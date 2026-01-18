import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { clearCart } from "../../../slices/cartSlice";
import CheckoutSteps from "../CheckoutSteps/CheckoutSteps";
import "./PlaceOrderScreen.css";
import { useCreateOrderMutation } from "../../../slices/orderApiSlice";

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const {
    shippingAddress,
    paymentMethod,
    cartItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = cart;

  const [createOrder, { isLoading }] = useCreateOrderMutation();

  useEffect(() => {
    if (!shippingAddress?.address) {
      navigate("/shipping");
    } else if (!paymentMethod) {
      navigate("/payment");
    }
  }, [shippingAddress, paymentMethod, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }).unwrap();

      dispatch(clearCart());
      toast.success("Commande passée avec succès !");
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de la commande");
    }
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <div className="placeorder-container">
        <div className="placeorder-content">
          {/* Colonne gauche - Détails */}
          <div className="placeorder-details">
            {/* Adresse de livraison */}
            <div className="placeorder-card">
              <h2>📍 Adresse de livraison</h2>
              <p>
                {shippingAddress?.address}, {shippingAddress?.city}{" "}
                {shippingAddress?.postalCode}, {shippingAddress?.country}
              </p>
            </div>

            {/* Mode de paiement */}
            <div className="placeorder-card">
              <h2>💳 Mode de paiement</h2>
              <p>{paymentMethod}</p>
            </div>

            {/* Articles */}
            <div className="placeorder-card">
              <h2>🛒 Articles</h2>
              {cartItems.length === 0 ? (
                <p>Votre panier est vide</p>
              ) : (
                <div className="placeorder-items">
                  {cartItems.map((item) => (
                    <div key={item._id} className="placeorder-item">
                      <img src={item.image} alt={item.name} />
                      <div className="placeorder-item-info">
                        <Link to={`/product/${item._id}`}>{item.name}</Link>
                        <span>
                          {item.qty} x {item.price.toLocaleString()} XPF
                        </span>
                      </div>
                      <div className="placeorder-item-total">
                        {(item.qty * item.price).toLocaleString()} XPF
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Colonne droite - Récapitulatif */}
          <div className="placeorder-summary">
            <div className="placeorder-card">
              <h2>📋 Récapitulatif</h2>

              <div className="summary-row">
                <span>Articles</span>
                <span>{itemsPrice?.toLocaleString()} XPF</span>
              </div>

              <div className="summary-row">
                <span>Livraison</span>
                <span>
                  {shippingPrice === 0 ? (
                    <span className="free-shipping">Gratuit</span>
                  ) : (
                    `${shippingPrice?.toLocaleString()} XPF`
                  )}
                </span>
              </div>

              <div className="summary-row">
                <span>Taxe (22%)</span>
                <span>{taxPrice?.toLocaleString()} XPF</span>
              </div>

              <div className="summary-row total">
                <span>Total</span>
                <span>{totalPrice?.toLocaleString()} XPF</span>
              </div>

              <button
                className="placeorder-btn"
                onClick={placeOrderHandler}
                disabled={cartItems.length === 0 || isLoading}
              >
                {isLoading ? "Traitement en cours..." : "Confirmer la commande"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceOrderScreen;
