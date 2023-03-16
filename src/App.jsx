import React, { useState } from "react";
import { createBrowserRouter, createRoutesFromElements, Link, Route, Outlet, RouterProvider, Routes } from "react-router-dom";
import "./App.css";

import { AuthProvider } from "./contexts/AuthContext";

// import TodoList from "./TodoList";
import TodoList from "./TodoList";
import Signup from "./Signup";
import Login from "./Login";
function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<TodoList />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}
export default App;
