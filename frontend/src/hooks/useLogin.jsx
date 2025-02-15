import { useAuthContext } from "./useAuthContext";
import { useState } from "react";

export const useLogin = () => {
  const { user } = useAuthContext();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    // const token = JSON.parse(localStorage.getItem("user")).token;

    const response = await fetch("http://localhost:3000/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email, password }),
    });
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error?.message || "Something went wrong");
    }

    if (response.ok) {
      // set user in local storage
      localStorage.setItem("user", JSON.stringify(json));

      await dispatch({ type: "LOGIN", payload: json.user });

      setIsLoading(false);
    }
  };

  return { error, isLoading, login };
};
