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
    // ... (validation logic remains the same)
    if (!name || !email || !password || password.length < 6) {
        // Simplified validation check for brevity
        setValidationError("Please fill all fields correctly.");
        return;
    }

    setIsSubmitting(true);
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
      // ... (error handling remains the same)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialSignIn = async (
    provider: GoogleAuthProvider | FacebookAuthProvider,
  ) => {
    // ... (logic remains the same)
    try {
      const { user } = await signInWithPopup(auth, provider);
      await createUserProfileDocument(user);
      setStatus({
        type: "success",
        message: "Signed in successfully. Redirecting...",
      });
      setTimeout(() => navigate("/events"), 2000); // Changed from "/genres"
    } catch (error: any) {
      // ... (error handling remains the same)
    }
  };

  // ... (return statement remains the same, only showing changed parts)
  return {
    name, setName, email, setEmail, password, setPassword, validationError,
    isSubmitting, status, setStatus, handleSubmit, handleSocialSignIn
  };
};
