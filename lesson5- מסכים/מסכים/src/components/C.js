import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function C() {
  const teacherName = sessionStorage.getItem("userName") || "מורה"; 
  const navigate = useNavigate();
  const [averageGrade, setAverageGrade] = useState("0%");
  const [status, setStatus] = useState(""); 
  const [loading, setLoading] = useState(false); 
  const [registeredStudents, setRegisteredStudents] = useState(0); 
  const [isBlankUploaded, setIsBlankUploaded] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null); // ישמור את תוצאת הניתוח של המבחן 

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/students/count');
        setRegisteredStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, []);
  
// העלאת מבחן לבדיקה 
  const uploadCheckExam = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setLoading(true);
    setStatus("מנתח את המבחן...");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("teacherName", teacherName);

    try {
      const response = await axios.post('http://localhost:8080/api/users/upload-check', formData);
      setAnalysisResult(response.data); 
      setStatus("✅ המבחן נותח, נא לאשר את סוג השאלה כדי להמשיך.");
    } catch (error) {
      console.error("Full Error:", error);
      setStatus("❌ שגיאה בניתוח המבחן.");
    }
    setLoading(false);
    event.target.value = "";
  };

  // פונקציית אישור בדיקה סופית
  const confirmCategory = async () => {
    setLoading(true);
    setStatus("בודק את המבחן...");
    try {
      const response = await axios.post('http://localhost:8080/api/users/confirm-and-grade', {
        teacherName: teacherName,
        category: analysisResult.category,
        extractedText: analysisResult.extractedText
      });
      setAverageGrade(response.data + "%");
      setAnalysisResult(null); // סגירת החלונית
      setStatus("✅ המבחן נבדק בהצלחה והממוצע עודכן!");
    } catch (error) {
      setStatus("❌ שגיאה בבדיקה הסופית.");
    }
    setLoading(false);
  };

  //  העלאת מבחן לתרגול 
  const uploadSolveExam = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setLoading(true);
    setStatus("מעלה מבחן לתרגול...");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("examType", "solve"); 

    try {
      await axios.post('http://localhost:8080/api/users/Equation2.pdf', formData);
      setStatus("✅ המבחן הועלה בהצלחה!");
    } catch (error) {
      setStatus("❌ שגיאה בהעלאת המבחן.");
    }
    setLoading(false);
    event.target.value = "";
  };
  //  פונקציית מבחן ריק 
  const uploadBlankExam = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setLoading(true);
    setStatus("מעלה מבחן ריק למערכת...");
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      await axios.post('http://localhost:8080/api/users/upload-blank', formData);
      setIsBlankUploaded(true); 
      setStatus("✅ המבחן הריק הועלה בהצלחה! שלב ב' נפתח כעת.");
    } catch (error) {
      setStatus("❌ שגיאה בהעלאת המבחן הריק.");
    }
    setLoading(false);
    event.target.value = "";
  };

  return (
    <div className="teacher-dashboard">
      <header className="dashboard-header">
        <h1>שלום המורה {teacherName}!</h1>
        <p>מה תרצה לעשות היום במערכת?</p>
      </header>

      <div className="stats-row">
        <div className="stat-card">
          <h3>{averageGrade}</h3>
          <p>ממוצע כיתתי</p>
        </div>
        <div className="stat-card">
          <h3>{registeredStudents}</h3>
          <p>תלמידים רשומים</p>
        </div>
      </div>

      {status && (
        <div style={{
          textAlign: "center", width: "100%", padding: "10px", marginBottom: "20px",
          fontWeight: "bold", fontSize: "16px",
          color: status.includes("❌") ? "#c0392b" : "#27ae60",
          backgroundColor: status.includes("❌") ? "#fce4e4" : "#e9f7ef",
          borderRadius: "8px"
        }}>
          {status}
        </div>
      )}

      <div className="actions-grid">
        
        <div className="action-card">
          <h4>📝 בדיקת מבחן פתור</h4>
          <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "15px", textAlign: "right" }}>
            חובה להעלות תחילה עותק של המבחן הריק (ללא תשובות) כדי שהמערכת תדע לזהות את השאלות.
          </p>

          <input 
            type="file" 
            id="upload-blank" 
            className="hidden-input" 
            onChange={uploadBlankExam}
            disabled={loading}
          />
          <label htmlFor="upload-blank" className="input btn-secondary" style={{ marginBottom: "10px" }}>
              העלאת מבחן ריק
          </label>

          <input 
            type="file" 
            id="upload-check" 
            className="hidden-input" 
            onChange={(e) => uploadCheckExam(e, "solve")}
            disabled={loading || !isBlankUploaded}
          />
          <label 
            htmlFor="upload-check" 
            className="input"
            style={{ 
              opacity: isBlankUploaded ? 1 : 0.5, 
              cursor: isBlankUploaded ? "pointer" : "not-allowed" 
            }}
          >
            {loading ? "מעבד..." : " בחר מבחן לבדיקה"}
          </label>
        </div>

        <div className="action-card">
          <h4>📄 העלאת מבחן למערכת</h4>
          <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "15px", textAlign: "right" }}>
            העלאת מבחן חדש שיופיע בלוח המבחנים של התלמידים.
          </p>
          
          <input 
            type="file" 
            id="upload-solve" 
            className="hidden-input" 
            onChange={(e) => uploadSolveExam(e, "solve")}
            disabled={loading}
          />
          <label htmlFor="upload-solve" className="input">
            בחר מבחן להעלאה
          </label>
        </div>

        <div className="action-card">
          <h4>📊 צפייה בדוחות</h4>
          <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "15px", textAlign: "right" }}>
            צפייה ברשימת התלמידים המלאה ופירוט הציונים שלהם.
          </p>
          <button className="input" disabled={loading}>
            לרשימת התלמידים
          </button>
        </div>

        <div className="action-card">
          <h4>📑 מבחנים שהעלת לתלמידים</h4>
          <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "15px", textAlign: "right" }}>
            צפייה  במבחנים שהעלת לתלמידים לפתור.
          </p>
          <button className="input" onClick={() => navigate("/ET")}>
            לרשימת המבחנים
          </button>
        </div>

      </div>

      {analysisResult && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(255,255,255,0.98)", zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{ padding: "40px", backgroundColor: "white", borderRadius: "20px", boxShadow: "0 0 20px rgba(0,0,0,0.2)", width: "80%", maxWidth: "600px", textAlign: "center" }}>
            <h2>תוצאות ניתוח המבחן</h2>
            <p style={{ textAlign: "right", direction: "rtl" }}><strong>טקסט שחולץ:</strong> {analysisResult.extractedText}</p>
            <p>סוג שאלה שזוהה: <strong>{analysisResult.category}</strong></p>
            
            <div style={{ marginTop: "30px", display: "flex", gap: "10px", justifyContent: "center" }}>
              <button style={{ backgroundColor: "#27ae60", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px" }} 
                      onClick={confirmCategory}>אישור (זה נכון)</button>
              
              <button style={{ backgroundColor: "#c0392b", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px" }}
                      onClick={() => {
                          alert("שלח את הקטגוריה הנכונה לשרת...");
                      }}>לא נכון (פתח עריכה)</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default C;