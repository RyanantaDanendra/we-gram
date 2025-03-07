import Navbar from "../components/Navbar";
import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Atom } from "react-loading-indicators";
import UserImg from "../../public/images/user.jpg";
import { useAuthContext } from "../hooks/useAuthContext";
import { usePostContext } from "../hooks/usePostContext";

const Explore = () => {
  const { dispatch } = useAuthContext();
  // const { dispatchL: postDispatch } = usePostContext();
  const userLocal = JSON.parse(localStorage.getItem("user"));
  const token = userLocal.token;
  const location = useLocation();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [posts, setPosts] = useState([]);
  // variable for input value changes
  const [userInput, setUserInput] = useState("");
  // variable for user found in the search user function
  const [foundUser, setFoundUser] = useState([]);
  // variable for triggering displayFoundUser()
  const [showResult, setShowResult] = useState();
  // variable to remove onclick on showResult
  const foundResultRef = useRef(null);
  // form ref
  const formRef = useRef(null);

  // re-render everytime location changes
  useEffect(() => {
    localStorage.setItem("lastPage", location.pathname);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // check if the click is outside of the ref
      if (
        foundResultRef.current &&
        !foundResultRef.current.contains(e.target) &&
        formRef.current &&
        !formRef.current.contains(e.target)
      ) {
        setShowResult(false);
      }
    };

    // add event listener to entire page
    document.addEventListener("click", handleClickOutside);
    // remove event listener if the user clicked outside of the ref
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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

    if (posts) {
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
    } else {
      return <Atom color="#32cd32" size="medium" text="" textColor="" />;
    }
  };

  const searchUser = async (e) => {
    e.preventDefault();

    setFoundUser([]);
    setIsLoading(true);
    // setShowResult(false);

    try {
      const response = await fetch("http://localhost:3000/user/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: userInput }),
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error.message);
        setFoundUser([]);
      }

      if (response.ok) {
        setFoundUser(json);
        setIsLoading(false);
        setShowResult(true);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSelectUser = async (user) => {
    await dispatch({ type: "SEARCHED_USER", payload: user });

    localStorage.setItem("searchedUser", JSON.stringify(user));
  };

  // hover to searched user page
  const SearchedUser = ({ id, children }) => {
    const link = useMemo(() => `/search/${id}`, [id]);

    return <Link to={link}>{children}</Link>;
  };

  const displayFoundUser = () => {
    const path = "../images/";

    if (showResult) {
      if (isLoading) {
        return (
          <div
            className="displayUser-wrapper"
            style={{
              width: "20rem",
              height: "6rem",
              background: "white",
              position: "absolute",
              top: 70,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Atom color="#32cd32" size="medium" text="" textColor="" />;
          </div>
        );
      }

      if (foundUser.length > 0) {
        return (
          <div
            ref={foundResultRef}
            className="displayUser-wrapper"
            style={{
              width: "20rem",
              height: "20rem",
              background: "#FFFFFF90",
              position: "absolute",
              top: 70,
              paddingLeft: "2rem",
            }}
          >
            {foundUser.map((user) => (
              <div
                className="founduser-content"
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <div
                  className="image-wrapper"
                  style={{
                    width: "2rem",
                    height: "2rem",
                    borderRadius: "100%",
                  }}
                >
                  {user.picture !== null ? (
                    <SearchedUser id={user._id}>
                      <img
                        src={`${path}${user.picture}`}
                        alt="Img"
                        onClick={() => handleSelectUser(user)}
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                          borderRadius: "100%",
                          cursor: "pointer",
                        }}
                      />
                    </SearchedUser>
                  ) : (
                    <SearchedUser id={user._id}>
                      <img
                        src={`${path}${UserImg}`}
                        onClick={() => handleSelectUser(user)}
                        alt=""
                        style={{ objectFit: "cover", cursor: "pointer" }}
                      />
                    </SearchedUser>
                  )}
                </div>
                <p>{user.username}</p>
              </div>
            ))}
          </div>
        );
      } else {
        return (
          <div
            ref={foundResultRef}
            className="displayUser-wrapper"
            style={{
              width: "20rem",
              height: "6rem",
              background: "#FFFFFF90",
              position: "absolute",
              top: 70,
            }}
          >
            <p style={{ textAlign: "center" }}>No User Found!</p>
          </div>
        );
      }
    }
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
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "center",
          gap: "2px",
        }}
      >
        <div
          className="input-wrapper"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "1rem",
          }}
        >
          <form ref={formRef} onSubmit={searchUser}>
            <input
              type="text"
              onChange={(e) => setUserInput(e.target.value)}
              value={userInput}
              placeholder="Search user. . ."
              style={{
                backgroundColor: "white",
                color: "black",
                width: "15rem",
                height: "2rem",
                margin: 0,
              }}
            />
            <button
              type="submit"
              onClick={userInput !== "" ? displayFoundUser : null}
              style={{ backgroundColor: "transparent" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: "1rem" }}
                viewBox="0 0 512 512"
              >
                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
              </svg>
            </button>
          </form>
        </div>
        {displayFoundUser()}
        <div style={{ display: "flex", gap: "2px", marginTop: "3rem" }}>
          {displayImage()}
        </div>
      </div>
      ))
      {error !== null ? <p>{error}</p> : null}
    </div>
  );
};
export default Explore;
