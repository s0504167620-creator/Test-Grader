import React, { useEffect, useState } from "react"
import axios from "axios"

export default function E() {

  const [availableTests, setAvailableTests] = useState([]) // רשימת המבחנים שתגיע מהשרת
  const [loading, setLoading] = useState(true) // מצב הטעינה של הדף

  // פונקציה לשליפת המבחנים מהשרת
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/users/available-exams");
        setAvailableTests(response.data) // שומר את הרשימה של המבחנים שחזר 
      } catch (error) {
        console.error("שגיאה בטעינת מבחנים:", error)
      } finally {
        setLoading(false) // מפסיק את מצב הטעינה
      }
    }
    fetchTests() // הפעלת הפונקציה
  }, []) 
  return (
    <div className="cssAll teacher-dashboard">
      <header className="dashboard-header">
        <h1>מבחנים זמינים לפתירה</h1>
        <p>בחר מבחן מהרשימה כדי להתחיל בפתרון</p>
      </header>

      <div className="cssAllDiv" style={{ width: '70%', marginTop: '20px' }}>
        {loading ? (<p>טוען מבחנים מהשרת...</p>): availableTests.length > 0 ? (
          /* אם יש מבחנים - נציג אותם בטבלה  */
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #2c3e50' }}>
                <th style={{ padding: '10px' }}>שם המבחן</th>
                <th>תאריך פרסום</th>
                <th>פעולה</th>
              </tr>
            </thead>
            <tbody>
              {/*עוברים על מערך המבחנים ויוצרים שורה לכל מבחן */}
              {availableTests.map((Test) => (
                <tr key={Test.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{Test.title|| "מבחן ללא שם"}</td>
                  {/* תאריך*/}
                  <td>{Test.uploadDate ? new Date(Test.uploadDate).toLocaleDateString() : "אין תאריך"}</td>
                  <td>
                    <button 
  className="input" 
  style={{ width: 'auto', padding: '5px 15px' }}
  onClick={() => {
      const pdfWindow = window.open("");
      pdfWindow.document.write(
          `<iframe width='100%' height='100%' src='data:application/pdf;base64,${Test.fileData}'></iframe>`
      );
  }} 
>
                      פתח מבחן
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          /* אם אין מבחנים ברשימה */
          <p>אין מבחנים זמינים כרגע. המתן שהמורה יעלה מבחן.</p>
        )}
      </div>
    </div>
  );
}