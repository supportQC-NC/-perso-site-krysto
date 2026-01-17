import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../../slices/usersApiSlice";
import { setCredentials } from "../../slices/authSlice";
import { toast } from "react-toastify";

import FormContainer from "../../components/Form/FormContainer";
import FormInput from "../../components/Form/FormInput";
import FormCheckbox from "../../components/Form/FormCheckbox";
import FormButton from "../../components/Form/FormButton";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    try {
      const res = await register({
        name,
        email,
        password,
        newsletterSubscribed,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("Inscription réussie !");
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Erreur d'inscription");
    }
  };

  return (
    <FormContainer title="Inscription" subtitle="Créez votre compte Krysto">
      <form onSubmit={submitHandler}>
        <FormInput
          label="Nom complet"
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Votre nom"
          icon="👤"
          required
        />

        <FormInput
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          icon="📧"
          required
        />

        <FormInput
          label="Mot de passe"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Minimum 6 caractères"
          icon="🔒"
          helperText="Minimum 6 caractères"
          required
        />

        <FormInput
          label="Confirmer le mot de passe"
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirmez votre mot de passe"
          icon="🔒"
          required
        />

        <FormCheckbox
          label="Je souhaite recevoir la newsletter"
          name="newsletter"
          checked={newsletterSubscribed}
          onChange={(e) => setNewsletterSubscribed(e.target.checked)}
        />

        <FormButton type="submit" isLoading={isLoading}>
          S'inscrire
        </FormButton>
      </form>

      <div className="form-footer">
        <p>
          Déjà inscrit ?{" "}
          <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
            Se connecter
          </Link>
        </p>
      </div>
    </FormContainer>
  );
};

export default RegisterScreen;
