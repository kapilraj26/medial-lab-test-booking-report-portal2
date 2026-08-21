import { useEffect, useState } from "react";
import api from "../api/axios";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ==========================================
  // GET ALL USERS
  // ==========================================

  const getUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/users/");

      console.log("ALL USERS:", response.data);

      setUsers(response.data);

    } catch (error) {
      console.error("GET USERS ERROR:", error);

      if (error.response?.status === 403) {
        setError("Access denied. Admin access required.");
      } else if (error.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else {
        setError(
          error.response?.data?.detail ||
          "Failed to load users."
        );
      }

    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // LOAD USERS
  // ==========================================

  useEffect(() => {
    getUsers();
  }, []);


  // ==========================================
  // UPDATE USER ROLE
  // ==========================================

  const updateRole = async (userId, newRole) => {
    try {
      setMessage("");
      setError("");

      const response = await api.put(
        `/users/${userId}/role`,
        {
          role: newRole,
        }
      );

      console.log(
        "ROLE UPDATED:",
        response.data
      );

      setMessage(
        `User #${userId} role updated to ${newRole}`
      );

      // Refresh users
      getUsers();

    } catch (error) {
      console.error(
        "ROLE UPDATE ERROR:",
        error
      );

      setError(
        error.response?.data?.detail ||
        "Failed to update user role."
      );
    }
  };


  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="container mt-5">

      <h2 className="text-center mb-4">
        Admin User Management
      </h2>


      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}


      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}


      {loading ? (

        <div className="text-center">
          Loading users...
        </div>

      ) : users.length === 0 ? (

        <div className="alert alert-info text-center">
          No users found.
        </div>

      ) : (

        <div className="table-responsive">

          <table className="table table-bordered table-striped">

            <thead className="table-dark">

              <tr>

                <th>User ID</th>

                <th>Full Name</th>

                <th>Email</th>

                <th>Phone</th>

                <th>Current Role</th>

                <th>Change Role</th>

              </tr>

            </thead>


            <tbody>

              {users.map((user) => (

                <tr key={user.user_id}>

                  <td>
                    {user.user_id}
                  </td>

                  <td>
                    {user.full_name}
                  </td>

                  <td>
                    {user.email}
                  </td>

                  <td>
                    {user.phone}
                  </td>

                  <td>
                    <strong>
                      {user.role}
                    </strong>
                  </td>

                  <td>

                    <select
                      className="form-select"
                      value={user.role}
                      onChange={(e) =>
                        updateRole(
                          user.user_id,
                          e.target.value
                        )
                      }
                    >

                      <option value="Patient">
                        Patient
                      </option>

                      <option value="Staff">
                        Staff
                      </option>

                      <option value="Admin">
                        Admin
                      </option>

                    </select>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}

export default AdminUsers;