import "../App.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import Navbar from "../components/Navbar";
import Modal from "react-modal";
import { useLogout } from "../hooks/useLogout";
import UserImg from "../../public/images/user.jpg";
import UserPost from "../components/UserPost";
import Swal from "sweetalert2";
import { usePostContext } from "../hooks/usePostContext";
import { Link } from "react-router-dom";

Modal.setAppElement("#root");

const Profile = () => {
  const { posts } = usePostContext();
  const { dispatch, user, searchedUser } = useAuthContext();
  const userId = user._id;
  // variables to fetch user token
  const userLocal = JSON.parse(localStorage.getItem("user"));
  const token = userLocal.token;
  // url id
  const { id } = useParams();
  // user yang ditampilkan
  const displayUser =
    searchedUser && searchedUser?._id == id ? searchedUser : user;

  const [username, setUsername] = useState(user.username);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const { logout } = useLogout();

  // add username modal
  const [isOpen, setIsOpen] = useState(false);
  // add profile image component
  const [show, setShow] = useState(false);
  // uploading image
  const [file, setFile] = useState(user.picture);
  console.log(posts);

  const openModal = (modalId) => {
    setIsOpen(modalId);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const showComponent = () => {
    setShow(true);
  };
  const hideComponent = () => {
    setShow(false);
  };

  // display profile picture from db
  const displayImage = () => {
    const url = "../images/";
    const picture = displayUser.picture;

    if (picture) {
      return (
        <img
          style={{
            width: "100%",
            height: "100%",
            objectFit: "fill",
            borderRadius: "100%",
          }}
          src={`${url}${picture}`}
          alt="picture"
        />
      );
    } else {
      return (
        <img
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            borderRadius: "100%",
          }}
          src={UserImg}
          alt="picture"
        />
      );
    }
  };

  // delete profile picture
  const deleteImage = async (e) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        e.preventDefault();

        try {
          // fetch delete image api from backend
          const response = await fetch(
            `http://localhost:3000/user/delete/image/${userId}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // store response in json
          const json = await response.json();

          if (!response.ok) {
            // set error variable json error message
            setError(json.error.message);
          }

          if (response.ok) {
            // console.log(localStorage.getItem("user"));
            dispatch({ type: "UPDATE_USER_PICTURE", payload: null });

            userLocal.picture = null;
          }
        } catch (error) {
          setError(error.message);
        }
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
  };

  // add or edit username
  const addUsername = async (e) => {
    e.preventDefault();
    try {
      // fetch the add username api from backend
      const response = await fetch(
        `http://localhost:3000/user/add/username/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId,
            username,
          }),
        }
      );
      // store response in json
      const json = await response.json();

      // send error message if response doesnt work
      if (!response.ok) {
        setError(json.error.message);
      }

      if (response.ok) {
        // store user from local storage into a variable
        const storedData = JSON.parse(localStorage.getItem("user"));

        // new user data
        const updatedData = { ...storedData.user, username };

        //  set user to local storage
        localStorage.setItem(
          "user",
          JSON.stringify({ ...storedData, user: updatedData })
        );

        // update user in authContext
        await dispatch({ type: "UPDATE_USERNAME", payload: username });

        // close the modal
        closeModal();

        Swal.fire({
          title: "Success",
          text: "Username added successfully!",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Fetch Error: ", error);
    }
  };

  // handle file input changes
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
  };

  // add image
  const addImage = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please Upload an Image");
    }

    const formData = new FormData();
    formData.append("picture", file);

    try {
      const response = await fetch(
        `http://localhost:3000/user/add/image/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const json = await response.json();
      // console.log(json.picture);

      if (!response.ok) {
        setError(json.error.message);
      }

      if (response.ok) {
        dispatch({ type: "UPDATE_USER_PICTURE", payload: json.picture });
        setPreview(null);

        Swal.fire({
          title: "Image Added Successfully",
          icon: "success",
        });

        closeModal();
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // logout function
  const handleLogout = async () => {
    await logout();
  };

  // remove localStorage searchedUser
  const removeSearchedUser = () => {
    dispatch({ type: "SEARCHED_USER", payload: null });

    localStorage.removeItem("searchedUser");
  };

  // modal
  const customStyle = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  return (
    <div className="profile-wrapper" style={{ marginBottom: "20rem" }}>
      {/* return button */}
      {searchedUser ? (
        <Link to="/explore" onClick={removeSearchedUser}>
          <div
            className="return"
            style={{ position: "absolute", top: 3, left: 3, cursor: "pointer" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              style={{ width: "2rem" }}
            >
              <path d="M177.5 414c-8.8 3.8-19 2-26-4.6l-144-136C2.7 268.9 0 262.6 0 256s2.7-12.9 7.5-17.4l144-136c7-6.6 17.2-8.4 26-4.6s14.5 12.5 14.5 22l0 72 288 0c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32l-288 0 0 72c0 9.6-5.7 18.2-14.5 22z" />
            </svg>
          </div>
        </Link>
      ) : null}
      <div className="profile" id="profile">
        <Navbar />
        <div
          className="profile-picture"
          style={{ position: "relative" }}
          onMouseEnter={showComponent}
          onMouseLeave={hideComponent}
        >
          {/* show user picture function */}
          {show && userId == id ? (
            <div
              className="add-image"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "100%",
                backgroundColor: "black",
                opacity: "80%",
                position: "absolute",
              }}
            >
              {/* delete function */}
              {user.picture == null ? (
                <div style={{ height: "100%" }}>
                  <span
                    style={{
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {/* add image icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ width: "3rem", cursor: "pointer" }}
                      viewBox="0 0 448 512"
                      onClick={() => openModal("modal2")}
                    >
                      <path
                        fill="#ffffff"
                        d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"
                      />
                    </svg>
                  </span>
                </div>
              ) : (
                // add picture function
                <div style={{ height: "100%" }}>
                  <span
                    style={{
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={deleteImage}
                      style={{ width: "3rem", cursor: "pointer" }}
                      viewBox="0 0 448 512"
                    >
                      <path
                        fill="#ffffff"
                        d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z"
                      />
                    </svg>
                  </span>
                </div>
              )}
              {/* add picture modal */}
              <Modal
                isOpen={isOpen == "modal2"}
                onRequestClose={closeModal}
                style={customStyle}
                contentLabel="add image modal"
              >
                <h2 style={{ textAlign: "center" }}>Add Profile Picture</h2>
                <form onSubmit={addImage} encType="multipart/form-data">
                  <ul>
                    <li style={{ display: "flex", justifyContent: "center" }}>
                      <div
                        className="preview"
                        style={{
                          width: "10rem",
                          height: "10rem",
                          borderRadius: "100%",
                          border: "1px solid black",
                          margin: 0,
                        }}
                      >
                        {!preview ? <p>Upload a picture</p> : null}
                        <img
                          src={file ? preview : null}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "100%",
                          }}
                        />
                      </div>
                    </li>
                    <li style={{ listStyle: "none" }}>
                      <input
                        type="file"
                        name="picture"
                        onChange={handleFileChange}
                        max={1}
                        style={{ backgroundColor: "white", cursor: "pointer" }}
                      />
                    </li>
                    <li style={{ listStyle: "none", marginTop: "1rem" }}>
                      <button>Add</button>
                    </li>
                  </ul>
                </form>
              </Modal>
            </div>
          ) : null}
          {displayImage()}
        </div>
        <div className="profile-data">
          <div className="profile-username">
            <h2>
              {!displayUser.username
                ? "displayUser.email"
                : displayUser.username}
            </h2>
            {/* edit username button */}
            {userId == id ? (
              <>
                <button
                  onClick={() => openModal("modal1")}
                  style={{
                    backgroundColor: "transparent",
                    color: "black",
                    border: "1px solid black",
                  }}
                >
                  {!user.username ? "Add Username" : "Edit Username"}
                </button>

                {/* user username modal */}
                <Modal
                  isOpen={isOpen == "modal1"}
                  onRequestClose={closeModal}
                  style={customStyle}
                  contentLabel="Example Modal"
                >
                  <h2 className="modal-h2">
                    {!user.username ? "Add Username" : "Edit Username"}
                  </h2>
                  <form className="modal-form" onSubmit={addUsername}>
                    <ul>
                      <li>
                        <input
                          type="text"
                          onChange={(e) => setUsername(e.target.value)}
                          value={username}
                        />
                      </li>
                      <li>
                        <button>{!user.username ? "add" : "Edit"}</button>
                      </li>
                      {error ? <p>{error}</p> : null}
                    </ul>
                  </form>
                </Modal>

                {/* logout button */}
                <button
                  onClick={handleLogout}
                  style={{
                    backgroundColor: "transparent",
                    color: "black",
                    border: "1px solid black",
                    marginLeft: "5px",
                  }}
                >
                  Logout
                </button>
              </>
            ) : null}
            {searchedUser ? (
              <div
                className="follow"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <button
                  style={{
                    backgroundColor: "transparent",
                    color: "black",
                    border: "1px solid black",
                  }}
                >
                  Follow
                </button>
              </div>
            ) : null}
          </div>
          <div className="profile-follow">
            <div className="followers">
              <h5>followers</h5>
              <p>{!displayUser.followers ? "0" : displayUser.followers}</p>
            </div>
            <div className="following">
              <h5>following</h5>
              <p>{!displayUser.following ? "0" : displayUser.following}</p>
            </div>
            <div className="posts">
              <h5>posts</h5>
              <p>{!posts ? "0" : posts.length}</p>
            </div>
          </div>
        </div>
      </div>
      <hr style={{ width: "75%", marginTop: "2rem" }} />
      <UserPost />
    </div>
  );
};
export default Profile;
