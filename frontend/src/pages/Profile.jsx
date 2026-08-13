import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        alert("Please login first!");
        return;
      }

      const response = await axios.get(
        "http://127.0.0.1:8000/users/me",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log("PROFILE RESPONSE:", response.data);

      setProfile(response.data);

      setFormData({
        full_name: response.data.full_name,
        phone: response.data.phone || "",
      });

    } catch (error) {
      console.error("PROFILE ERROR:", error);

      if (error.response?.status === 401) {
        alert("Session expired. Please login again!");

        localStorage.removeItem("access_token");
        localStorage.removeItem("user_id");
      } else {
        alert("Failed to load profile");
      }

    } finally {
      setLoading(false);
    }
  };


  // EDIT PROFILE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        alert("Please login first!");
        return;
      }

      const response = await axios.put(
        "http://127.0.0.1:8000/users/me",
        {
          full_name: formData.full_name,
          phone: formData.phone,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("UPDATE PROFILE RESPONSE:", response.data);

      setProfile(response.data);

      setFormData({
        full_name: response.data.full_name,
        phone: response.data.phone || "",
      });

      setEditing(false);

      alert("Profile updated successfully!");

    } catch (error) {
      console.error("UPDATE PROFILE ERROR:", error);

      if (error.response?.status === 401) {
        alert("Session expired. Please login again!");

        localStorage.removeItem("access_token");
        localStorage.removeItem("user_id");

      } else {
        alert("Failed to update profile");
      }
    }
  };


  // PASSWORD INPUT
  const handlePasswordInput = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };


  // CHANGE PASSWORD
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (
      passwordData.new_password !==
      passwordData.confirm_password
    ) {
      alert("New password and confirm password do not match!");
      return;
    }

    if (passwordData.new_password.length < 6) {
      alert("New password must be at least 6 characters!");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        alert("Please login first!");
        return;
      }

      const response = await axios.put(
        "http://127.0.0.1:8000/users/change-password",
        {
          current_password:
            passwordData.current_password,

          new_password:
            passwordData.new_password,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        "CHANGE PASSWORD RESPONSE:",
        response.data
      );

      alert("Password changed successfully!");

      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });

      setChangingPassword(false);

    } catch (error) {
      console.error(
        "CHANGE PASSWORD ERROR:",
        error
      );

      if (error.response?.status === 401) {
        alert("Session expired. Please login again!");

        localStorage.removeItem("access_token");
        localStorage.removeItem("user_id");

      } else if (error.response?.status === 400) {
        alert(
          error.response.data.detail ||
          "Current password is incorrect"
        );

      } else {
        alert("Failed to change password");
      }
    }
  };


  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h3>Loading profile...</h3>
      </div>
    );
  }


  if (!profile) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning text-center">
          Profile not available.
        </div>
      </div>
    );
  }


  return (
    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-6">

          <h2 className="text-center mb-4">
            My Profile
          </h2>


          {/* VIEW PROFILE */}

          {!editing && !changingPassword && (

            <div className="card shadow p-4">

              <div className="mb-3">
                <strong>User ID</strong>

                <p className="form-control">
                  {profile.user_id}
                </p>
              </div>


              <div className="mb-3">
                <strong>Full Name</strong>

                <p className="form-control">
                  {profile.full_name}
                </p>
              </div>


              <div className="mb-3">
                <strong>Email</strong>

                <p className="form-control">
                  {profile.email}
                </p>
              </div>


              <div className="mb-3">
                <strong>Phone</strong>

                <p className="form-control">
                  {profile.phone || "Not provided"}
                </p>
              </div>


              <div className="mb-3">
                <strong>Role</strong>

                <p className="form-control">
                  {profile.role}
                </p>
              </div>


              <div className="d-flex gap-2">

                <button
                  className="btn btn-primary w-100"
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </button>


                <button
                  className="btn btn-warning w-100"
                  onClick={() =>
                    setChangingPassword(true)
                  }
                >
                  Change Password
                </button>

              </div>

            </div>

          )}


          {/* EDIT PROFILE */}

          {editing && (

            <form
              className="card shadow p-4"
              onSubmit={handleUpdate}
            >

              <div className="mb-3">

                <label className="form-label">
                  Full Name
                </label>

                <input
                  type="text"
                  name="full_name"
                  className="form-control"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="mb-3">

                <label className="form-label">
                  Email
                </label>

                <input
                  type="email"
                  className="form-control"
                  value={profile.email}
                  disabled
                />

              </div>


              <div className="mb-3">

                <label className="form-label">
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="mb-3">

                <label className="form-label">
                  Role
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={profile.role}
                  disabled
                />

              </div>


              <div className="d-flex gap-2">

                <button
                  type="submit"
                  className="btn btn-success w-100"
                >
                  Save Changes
                </button>


                <button
                  type="button"
                  className="btn btn-secondary w-100"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>

              </div>

            </form>

          )}


          {/* CHANGE PASSWORD */}

          {changingPassword && (

            <form
              className="card shadow p-4"
              onSubmit={handlePasswordChange}
            >

              <h4 className="text-center mb-4">
                Change Password
              </h4>


              <div className="mb-3">

                <label className="form-label">
                  Current Password
                </label>

                <input
                  type="password"
                  name="current_password"
                  className="form-control"
                  value={
                    passwordData.current_password
                  }
                  onChange={handlePasswordInput}
                  required
                />

              </div>


              <div className="mb-3">

                <label className="form-label">
                  New Password
                </label>

                <input
                  type="password"
                  name="new_password"
                  className="form-control"
                  value={
                    passwordData.new_password
                  }
                  onChange={handlePasswordInput}
                  required
                />

              </div>


              <div className="mb-3">

                <label className="form-label">
                  Confirm New Password
                </label>

                <input
                  type="password"
                  name="confirm_password"
                  className="form-control"
                  value={
                    passwordData.confirm_password
                  }
                  onChange={handlePasswordInput}
                  required
                />

              </div>


              <div className="d-flex gap-2">

                <button
                  type="submit"
                  className="btn btn-success w-100"
                >
                  Change Password
                </button>


                <button
                  type="button"
                  className="btn btn-secondary w-100"
                  onClick={() => {
                    setChangingPassword(false);

                    setPasswordData({
                      current_password: "",
                      new_password: "",
                      confirm_password: "",
                    });
                  }}
                >
                  Cancel
                </button>

              </div>

            </form>

          )}

        </div>

      </div>

    </div>
  );
}

export default Profile;