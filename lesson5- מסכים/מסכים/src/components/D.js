import React, { useState } from "react" 
import axios from "axios"
import {useNavigate} from "react-router-dom"

export default function D() {
  const navigate = useNavigate()
  const userName = sessionStorage.getItem("userName") || "תלמיד"; 

  const [average, setAverage] = useState("0%") // ממוצע הציונים 
  const [testResult, setTestResult] = useState(null) // הציון שמתקבל לאחר סריקת המבחן 
  const [status, setStatus] = useState("") // הודעות למשתמש (טעינה, הצלחה או שגיאה)
  const [loading, setLoading] = useState(false) // האם בתהליך סריקה
  const [showDetails, setShowDetails] = useState(true)

 const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setLoading(true);
    setStatus("סורק ומנתח את המבחן...");
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post('http://localhost:8080/api/users/check-test', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setTestResult(response.data); // השרת יחזיר מספר (למשל 95)
      setStatus("המבחן נבדק בהצלחה!");
    } catch (error) {
      console.error("Student upload error:", error);
      setStatus("שגיאה בבדיקת המבחן."); 
    }
    setLoading(false);
  };

  return (
    <div className="cssAll teacher-dashboard">
      <header className="dashboard-header">
        <h1> שלום לתלמיד {userName}!</h1> 
        <p>?מה תרצה לעשות היום במערכת</p>
      </header>

      <div className="stats-row">
        <div className="stat-card">
          <h3>{average}</h3>
          <p>ממוצע מבחנים</p>
        </div>

        {testResult && (
          <div className="stat-card" style={{ border: "2px solid #2ecc71" }}>
            <h3 style={{ color: "#2ecc71" }}>נבדק</h3>
            <p>ציון סריקה אחרונה</p>
          </div>
        )}
      </div>

      <div className="actions-grid">
        <div className="action-card">
          <h4>📁 העלאת מבחן חדש</h4>
          <input 
            type="file" 
            id="file-upload" 
            className="hidden-input" 
            onChange={handleFileChange} 
            accept="application/pdf"
            disabled={loading}
          />
          <label htmlFor="file-upload" className="input" style={{cursor: "pointer"}}>
            {loading ? "מעבד..." : "בחר קובץ PDF"}
          </label>
          {status && (
            <p style={{
              marginTop: "10px", 
              fontSize: "14px", 
              color: status.includes("שגיאה") ? "red" : "#2c3e50"
            }}>
              {status}
            </p>
          )}
        </div>

<div className="action-card">
          <h4>📊 צפייה בציונים</h4>
          <button className="input" onClick={() => alert("עובר לרשימת המבחנים...")}>
            לרשימת המבחנים
          </button>
        </div>

        <div className="action-card">
          <h4>פתירת מבחנים📄</h4>
          <button className="input" onClick={() => navigate("/E")}>
            לרשימת המבחנים
          </button>
        </div>
      

      <div className="action-card" >
        <h4>פירוט תשובות</h4>
        <button className="input" onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? "הסתר פירוט בדיקה" : "הצג פירוט בדיקה"}
        </button>
      </div>
</div>
      {testResult && showDetails && (
        <div className="action-card" style={{ maxWidth: "800px", margin: "20px auto", textAlign: "right" }}>
          <h4>📋 פירוט בדיקת התרגיל</h4>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa", textAlign: "right" }}>
                <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>מספר שלב</th>
                <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>הביטוי המתמטי</th>
                <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>סטטוס</th>
                <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>מערכת פידבק</th>
              </tr>
            </thead>
            <tbody>
              {testResult.map((step, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "10px" }}>שורה {index + 1}</td>
                  <td style={{ padding: "10px" }}>
                    <code style={{ direction: "ltr", display: "inline-block", backgroundColor: "#f4f4f4", padding: "2px 6px", borderRadius: "4px" }}>
                      {step.stepExpression}
                    </code>
                  </td>
                  <td style={{ padding: "10px", fontWeight: "bold", color: step.correct ? "#27ae60" : "#c0392b" }}>
                    {step.icon} {/* יציג את ה-✓ תקין או ❌ שגיאה המדויקים מהקוד שלך! */}
                  </td>
                  <td style={{ padding: "10px", color: "#555" }}>{step.feedback}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}