import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
        "http://127.0.0.1:8000/users/login",
        {
          email: formData.email.trim(),
          password: formData.password,
        }
      );

      console.log("LOGIN RESPONSE:", response.data);

      localStorage.setItem(
        "access_token",
        response.data.access_token
      );

      if (response.data.user_id) {
        localStorage.setItem(
          "user_id",
          response.data.user_id
        );
      }

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

            <label className="mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              className="form-control mb-3"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />

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