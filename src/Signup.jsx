import React, { useState, useEffect, useRef } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseconfig";
import "./App.css";

import { useAuth } from "./contexts/AuthContext";

import { createBrowserRouter, Link, redirect, useNavigate } from "react-router-dom";

const Signup = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();

  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSumbit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error.code);
      if (error.code.includes("email-already-in-use")) {
        setError("Email already in use!");
      } else {
        setError("Failed to create an account");
      }
    }

    setLoading(false);
  }

  return (
    <div>
      <div style={{ visibility: error ? "visible" : "hidden" }} class="message-notification">
        <p>{error}</p>
      </div>
      <div className="login-form">
        <h2>Sign Up</h2>
        <form onSubmit={handleSumbit}>
          <div className="field-holder">
            <label>Email</label>
            <input placeholder="email..." className="custom-input" type="email" ref={emailRef} required></input>
          </div>
          <div className="field-holder">
            <label>Password</label>
            <input placeholder="password..." className="custom-input" type="password" ref={passwordRef} required></input>
          </div>
          <div className="field-holder">
            <label>Password Confirmation</label>
            <input placeholder="confirm password..." className="custom-input" type="password" ref={passwordConfirmRef} required></input>
          </div>
          <button className="custom-button" type="submit" disabled={loading}>
            Sing up
          </button>
        </form>
        <div style={{ marginTop: "2vh" }}>
          <p>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
