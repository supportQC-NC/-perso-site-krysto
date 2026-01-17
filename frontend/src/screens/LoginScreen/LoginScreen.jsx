import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../../slices/usersApiSlice";
import { setCredentials } from "../../slices/authSlice";
import { toast } from "react-toastify";

import FormContainer from "../../components/Form/FormContainer";
import FormInput from "../../components/Form/FormInput";
import FormButton from "../../components/Form/FormButton";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

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

    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("Connexion réussie !");
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Erreur de connexion");
    }
  };

  return (
    <FormContainer title="Connexion" subtitle="Bienvenue sur Krysto">
      <form onSubmit={submitHandler}>
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
          placeholder="Entrez votre mot de passe"
          icon="🔒"
          required
        />

        <FormButton type="submit" isLoading={isLoading}>
          Se connecter
        </FormButton>
      </form>

      <div className="form-footer">
        <p>
          Pas encore de compte ?{" "}
          <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>
            S'inscrire
          </Link>
        </p>
      </div>
    </FormContainer>
  );
};

export default LoginScreen;
