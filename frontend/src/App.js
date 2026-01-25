import { Outlet, useLocation } from "react-router-dom";
import ScrollToTop from "./components/utils/ScrollToTop";
import Header from "./components/global/Header/Headear";
import Footer from "./components/global/Footer/Footer";

const App = () => {
  const location = useLocation();
  
  // Masquer Header/Footer sur les routes admin et pro
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isProRoute = location.pathname.startsWith('/pro');
  const hideLayout = isAdminRoute || isProRoute;
  
  // Landing page = pleine largeur sans container
  const isLandingPage = location.pathname === '/';

  return (
    <>
      <ScrollToTop />

      {!hideLayout && <Header />}

      <main className={hideLayout ? '' : 'main-content'}>
        {hideLayout || isLandingPage ? (
          <Outlet />
        ) : (
          <div className="container">
            <Outlet />
          </div>
        )}
      </main>

      {!hideLayout && <Footer />}
    </>
  );
};

export default App;