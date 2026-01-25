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
  
  // Pages pleine largeur (sans container)
  const fullWidthPages = [
    '/',           // Landing page
    '/products',   // Page catalogue
    '/product',    // Page produit détaillée ← AJOUTÉ
    '/collection', // Pages univers
    '/about',      // Page à propos
    '/contact' ,   // Page contact
    '/universe',
  ];
  
  const isFullWidth = fullWidthPages.some(page => 
    location.pathname === page || location.pathname.startsWith(`${page}/`)
  );

  return (
    <>
      <ScrollToTop />

      {!hideLayout && <Header />}

      <main className={hideLayout ? '' : 'main-content'}>
        {hideLayout || isFullWidth ? (
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