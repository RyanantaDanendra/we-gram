import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Upload from "./pages/Upload";
import Post from "./components/Post";
import Explore from "./pages/Explore";
import SearchedUser from "./pages/SearchedUser";
import { useAuthContext } from "./hooks/useAuthContext";

function App() {
  const { user } = useAuthContext();

  return (
    <div className="App">
      <BrowserRouter>
        <div className="pages">
          <Routes>
            <Route path="/" element={user ? <Home /> : <Signup />} />
            <Route path="/signup" element={!user ? <Signup /> : <Home />} />
            <Route path="/login" element={!user ? <Login /> : <Home />} />
            <Route
              path="/profile/:id"
              element={!user ? <Login /> : <Profile />}
            />
            <Route
              path="/upload/:id"
              element={!user ? <Login /> : <Upload />}
            />
            <Route path="/post/:id" element={!user ? <Login /> : <Post />} />
            <Route path="/explore" element={!user ? <Login /> : <Explore />} />
            <Route
              path="/search/:id"
              element={!user ? <Login /> : <SearchedUser />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
