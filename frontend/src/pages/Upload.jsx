import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { usePostContext } from "../hooks/usePostContext";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";

const Upload = () => {
  const { dispatch } = usePostContext();
  const [image, setImage] = useState();
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const userLocal = JSON.parse(localStorage.getItem("user"));
  const token = userLocal.token;

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
  };

  const uploadPost = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("picture", image);
    formData.append("caption", caption);

    try {
      const response = await fetch(
        `http://localhost:3000/post/upload/${user._id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const json = await response.json();

      if (!response.ok) {
        setError(json.error.message);
      }

      if (response.ok) {
        dispatch({ type: "UPLOAD_POST", payload: json });
        setImage(null);
        setPreview(null);
        setCaption("");
        Swal.fire({
          title: "Post Uploaded Successfully!",
          icon: "success",
        });
        navigate(`/profile/${user._id}`);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div
      className="upload"
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Navbar />
      <div className="upload-content">
        {/* <h1 style={{ fontWeight: 400, textAlign: "center" }}>Upload</h1> */}
        <form onSubmit={uploadPost}>
          <ul style={{ marginTop: "5rem" }}>
            <li
              style={{
                listStyle: "none",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <div
                className="input-image"
                style={{
                  width: "10rem",
                  height: "10rem",
                  display: "block",
                  border: "2px solid black",
                }}
              >
                <img
                  src={image !== null ? preview : null}
                  alt="Choose File"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <input
                type="file"
                name="picture"
                onChange={handleImageChange}
                // value={image}
                max={1}
                style={{ marginTop: "1rem" }}
              />
            </li>
            <li style={{ listStyle: "none", marginTop: "1rem" }}>
              {/* <label htmlFor="caption" style={{ display: "block" }}>
                Caption
              </label> */}
              <input
                type="text"
                onChange={(e) => setCaption(e.target.value)}
                value={caption}
                name="caption"
                placeholder="Insert a caption. . ."
                style={{
                  backgroundColor: "white",
                  color: "black",
                  border: "0",
                  borderBottom: "1px solid black",
                }}
              />
            </li>
            <li style={{ listStyle: "none", marginTop: "1rem" }}>
              <button>Upload</button>
            </li>
          </ul>
        </form>
      </div>
    </div>
  );
};

export default Upload;
