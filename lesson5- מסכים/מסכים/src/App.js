import './App.css';
import A, { A1, A2 } from "./components/A";
import B from "./components/B";
import C from "./components/C";
import D from "./components/D";
import E from "./components/E";
import F from "./components/F";
import ET from "./components/ET";

import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./components/Home";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [userName, setUserName] = useState(sessionStorage.getItem("userName") || "");
  const [userRole, setUserRole] = useState(sessionStorage.getItem("userRole") || "");
  let navigate = useNavigate();


  const handleNavClick = (requiredRole, path) => {
    if (userRole === requiredRole) {
      navigate(path);
    } else {
      alert(`עליך להיות מחובר כ${requiredRole == "TEACHER" ? "מורה" : "תלמיד"}`);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear(); // מוחק את הזיכרון
    setUserName(""); // מאפס את השם במסך
    setUserRole(""); // מאפס את התפקיד
    navigate("/");   // מחזיר לדף הבית
  };


  return (
    <>
      <input
        id="back"
        type="button"
        value={"→"}
        onClick={() => navigate(-1)}
      />

      <nav className="navbar">
        <div className="nav-links">
          <Link title="דף הבית" to="/" className="nav-item">דף הבית</Link>
          <Link title="התחברות" to="/a" className="nav-item">התחברות</Link>
          <Link title="הרשמה" to="/b" className="nav-item">הרשמה</Link>

          <button className="nav-item" onClick={() => handleNavClick("TEACHER", "/C")}>מורה</button>
          <button className="nav-item" onClick={() => handleNavClick("STUDENT", "/D")}>תלמיד</button>

          <button className="nav-item logout" onClick={handleLogout}>התנתק</button>
        </div>
      </nav>

      <Routes>
        <Route index element={<Home />} />
        <Route path="a">
          <Route index element={<A onTeacherLogin={setUserName} setUserRole={setUserRole} />} />
          <Route path="a1" element={<A1 />} />
          <Route path="a2" element={<A2 />} />
        </Route>
        <Route path="b" element={<B />} />
        <Route path="/C" element={<C teacherName={userName} />} />
        <Route path="/D" element={<D userName={userName} />} />      
        <Route path="e" element={<E />} />
        <Route path="f" element={<F />} />
        <Route path="/ET" element={<ET />} />
      </Routes>
    </>
  );
}

export default App;