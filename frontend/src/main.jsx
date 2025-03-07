import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthContextProvider } from "./context/authContext.jsx";
import { PostContextProvider } from "./context/PostContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <PostContextProvider>
          <App />
        </PostContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>
);
