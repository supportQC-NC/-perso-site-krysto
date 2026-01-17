import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader-recycle">
        <div className="loader-circle">
          <span className="loader-arrow"></span>
          <span className="loader-arrow"></span>
          <span className="loader-arrow"></span>
        </div>
        <div className="loader-bottle">
          <div className="loader-cap"></div>
          <div className="loader-body"></div>
        </div>
      </div>
      <p className="loader-text">Recyclage en cours...</p>
    </div>
  );
};

export default Loader;
