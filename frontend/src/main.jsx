import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthContextProvider } from "./context/authContext.jsx";
import { PostContextProvider } from "./context/PostContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <PostContextProvider>
        <App />
      </PostContextProvider>
    </AuthContextProvider>
  </StrictMode>
);
