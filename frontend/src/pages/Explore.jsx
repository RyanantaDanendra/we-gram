import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Explore = () => {
  const userLocal = JSON.parse(localStorage.getItem("user"));
  const token = userLocal.token;

  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async (e) => {
      try {
        // e.preventDefault();

        const response = await fetch("http://localhost:3000/post/explore", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await response.json();

        if (!response.ok) {
          setError(json.error.message);
        }

        if (response.ok) {
          setPosts(json);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    getPosts();
  }, []);

  const displayImage = () => {
    const path = "../images/";

    return posts.map((post) => (
      <Link to={`/post/${post._id}`}>
        <div
          className="image-explore"
          style={{ width: "10rem", height: "10rem", cursor: "pointer" }}
        >
          <img
            src={`${path}${post.picture}`}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </Link>
    ));
  };

  return (
    <div className="explore">
      <Navbar />
      <div
        className="wrapper"
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "start",
          gap: "2px",
        }}
      >
        {displayImage()}
      </div>
      ))
    </div>
  );
};
export default Explore;
