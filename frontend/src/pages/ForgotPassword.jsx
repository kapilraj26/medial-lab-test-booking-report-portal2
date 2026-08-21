import { useState } from "react";
import api from "../api/axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [loading, setLoading] = useState(false);

  const [resetData, setResetData] = useState({
    new_password: "",
    confirm_password: "",
  });

  const [showReset, setShowReset] = useState(false);


  // =========================
  // GENERATE RESET TOKEN
  // =========================

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post(
        "/users/forgot-password",
        {
          email: email.trim(),
        }
      );

      console.log(
        "FORGOT PASSWORD RESPONSE:",
        response.data
      );

      setResetToken(
        response.data.reset_token
      );

      setShowReset(true);

      alert(
        "Reset token generated successfully!"
      );

    } catch (error) {
      console.error(
        "FORGOT PASSWORD ERROR:",
        error
      );

      if (error.response) {
        console.log(
          "SERVER RESPONSE:",
          error.response.data
        );

        alert(
          error.response.data.detail ||
          "User not found"
        );
      } else {
        alert(
          "Unable to connect to backend"
        );
      }

    } finally {
      setLoading(false);
    }
  };


  // =========================
  // RESET PASSWORD INPUT
  // =========================

  const handleResetInput = (e) => {
    setResetData({
      ...resetData,
      [e.target.name]: e.target.value,
    });
  };


  // =========================
  // RESET PASSWORD
  // =========================

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (
      resetData.new_password !==
      resetData.confirm_password
    ) {
      alert(
        "New password and confirm password do not match!"
      );

      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/users/reset-password",
        {
          reset_token: resetToken,
          new_password: resetData.new_password,
        }
      );

      console.log(
        "RESET PASSWORD RESPONSE:",
        response.data
      );

      alert(
        "Password reset successfully!"
      );

      setEmail("");
      setResetToken("");

      setResetData({
        new_password: "",
        confirm_password: "",
      });

      setShowReset(false);

    } catch (error) {
      console.error(
        "RESET PASSWORD ERROR:",
        error
      );

      if (error.response) {
        console.log(
          "SERVER RESPONSE:",
          error.response.data
        );

        alert(
          error.response.data.detail ||
          "Password reset failed"
        );
      } else {
        alert(
          "Unable to connect to backend"
        );
      }

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-6">

          <h2 className="text-center mb-4">
            Forgot Password
          </h2>


          {!showReset ? (

            <form
              className="card shadow p-4"
              onSubmit={handleForgotPassword}
            >

              <label className="form-label">
                Registered Email
              </label>

              <input
                type="email"
                className="form-control mb-3"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your email"
                required
              />

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading
                  ? "Generating..."
                  : "Generate Reset Token"}
              </button>

            </form>

          ) : (

            <form
              className="card shadow p-4"
              onSubmit={handleResetPassword}
            >

              <div className="alert alert-info">
                Reset token generated successfully.
              </div>

              <label className="form-label">
                Reset Token
              </label>

              <textarea
                className="form-control mb-3"
                value={resetToken}
                readOnly
                rows="3"
              />

              <label className="form-label">
                New Password
              </label>

              <input
                type="password"
                name="new_password"
                className="form-control mb-3"
                value={
                  resetData.new_password
                }
                onChange={handleResetInput}
                required
              />

              <label className="form-label">
                Confirm New Password
              </label>

              <input
                type="password"
                name="confirm_password"
                className="form-control mb-3"
                value={
                  resetData.confirm_password
                }
                onChange={handleResetInput}
                required
              />

              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={loading}
              >
                {loading
                  ? "Resetting..."
                  : "Reset Password"}
              </button>

            </form>

          )}

        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;