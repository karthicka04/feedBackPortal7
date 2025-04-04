import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Login() {  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();  

  async function login() {
    const user = { email, password };

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        user
      );
      console.log(data);
      setLoading(false);

      localStorage.setItem("currentUser", JSON.stringify(data));  

      toast.success("Login Successful!", { position: "top-right", autoClose: 2000 });

      navigate("/home");

    } catch (error) {
      setLoading(false);
      toast.error("Invalid Credentials", { position: "top-right", autoClose: 2000 });
      console.error("Login error:", error.response ? error.response.data : error.message); 
    }
  }

  return (
    <div>
      {loading && <p>Loading...</p>}
      <div className="row justify-content-center mt-5">
        <div className="col-md-5 mt-5">
          <div className="bs">
            <h2>Login</h2>
            <input
              type="text"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn btn-primary mt-3" onClick={login} disabled={loading}> 
              {loading ? "Logging in..." : "Login"}  
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
