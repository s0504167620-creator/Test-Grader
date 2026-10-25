import React, { useEffect, useState } from "react";
import axios from "axios";

export default function E() {
  const [availableTests, setAvailableTests] = useState([]);
  const [loading, setLoading] = useState(true);

  // פונקציה לשליפת המבחנים מהשרת
  const fetchTests = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/users/available-exams");
      setAvailableTests(response.data);
    } catch (error) {
      console.error("שגיאה בטעינת מבחנים:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  // פונקציית מחיקת מבחן בודד
  const deleteTest = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/users/delete-exam/${id}`);
      // עדכון הרשימה ב-State כדי להסיר את המבחן מהתצוגה ללא רענון עמוד
      setAvailableTests(availableTests.filter(test => test.id !== id));
    } catch (error) {
      console.error("שגיאה במחיקת המבחן:", error);
      alert("נכשל במחיקת המבחן");
    }
  };

  // פונקציית מחיקת כל המבחנים
  const deleteAllTests = async () => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק את כל המבחנים?")) {
      try {
        await axios.delete("http://localhost:8080/api/users/delete-all-exams");
        setAvailableTests([]); // ניקוי ה-State
      } catch (error) {
        console.error("שגיאה במחיקת כל המבחנים:", error);
      }
    }
  };

  return (
    <div className="cssAll teacher-dashboard">
      <header className="dashboard-header">
        <h1>מבחנים זמינים לפתירה</h1>
        <p>בחר מבחן מהרשימה כדי להתחיל בפתרון או לנהל את המבחנים</p>
        {availableTests.length > 0 && (
          <button className="input" style={{ backgroundColor: '#7eb2ef', color: 'white', marginTop: '10px' }} onClick={deleteAllTests}>
            מחק את כל המבחנים
          </button>
        )}
      </header>

      <div className="cssAllDiv" style={{ width: '80%', marginTop: '20px' }}>
        {loading ? (<p>טוען מבחנים מהשרת...</p>) : availableTests.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #2c3e50' }}>
                <th style={{ padding: '10px' }}>שם המבחן</th>
                <th>תאריך פרסום</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {availableTests.map((Test) => (
                <tr key={Test.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{Test.title || "מבחן ללא שם"}</td>
                  <td>{Test.uploadDate ? new Date(Test.uploadDate).toLocaleDateString() : "אין תאריך"}</td>
                  <td>
                    <button 
                      className="input" 
                      style={{ width: 'auto', padding: '5px 15px', marginLeft: '10px' }}
                      onClick={() => {
                        const pdfWindow = window.open("");
                        pdfWindow.document.write(
                          `<iframe width='100%' height='100%' src='data:application/pdf;base64,${Test.fileData}'></iframe>`
                        );
                      }} 
                    >
                      פתח מבחן
                    </button>
                    <button 
                      className="input" 
                      style={{ width: 'auto', padding: '5px 15px', backgroundColor: '#7eb2ef', color: 'white' }}
                      onClick={() => deleteTest(Test.id)}
                    >
                      מחק
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>אין מבחנים זמינים כרגע. המתן שהמורה יעלה מבחן.</p>
        )}
      </div>
    </div>
  );
}