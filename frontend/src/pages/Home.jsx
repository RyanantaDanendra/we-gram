import "../App.css";
import Navbar from "../components/Navbar";
import { useAuthContext } from "../hooks/useAuthContext";

const Home = () => {
  return (
    <div className="Home">
      <Navbar />
      <h1>Home</h1>
    </div>
  );
};

export default Home;
