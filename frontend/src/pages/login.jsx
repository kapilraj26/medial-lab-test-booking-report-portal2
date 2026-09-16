import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/users/login`,
        {
          email: formData.email.trim(),
          password: formData.password,
        }
      );

      console.log("LOGIN RESPONSE:", response.data);

      const token = response.data.access_token;
      const userId = response.data.user_id;
      const role = response.data.role;

      if (!token) {
        console.error("NO ACCESS TOKEN RECEIVED!");
        alert("Login failed: access token not received.");
        return;
      }

      // Save JWT token
      localStorage.setItem("access_token", token);

      // Save user ID
      if (userId) {
        localStorage.setItem(
          "user_id",
          String(userId)
        );
      }

      // Save user role
      if (role) {
        localStorage.setItem("role", role);
      }

      // Verify saved data
      console.log(
        "TOKEN SAVED:",
        localStorage.getItem("access_token")
      );

      console.log(
        "USER ID SAVED:",
        localStorage.getItem("user_id")
      );

      console.log(
        "ROLE SAVED:",
        localStorage.getItem("role")
      );

      window.dispatchEvent(
        new Event("storage")
      );

      alert("Login successful!");

      navigate("/labtests");

    } catch (error) {
      console.error("LOGIN ERROR:", error);

      if (error.response) {
        console.log(
          "BACKEND RESPONSE:",
          error.response.data
        );

        console.log(
          "STATUS:",
          error.response.status
        );
      }

      alert("Invalid email or password!");
    }
  };

  return (
    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-6">

          <h2 className="text-center mb-4">
            Login
          </h2>

          <form
            className="card p-4 shadow"
            onSubmit={handleSubmit}
          >

            {/* EMAIL */}

            <label className="mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              className="form-control mb-3"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            {/* PASSWORD */}

            <label className="mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              className="form-control mb-2"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            {/* FORGOT PASSWORD */}

            <div className="text-end mb-3">
              <Link to="/forgot-password">
                Forgot Password?
              </Link>
            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="btn btn-primary w-100"
            >
              Login
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Login;