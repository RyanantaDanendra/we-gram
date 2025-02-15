import "../App.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSignup } from "../hooks/useSignup";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState(null);
  const { signup, error, isLoading } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (confirmPassword == password) {
      setLocalError(null);
      await signup(email, password);
    } else {
      setLocalError("Password confirmation error");
    }
  };

  return (
    <div className="signup">
      <div className="form-wrapper">
        <div className="form">
          <h2>Signup</h2>
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
                <input
                  type="password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  placeholder="Confirm password"
                />
              </li>
              <li>
                <button disabled={isLoading}>Sign-up</button>
              </li>
            </ul>
          </form>
          <Link className="link" to="/login">
            Allready Have An Account?
            <span>Log-in</span>
          </Link>
          {error ? <p className="error">{error}</p> : null}
          {localError ? <p className="error">{localError}</p> : null}
        </div>
        <div className="box"></div>
      </div>
    </div>
  );
};
export default Signup;
