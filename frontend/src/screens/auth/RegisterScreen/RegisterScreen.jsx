import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../../../slices/usersApiSlice";
import { setCredentials } from "../../../slices/authSlice";
import { FiUser, FiMail, FiLock, FiLoader } from "react-icons/fi";
import "./RegisterScreen.css";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search } = useLocation();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const redirect = new URLSearchParams(search).get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const res = await register({ name, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      setError(err?.data?.message || "Une erreur est survenue");
    }
  };

  return (
    <div className="register">
      <div className="register__card">
        <h1 className="register__title">Créer un compte</h1>
        <p className="register__subtitle">Rejoignez la communauté Krysto</p>

        {error && <div className="register__error">{error}</div>}

        <form onSubmit={handleSubmit} className="register__form">
          <div className="register__field">
            <label htmlFor="name">Nom</label>
            <div className="register__input-wrapper">
              <FiUser />
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom"
                required
              />
            </div>
          </div>

          <div className="register__field">
            <label htmlFor="email">Email</label>
            <div className="register__input-wrapper">
              <FiMail />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
              />
            </div>
          </div>

          <div className="register__field">
            <label htmlFor="password">Mot de passe</label>
            <div className="register__input-wrapper">
              <FiLock />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="register__field">
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <div className="register__input-wrapper">
              <FiLock />
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" className="register__btn" disabled={isLoading}>
            {isLoading ? <FiLoader className="spin" /> : "S'inscrire"}
          </button>
        </form>

        <p className="register__footer">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterScreen;
