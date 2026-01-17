import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAddress } from "../../../slices/cartSlice";

import FormContainer from "../../../components/Form/FormContainer";
import FormInput from "../../../components/Form/FormInput";
import FormSelect from "../../../components/Form/FormSelect";
import FormButton from "../../../components/Form/FormButton";
import CheckoutSteps from "../CheckoutSteps/CheckoutSteps";

const ShippingScreen = () => {
  const { shippingAddress } = useSelector((state) => state.cart);

  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress?.postalCode || ""
  );
  const [country, setCountry] = useState(
    shippingAddress?.country || "Nouvelle-Calédonie"
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate("/payment");
  };

  return (
    <>
      <CheckoutSteps step1 step2 />
      <FormContainer
        title="Adresse de livraison"
        subtitle="Où souhaitez-vous être livré ?"
      >
        <form onSubmit={submitHandler}>
          <FormInput
            label="Adresse"
            type="text"
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123 Rue Example"
            icon="📍"
            required
          />

          <FormInput
            label="Ville"
            type="text"
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Nouméa"
            icon="🏙️"
            required
          />

          <FormInput
            label="Code postal"
            type="text"
            name="postalCode"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder="98800"
            icon="📮"
            required
          />

          <FormSelect
            label="Pays"
            name="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            options={[
              { value: "Nouvelle-Calédonie", label: "Nouvelle-Calédonie" },
              { value: "France", label: "France" },
              { value: "Australie", label: "Australie" },
              { value: "Nouvelle-Zélande", label: "Nouvelle-Zélande" },
            ]}
            required
          />

          <FormButton type="submit">Continuer</FormButton>
        </form>
      </FormContainer>
    </>
  );
};

export default ShippingScreen;
