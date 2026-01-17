import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { savePaymentMethod } from "../../../slices/cartSlice";

import FormContainer from "../../../components/Form/FormContainer";
import FormRadio from "../../../components/Form/FormRadio";
import FormButton from "../../../components/Form/FormButton";
import CheckoutSteps from "../CheckoutSteps/CheckoutSteps";

const PaymentScreen = () => {
  const { shippingAddress, paymentMethod: savedPaymentMethod } = useSelector(
    (state) => state.cart,
  );

  const [paymentMethod, setPaymentMethod] = useState(
    savedPaymentMethod || "PayPal",
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!shippingAddress?.address) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 />
      <FormContainer
        title="Mode de paiement"
        subtitle="Comment souhaitez-vous payer ?"
      >
        <form onSubmit={submitHandler}>
          <FormRadio
            label="Sélectionnez un mode de paiement"
            name="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            options={[
              { value: "PayPal", label: "💳 PayPal / Carte bancaire" },
              { value: "Stripe", label: "💳 Stripe" },
              { value: "Virement", label: "🏦 Virement bancaire" },
              { value: "Especes", label: "💵 Espèces à la livraison" },
            ]}
          />

          <FormButton type="submit">Continuer</FormButton>
        </form>
      </FormContainer>
    </>
  );
};

export default PaymentScreen;
