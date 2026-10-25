import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";


export default function A({ onTeacherLogin, setUserRole }) {
   
  const [role, setRole] = useState("STUDENT");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log("מנסה להתחבר עם:", name, password);
    try {
      const response = await axios.post("http://localhost:8080/api/users/login", {
        name: name,
        password: password,
        role: role
      });

      console.log("תגובת השרת:", response.data);
      alert("התחברת בהצלחה!");
      setUserRole(response.data.role.toUpperCase()); 
      sessionStorage.setItem("userRole", response.data.role.toUpperCase()); 
      sessionStorage.setItem("userName", name);               


      if (response.data.role.toLowerCase() == "teacher") {
        onTeacherLogin(name);
        navigate("/C");
      } else {
        navigate("/D");
      }
    } catch (error) {
      console.error("שגיאה בהתחברות:", error);
      alert("שם משתמש או סיסמה שגויים");
    }
  };

  return (
    <div className="cssAllDiv">
      <h1>התחברות</h1>
      <h3>שם משתמש</h3>
      <input 
        className="input"
        type="text"
        placeholder="שם משתמש"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <h3>סיסמה</h3>
      <input 
        className="input"
        type="password"
        placeholder="סיסמה"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <input 
        className="input"
        type="button"
        value="התחבר"
        onClick={handleLogin}
      />
    </div>
  );
}

export function A1() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>A1</h1>
      <input type="button" value="Go back" onClick={() => navigate(-1)} />
    </div>
  );
}

export function A2() {
  return (
    <div>
      <h1>A2</h1>
    </div>
  );
}