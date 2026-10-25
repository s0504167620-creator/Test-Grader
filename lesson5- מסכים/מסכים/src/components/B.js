import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function B() {
  let navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    grade: "",
    role: "" 
  });

  

  const handleRegister = async () => {
    if (!formData.role) {
      alert("אנא בחר סוג משתמש (תלמיד או מורה)");
      return; // עוצר את המשך הפונקציה
    }
    try {
      // שליחה לשרת
      const response = await axios.post('http://localhost:8080/api/users/register', formData);
      alert(response.data); 
      navigate("../"); // חזרה לדף התחברות
    } catch (error) {
      console.error("שגיאה:", error);
      alert("ההרשמה נכשלה");
    }
  };

  return (
    <div className="cssAllDiv">
      <h1>הרשמה</h1>
      
      <h4> :שם מלא</h4>
      <input className="input" type="text" placeholder="name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})} />

      <h4>:מייל</h4>
      <input className="input" type="text" placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})} />

      <h4>:סיסמא</h4>
      <input className="input" type="password" placeholder="password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})} />

      <h4>:כיתה (רק לתלמיד)</h4>
      <input className="input" type="text" placeholder="class"
        value={formData.grade}
        onChange={(e) => setFormData({...formData, grade: e.target.value})} />

      <h4>:תלמיד/ מורה</h4>
      <input type="radio" name="userType" value="student" 
        checked={formData.role == "student"}
        onChange={(e) => setFormData({...formData, role: e.target.value})} />
      <label> תלמיד</label>
      
      <input type="radio" name="userType" value="teacher" 
        checked={formData.role == "teacher"}
        onChange={(e) => setFormData({...formData, role: e.target.value})} />
      <label> מורה</label>

      <br /><br />
      <input className="input" type="button" value={"הירשם"} onClick={handleRegister} />
    </div>
  );
}