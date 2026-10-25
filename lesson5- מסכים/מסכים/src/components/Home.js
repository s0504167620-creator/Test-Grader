import { Link } from "react-router-dom"; // ייבוא של הקישורים
import { useNavigate } from "react-router-dom";
export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page-wrapper">
      {/* כרטיסיית התוכן והכפתורים */}
      <div className="cssAllDiv home-split-card">
        <h1>ברוכים הבאים!</h1>
        
        <p className="home-description">
          תוכנה זו נועדה לבדוק מבחנים במתמטיקה.
          <br />
          תוכלו להעלות מבחנים לבדיקה ולקבל את הציון במהירות ובקלות...
        </p>

        <nav className="home-nav">
          <input 
            className="input"
            type="button"
            value="התחברות"
            onClick={() => navigate("/a")} 
          />

          <input 
            className="input btn-secondary"
            type="button"
            value="הרשמה"
            onClick={() => navigate("/b")} 
          />
        </nav>
      </div>

      {/* אזור התמונה המקצועית בצד */}
      <div className="home-image-side">
        <div className="math-bg-graphic">
          {/* כאן יצרנו גרפיקה מתמטית יפה ישירות ב-CSS כדי שלא תסתבכי עם נתיבי קבצים של תמונות */}
         <div className="home-image-side">
  <img src={require("../math-formulas.jpg")} alt="מתמטיקה" className="math-hero-img" />
</div>
        </div>
      </div>
    </div>
  );
}