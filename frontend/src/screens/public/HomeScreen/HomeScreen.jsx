import Hero from "../../../components/public/Hero/Hero";
import UniverseCarousel from "../../../components/public/UniverseCarousel/UniverseCarousel";
import ProcessSteps from "../../../components/public/ProcessSteps/ProcessSteps";
import Testimonials from "../../../components/public/Testimonials/Testimonials";
import Newsletter from "../../../components/public/NewsLetter/NewsLetter";
import "./HomeScreen.css";

const HomeScreen = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <Hero />

      {/* Universe Carousel */}
      <UniverseCarousel />

      {/* Process Steps */}
      <ProcessSteps />

      {/* Testimonials */}
      <Testimonials />

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
};

export default HomeScreen;
