import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
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
      const response = await api.post(
        "/users/",
        {
          full_name: formData.full_name,
          email: formData.email.trim(),
          password: formData.password,
          phone: formData.phone,
        }
      );

      console.log(
        "REGISTER RESPONSE:",
        response.data
      );

      alert("Patient registration successful!");

      navigate("/login");

    } catch (error) {
      console.error(
        "REGISTER ERROR:",
        error
      );

      if (error.response) {
        console.log(
          "SERVER RESPONSE:",
          error.response.data
        );

        alert(
          error.response.data.detail ||
          "Registration failed!"
        );
      } else {
        alert(
          "Unable to connect to backend"
        );
      }
    }
  };

  return (
    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-6">

          <h2 className="text-center mb-4">
            Patient Registration
          </h2>

          <form
            className="card p-4 shadow"
            onSubmit={handleSubmit}
          >

            {/* FULL NAME */}

            <label className="mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="full_name"
              className="form-control mb-3"
              placeholder="Enter full name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />

            {/* EMAIL */}

            <label className="mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              className="form-control mb-3"
              placeholder="Enter email"
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
              className="form-control mb-3"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            {/* PHONE */}

            <label className="mb-2">
              Phone
            </label>

            <input
              type="text"
              name="phone"
              className="form-control mb-3"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
            />

            {/* ROLE */}

            <div className="alert alert-info">
              Account Type: <strong>Patient</strong>
            </div>

            {/* REGISTER */}

            <button
              type="submit"
              className="btn btn-success w-100"
            >
              Register as Patient
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Register;