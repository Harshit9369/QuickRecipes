import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/authContext";


const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const [err, setError] = useState(null);

  const navigate = useNavigate();

  const {login} = useContext(AuthContext);

  const handleClick = async (e) => {
    e.preventDefault();
    console.log("Sending login request with data:", inputs);
    await axios
      .post("http://localhost:5173/api/auth/login", inputs)
      try {
        await login(inputs);
        navigate("/");
      } catch (error) {
        if (error.response) {
          console.log("Server responded with error:", error.response.data);
          console.log("Status code:", error.response.status);
        } else if (error.request) {
          console.log("No response received from server:", error.request);
        } else {
          console.log("Error setting up the request:", error.message);
        }
        setError(err.response.data)
      }
  };
  return (
    <div className="auth">
      <h1>Login</h1>
      <form>
        <input
          required
          type="text"
          placeholder="Username"
          name="username"
          value={inputs.username}
          onChange={handleChange}
        />
        <input
          required
          type="password"
          placeholder="Password"
          name="password"
          value={inputs.password}
          onChange={handleChange}
        />
        <button onClick={handleClick}>Login</button>
        {err && <p>{err}</p>}
        <span>
          Don't have an account? <Link to="/register">Register</Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
