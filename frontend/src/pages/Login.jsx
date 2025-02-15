import "../App.css";
import { useLogin } from "../hooks/useLogin";
import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

const Login = () => {
  // localStorage.clear();
  const { error, isLoading, login } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = await login(email, password);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="login">
      <div className="form-wrapper">
        <div className="form">
          <h2>Login</h2>
          <hr />
          <form onSubmit={handleSubmit}>
            <ul>
              <li>
                <input
                  type="text"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  placeholder="Enter your email. . ."
                />
              </li>
              <li>
                <input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="Enter password"
                />
              </li>
              <li>
                <button disabled={isLoading}>Log-in</button>
              </li>
              {error ? <p className="error">{error}</p> : null}
            </ul>
          </form>
          <div className="google">
            <h5>Or Login With</h5>
          </div>
        </div>
        <div className="box"></div>
      </div>
    </div>
  );
};
export default Login;
