import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

function Home() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="home-wrapper">
      <div className="home-box">

        <h2>Expense Manager</h2>

        <div className="toggle-buttons">
          <button
            className={isLogin ? "active" : ""}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>

          <button
            className={!isLogin ? "active" : ""}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        {isLogin ? <Login /> : <Register />}

      </div>
    </div>
  );
}

export default Home;