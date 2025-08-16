import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInUser } from "../services/authService";
import type { AuthError } from "firebase/auth";

export const useSignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signInUser({ email, password });
      navigate("/events"); // Changed from "/genres" to "/events"
      console.log("Signed in successfully!");
    } catch (err) {
      const authError = err as AuthError;
      switch (authError.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          setError("Invalid email or password. Please try again.");
          break;
        default:
          setError("An unexpected error occurred. Please try again later.");
          console.error(authError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    handleSignIn,
  };
};
