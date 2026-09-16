import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function AdminUsers() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ==========================================
  // GET ALL USERS
  // ==========================================

  const getUsers = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await api.get(
        "/users/"
      );

      console.log(
        "ADMIN USERS:",
        response.data
      );

      setUsers(response.data);

    } catch (error) {

      console.error(
        "USERS ERROR:",
        error
      );

      if (
        error.response?.status === 401
      ) {

        alert(
          "Session expired. Please login again."
        );

        localStorage.removeItem(
          "access_token"
        );

        localStorage.removeItem(
          "user_id"
        );

        localStorage.removeItem(
          "role"
        );

        navigate("/login");

      } else if (
        error.response?.status === 403
      ) {

        setError(
          "Access denied. Admin access required."
        );

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
  // CHANGE ROLE
  // ==========================================

  const changeRole = async (
    userId,
    newRole
  ) => {

    try {

      const response = await api.put(
        `/users/${userId}/role`,
        {
          role: newRole
        }
      );

      console.log(
        "ROLE UPDATED:",
        response.data
      );

      alert(
        "User role updated successfully!"
      );

      // Refresh users
      getUsers();

    } catch (error) {

      console.error(
        "ROLE UPDATE ERROR:",
        error
      );

      if (
        error.response?.status === 401
      ) {

        alert(
          "Session expired. Please login again."
        );

        localStorage.removeItem(
          "access_token"
        );

        localStorage.removeItem(
          "user_id"
        );

        localStorage.removeItem(
          "role"
        );

        navigate("/login");

      } else {

        alert(
          error.response?.data?.detail ||
          "Failed to update role."
        );

      }

    }

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="container mt-5">

        <div className="alert alert-info text-center">

          Loading users...

        </div>

      </div>

    );

  }


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="container mt-5">

      <h2 className="text-center mb-4">
        Admin - User Management
      </h2>


      {/* ERROR */}

      {error && (

        <div className="alert alert-danger text-center">

          {error}

        </div>

      )}


      {/* USERS TABLE */}

      {!error && (

        <div className="table-responsive">

          <table className="table table-bordered table-striped">

            <thead className="table-primary">

              <tr>

                <th>
                  User ID
                </th>

                <th>
                  Full Name
                </th>

                <th>
                  Email
                </th>

                <th>
                  Phone
                </th>

                <th>
                  Current Role
                </th>

                <th>
                  Change Role
                </th>

              </tr>

            </thead>


            <tbody>

              {users.map((user) => (

                <tr
                  key={user.user_id}
                >

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

                    <span
                      className={
                        user.role === "Admin"
                          ? "badge bg-danger"
                          : user.role === "Staff"
                          ? "badge bg-warning text-dark"
                          : "badge bg-primary"
                      }
                    >

                      {user.role}

                    </span>

                  </td>


                  <td>

                    <select
                      className="form-select"
                      value={user.role}
                      onChange={(e) =>
                        changeRole(
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