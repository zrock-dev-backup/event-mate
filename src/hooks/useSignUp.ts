import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebaseConfig.ts";
import { createUserProfileDocument } from "../services/userService.ts";

export const useSignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [validationError, setValidationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError("");
    setStatus(null);
    setIsSubmitting(true);

    // Client-side validation
    if (!name || name.length < 1) {
      setValidationError("Name is required.");
      setIsSubmitting(false);
      return;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setValidationError("Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }
    if (!password || password.length < 6) {
      setValidationError("Password must be at least 6 characters long.");
      setIsSubmitting(false);
      return;
    }

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await updateProfile(user, { displayName: name });
      await createUserProfileDocument(user, { name, email });
      setStatus({
        type: "success",
        message: "Account created successfully. Redirecting...",
      });
      setTimeout(() => navigate("/events"), 2000); // Changed from "/genres"
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setStatus({
          type: "error",
          message: "This email address is already in use.",
        });
      } else {
        setStatus({
          type: "error",
          message: "Failed to create an account. Please try again.",
        });
      }
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialSignIn = async (
    provider: GoogleAuthProvider | FacebookAuthProvider,
  ) => {
    setIsSubmitting(true);
    setStatus(null);
    try {
      const { user } = await signInWithPopup(auth, provider);
      await createUserProfileDocument(user);
      setStatus({
        type: "success",
        message: "Signed in successfully. Redirecting...",
      });
      setTimeout(() => navigate("/events"), 2000); // Changed from "/genres"
    } catch (error: any) {
      console.error("Social Sign-In Error: ", error);
      setStatus({
        type: "error",
        message: "Failed to sign in. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    validationError,
    isSubmitting,
    status,
    setStatus,
    handleSubmit,
    handleSocialSignIn,
  };
};
