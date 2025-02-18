import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import Navbar from "./Navbar";
import { Atom } from "react-loading-indicators";
import { redirect } from "react-router-dom";
import Swal from "sweetalert2";
import Modal from "react-modal";

Modal.setAppElement("#root");

const Post = () => {
  const { user } = useAuthContext();
  const userId = user._id;
  const userLocal = JSON.parse(localStorage.getItem("user"));
  const token = userLocal.token;

  const navigate = useNavigate();

  const { id } = useParams();

  const [error, setError] = useState(null);
  const [post, setPost] = useState();
  const [liked, setLiked] = useState(false);
  const [totalLiked, setTotalLiked] = useState();
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState([]);
  const [totalComment, setTotalComment] = useState();
  // modal open
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await fetch(`http://localhost:3000/post/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await response.json();

        if (!response.ok) {
          setError(json.error.messag4);
        }

        if (response.ok) {
          setPost(json.post);
          setLiked(json.liked);
          setTotalLiked(json.totalLiked);
          setShowComments(json.showComment);
          setTotalComment(json.totalComment);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    getPost();
  }, [id]);

  // start modal functions

  const customStyle = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      marginRight: "-50%",
      width: "25rem",
      padding: 0,
      overflowX: "hidden",
      transform: "translate(-50%, -50%)",
    },
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  // end modal functions

  const displayImage = () => {
    const path = "../images/";

    if (post) {
      const picture = post.picture;
      return (
        <div
          className="image-wrapper"
          style={{ width: "15rem", height: "18rem" }}
        >
          <img
            src={`${path}${picture}`}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      );
    } else {
      <Atom color="#32cd32" size="medium" text="" textColor="" />;
    }
  };

  const deletePost = async (e) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Post data will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (post.userId == user._id) {
          try {
            e.preventDefault();

            const response = await fetch(
              `http://localhost:3000/post/delete/${id}`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const json = await response.json();

            if (!response.ok) {
              setError(json.error.message);
            }

            if (response.ok) {
              setPost(null);

              Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success",
              });

              navigate(`/profile/${user._id}`);
            }
          } catch (error) {
            setError(error.message);
          }
        } else {
          setError("You cant delete this post!");
        }
      }
    });
  };

  const likePost = async (e) => {
    try {
      e.preventDefault();

      const response = await fetch(`http://localhost:3000/post/like/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error.message);
      }

      if (response.ok) {
        setLiked((prevLike) => !prevLike);
      }
    } catch (error) {
      setError(error);
    }
  };

  const commentPost = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3000/post/comment/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment }),
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error.message);
      }

      if (response.ok) {
        setShowComments((prev) =>
          Array.isArray(prev) ? [...prev, json] : [json]
        );
        setComment("");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="Post" style={{ width: "100vw", height: "100vh" }}>
      <Navbar />
      <div
        className="content"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // flexDirection: "column",
          marginTop: "2rem",
        }}
      >
        <div>
          {post && post.userId == user._id ? (
            <div className="delete-icon" style={{ paddingLeft: "14rem" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                style={{ width: "1rem", cursor: "pointer" }}
                onClick={deletePost}
              >
                <path d="M170.5 51.6L151.5 80l145 0-19-28.4c-1.5-2.2-4-3.6-6.7-3.6l-93.7 0c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80 368 80l48 0 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-8 0 0 304c0 44.2-35.8 80-80 80l-224 0c-44.2 0-80-35.8-80-80l0-304-8 0c-13.3 0-24-10.7-24-24S10.7 80 24 80l8 0 48 0 13.8 0 36.7-55.1C140.9 9.4 158.4 0 177.1 0l93.7 0c18.7 0 36.2 9.4 46.6 24.9zM80 128l0 304c0 17.7 14.3 32 32 32l224 0c17.7 0 32-14.3 32-32l0-304L80 128zm80 64l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16z" />
              </svg>
            </div>
          ) : null}
          {displayImage()}
          <div
            className="action-icon"
            style={{ display: "flex", gap: ".8rem" }}
          >
            {liked == false ? (
              <div style={{ display: "flex", gap: "2px" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  onClick={likePost}
                  style={{
                    width: "1.5rem",
                    // marginTop: ".5rem",
                    cursor: "pointer",
                  }}
                >
                  <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8l0-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5l0 3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20-.1-.1s0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5l0 3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2l0-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" />
                </svg>
                <p>{totalLiked}</p>
              </div>
            ) : (
              <div style={{ display: "flex", marginTop: ".5rem" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={likePost}
                  style={{
                    width: "1.5rem",
                    // marginTop: ".5rem",
                    cursor: "pointer",
                  }}
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="#ff1900"
                    d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"
                  />
                </svg>
                <p>{totalLiked}</p>
              </div>
            )}
            <div
              className="comment"
              style={{ display: "flex", alignItems: "center", gap: ".1rem" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                onClick={openModal}
                style={{
                  width: "1.5rem",
                  marginTop: ".2rem",
                  cursor: "pointer",
                }}
                viewBox="0 0 512 512"
              >
                <path d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9l.3-.5z" />
              </svg>
              <p>{totalComment}</p>
            </div>
            {/* comment modal */}
            <Modal
              isOpen={isOpen}
              onRequestClose={closeModal}
              style={customStyle}
            >
              <div
                className="input-wrapper"
                style={{
                  paddingLeft: "2rem",
                  overflowY: "scroll",
                  width: "100%",
                }}
              >
                {showComments
                  ? showComments.map((comment) => {
                      return <p key={comment._id}>{comment.comment}</p>;
                    })
                  : null}
              </div>

              <form
                onSubmit={commentPost}
                style={{
                  width: "100%",
                  backgroundColor: "#00000010",
                }}
              >
                <div
                  className="comment-input"
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    marginTop: "10rem",
                    paddingLeft: "1rem",
                  }}
                >
                  <input
                    type="text"
                    name="comment"
                    onChange={(e) => setComment(e.target.value)}
                    value={comment}
                    style={{
                      backgroundColor: "transparent",
                      border: 0,
                      borderBottom: "1px solid black",
                      color: "black",
                    }}
                  />
                  <button
                    type="submit"
                    style={{ backgroundColor: "transparent" }}
                  >
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        style={{ width: "1rem" }}
                      >
                        <path d="M307 34.8c-11.5 5.1-19 16.6-19 29.2l0 64-112 0C78.8 128 0 206.8 0 304C0 417.3 81.5 467.9 100.2 478.1c2.5 1.4 5.3 1.9 8.1 1.9c10.9 0 19.7-8.9 19.7-19.7c0-7.5-4.3-14.4-9.8-19.5C108.8 431.9 96 414.4 96 384c0-53 43-96 96-96l96 0 0 64c0 12.6 7.4 24.1 19 29.2s25 3 34.4-5.4l160-144c6.7-6.1 10.6-14.7 10.6-23.8s-3.8-17.7-10.6-23.8l-160-144c-9.4-8.5-22.9-10.6-34.4-5.4z" />
                      </svg>
                    </span>
                  </button>
                </div>
              </form>
            </Modal>
          </div>
        </div>
        {post ? (
          <div
            className="text-content"
            style={{
              display: "flex",
              justifyContent: "left",
              // width: "13rem",
              flexDirection: "column",
              marginLeft: "1rem",
            }}
          >
            <p style={{ textAlign: "left", fontSize: "1.2rem", margin: 0 }}>
              {post.caption}
            </p>
            <p style={{ fontSize: ".6rem", margin: 0 }}>{post.createdAt}</p>
          </div>
        ) : (
          <h1 style={{ fontSize: "2rem", color: "black" }}>{error}</h1>
        )}
        {error ? (
          <p style={{ fontSize: "2rem", color: "black" }}>{error}</p>
        ) : null}
      </div>
    </div>
  );
};

export default Post;
