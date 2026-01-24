import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const hasProAccess =
    userInfo &&
    (userInfo.isAdmin || (userInfo.isPro && userInfo.proStatus === "approved"));

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  if (!hasProAccess) {
    return (
      <Navigate
        to="/"
        replace
        state={{ message: "Accès réservé aux comptes Pro" }}
      />
    );
  }

  return <Outlet />;
};

export default ProRoute;
