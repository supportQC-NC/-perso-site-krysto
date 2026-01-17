import React from "react";
import Header from "./components/global/Header";
import Footer from "./components/global/Footer";
import { Outlet } from "react-router-dom";
import ScrollToTop from "./components/utils/ScrollToTop";

const App = () => {
  return (
    <>
    <ScrollToTop />
      <Header />
      <main>
        <div className="container">
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default App;
