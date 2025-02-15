import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { usePostContext } from "../hooks/usePostContext";
import { Link } from "react-router-dom";

const UserPost = () => {
  const { user } = useAuthContext();
  const { dispatch, posts } = usePostContext();

  useEffect(() => {
    const getPosts = async () => {
      const token = JSON.parse(localStorage.getItem("user"));
      const userToken = token.token;

      if (!userToken) {
        console.log("User token required");
      }

      try {
        const response = await fetch(`http://localhost:3000/post`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        const json = await response.json();

        if (!response.ok) {
          console.log(json.error.message);
        }

        if (response.ok) {
          dispatch({ type: "SET_POSTS", payload: json });
        }
      } catch (error) {
        console.log("Fetch post: ", error.message);
      }
    };

    if (user) {
      getPosts();
    }
  }, [dispatch, user]);

  const displayImage = () => {
    const url = "../images/";
    const picture = posts.map((post) => (
      <Link to={`/post/${post._id}`}>
        <div
          className="picture-wrapper"
          key={post._id}
          style={{ width: "10rem", height: "10rem" }}
        >
          <img
            src={`${url}${post.picture}`}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </Link>
    ));

    return picture;
  };

  return (
    <div
      className="userPost"
      style={{
        display: "flex",
        flexWrap: "wrap",
        paddingLeft: "23%",
        paddingRight: "15%",
        gap: "0.5px",
      }}
    >
      {displayImage()}
    </div>
  );
};
export default UserPost;
