import React, { useState, useEffect, useRef } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseconfig";
import "./App.css";

import { useAuth } from "./contexts/AuthContext";

import { Link, redirect, useNavigate } from "react-router-dom";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();

  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSumbit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      console.log("login successful");
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error.code);
      if (error.code.includes("email-already-in-use")) {
        setError("Email already in use!");
      } else if (error.code.includes("wrong-password")) {
        setError("Wrong password!");
      } else {
        setError("Failed to sign in to account");
      }
    }

    setLoading(false);
  }

  return (
    <div>
      <div style={{ visibility: error ? "visible" : "hidden" }} className="message-notification">
        <p>{error}</p>
      </div>
      <div className="login-form">
        <h2>Log In</h2>
        <form onSubmit={handleSumbit}>
          <div className="field-holder">
            <label>Email</label>
            <input placeholder="email..." className="custom-input" type="email" ref={emailRef} required></input>
          </div>
          <div className="field-holder">
            <label>Password</label>
            <input placeholder="password..." className="custom-input" type="password" ref={passwordRef} required></input>
          </div>
          <button className="custom-button" type="submit" disabled={loading}>
            Login
          </button>
        </form>
        <div style={{ marginTop: "2vh" }}>
          <p>
            Already have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
