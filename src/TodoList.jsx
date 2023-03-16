import React, { ChangeEvent, useEffect, useState, useRef } from "react";
import nextId from "react-id-generator";

import { BiCheckCircle } from "react-icons/bi";
import { MdSettings, MdDeleteForever } from "react-icons/md";
import { FiCircle } from "react-icons/fi";
import { IoIosAddCircleOutline, IoIosAddCircle } from "react-icons/io";

import { db } from "./firebaseconfig";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, serverTimestamp, query, orderBy, where, getDoc, setDoc, Timestamp } from "firebase/firestore";

import { useAuth } from "./contexts/AuthContext";

import "./App.css";

import { useNavigate } from "react-router-dom";

const TodoList = () => {
  const navigate = useNavigate();

  const { currentUser, logout } = useAuth();
  const [error, setError] = useState("");
  const [userData, setUserData] = useState([]);
  const [shouldUpdate, setShouldUpdate] = useState(false); // state variable for triggering updates
  const todoCollectionRef = collection(db, "todos");

  useEffect(() => {
    const getTodos = async () => {
      const q = query(todoCollectionRef, where("uid", "==", currentUser.uid));
      let querySnapshot = await getDocs(q);

      querySnapshot.forEach(doc => {
        const todoData = { ...doc.data(), id: doc.id };
        setUserData(todoData);
      });
    };
    getTodos();
  }, [shouldUpdate]);

  const handleToggleComplete = async id => {
    const todoData = userData.todos || [];
    todoData[id].isCompleted = !todoData[id].isCompleted;
    await setDoc(doc(db, "todos", currentUser.uid), {
      uid: currentUser.uid,
      todos: todoData,
    });
    setShouldUpdate(!shouldUpdate); // toggle the value of shouldUpdate to trigger a re-render
  };

  const handleDeleteTodo = async id => {
    const todoData = userData.todos || [];
    todoData.splice(id, 1)

    await setDoc(doc(db, "todos", currentUser.uid), {
      uid: currentUser.uid,
      todos: todoData,
    });

    setShouldUpdate(!shouldUpdate); // toggle the value of shouldUpdate to trigger a re-render
  };

  const handleLogout = async () => {
    setError("");

    try {
      await logout();
    } catch (error) {
      setError("Failed to log out");
    }
  };

  if (currentUser === null) {
    navigate("/login", { replace: true });
    return null;
  }

  return (
    <>
      <div className="user-details">
        <p style={{ fontWeight: "bold", fontSize: "larger" }}>Logged in as:</p>
        <p>{currentUser.email}</p>
        <button className="custom-button" onClick={handleLogout}>
          Log out
        </button>
      </div>
      <div className="todo">
        <div className="todo-add">
          <AddTodo
            collectionRef={todoCollectionRef}
            setShouldUpdate={setShouldUpdate}
            shouldUpdate={shouldUpdate}
            currentUser={currentUser}
            userData={userData}
          />
        </div>
        <div className="todo-list-container">
          {userData.todos &&
            userData.todos.map((todo, index) => (
              <div className="todo-item" key={index}>
                <div
                  onClick={() => {
                    handleToggleComplete(index);
                  }}
                >
                  {todo.isCompleted ? (
                    <>
                      <BiCheckCircle size={40} className="icon fade-in" /> <FiCircle className="icon fade-out" />
                    </>
                  ) : (
                    <>
                      <BiCheckCircle size={40} className="icon fade-out" />
                      <FiCircle size={40} className="icon fade-in" />
                    </>
                  )}
                </div>
                <MdDeleteForever
                  size={40}
                  onClick={() => {
                    handleDeleteTodo(index);
                  }}
                />
                <div>{todo.text}</div>
              </div>
            // ))
          ))}  
        </div>
      </div>
    </>
  );
};

function AddTodo({ collectionRef, setShouldUpdate, shouldUpdate, currentUser, userData }) {
  const [value, setValue] = React.useState("");
  const handleChange = event => setValue(event.target.value);

  const handleAddTodo = todo => {
    addTodo();
    setValue("");
  };

  const addTodo = async () => {
    const todoData = userData.todos || [];

    if (todoData.length >= 15) { 
      return alert("You can only have 15 todos at a time");
    }

    todoData.push({ text: value, isCompleted: false, createdAt: Timestamp.now() });

    await setDoc(doc(db, "todos", currentUser.uid), {
      uid: currentUser.uid,
      todos: todoData,
    });

    setShouldUpdate(!shouldUpdate); // update trigger when todo is deleted
  };

  return (
    <>
      <input className="custom-input" type="text" placeholder="Add todo" value={value} onChange={handleChange}></input>
      <div>
        {value ? (
          <IoIosAddCircle
            size={40.0}
            onClick={() => {
              handleAddTodo(value);
            }}
          />
        ) : (
          <IoIosAddCircleOutline size={40.0} />
        )}
      </div>
    </>
  );
}
export default TodoList;
