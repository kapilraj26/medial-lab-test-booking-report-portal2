import { useEffect, useState } from "react";
import api from "../api/axios";

function StaffReports() {

  const [bookings, setBookings] = useState([]);

  const [formData, setFormData] = useState({
    booking_id: "",
    report_file: "",
    result: "",
    report_date: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  // ==========================================
  // GET ALL BOOKINGS
  // ==========================================

  useEffect(() => {

    const getBookings = async () => {

      try {

        const response = await api.get(
          "/bookings/all"
        );

        console.log(
          "STAFF BOOKINGS:",
          response.data
        );

        setBookings(response.data);

      } catch (error) {

        console.error(
          "BOOKINGS ERROR:",
          error
        );

        if (
          error.response?.status === 401
        ) {

          setError(
            "Session expired. Please login again."
          );

          localStorage.removeItem(
            "access_token"
          );

          localStorage.removeItem(
            "user_id"
          );

        } else if (
          error.response?.status === 403
        ) {

          setError(
            "Access denied. Staff or Admin access required."
          );

        } else {

          setError(
            error.response?.data?.detail ||
            "Failed to load bookings."
          );

        }

      } finally {

        setLoadingBookings(false);

      }

    };

    getBookings();

  }, []);


  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };


  // ==========================================
  // UPLOAD REPORT
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    setMessage("");
    setError("");


    try {

      const response = await api.post(
        "/reports/",
        {
          booking_id: Number(
            formData.booking_id
          ),

          report_file:
            formData.report_file,

          result:
            formData.result,

          report_date:
            formData.report_date,
        }
      );


      console.log(
        "REPORT CREATED:",
        response.data
      );


      setMessage(
        "Report uploaded successfully!"
      );


      setFormData({
        booking_id: "",
        report_file: "",
        result: "",
        report_date: "",
      });


    } catch (error) {

      console.error(
        "REPORT ERROR:",
        error
      );


      if (
        error.response?.status === 401
      ) {

        setError(
          "Session expired. Please login again."
        );

        localStorage.removeItem(
          "access_token"
        );

        localStorage.removeItem(
          "user_id"
        );

      } else if (
        error.response?.status === 403
      ) {

        setError(
          "Access denied. Staff or Admin access required."
        );

      } else {

        setError(
          error.response?.data?.detail ||
          "Failed to upload report."
        );

      }

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-7">

          <h2 className="text-center mb-4">
            Upload Medical Report
          </h2>


          {/* SUCCESS MESSAGE */}

          {message && (

            <div className="alert alert-success">

              {message}

            </div>

          )}


          {/* ERROR MESSAGE */}

          {error && (

            <div className="alert alert-danger">

              {error}

            </div>

          )}


          {/* LOADING BOOKINGS */}

          {loadingBookings ? (

            <div className="alert alert-info text-center">

              Loading bookings...

            </div>

          ) : (

            <form
              className="card shadow p-4"
              onSubmit={handleSubmit}
            >


              {/* BOOKING */}

              <div className="mb-3">

                <label className="form-label">

                  Select Booking

                </label>


                <select
                  name="booking_id"
                  className="form-select"
                  value={formData.booking_id}
                  onChange={handleChange}
                  required
                >

                  <option value="">

                    Select Booking ID

                  </option>


                  {bookings.map((booking) => (

                    <option
                      key={booking.booking_id}
                      value={booking.booking_id}
                    >

                      Booking #{booking.booking_id}
                      {" - "}
                      User #{booking.user_id}
                      {" - "}
                      Test #{booking.test_id}
                      {" - "}
                      {booking.status}

                    </option>

                  ))}

                </select>

              </div>


              {/* REPORT FILE */}

              <div className="mb-3">

                <label className="form-label">

                  Report File

                </label>


                <input
                  type="text"
                  name="report_file"
                  className="form-control"
                  placeholder="report_16.pdf"
                  value={formData.report_file}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* RESULT */}

              <div className="mb-3">

                <label className="form-label">

                  Result

                </label>


                <textarea
                  name="result"
                  className="form-control"
                  rows="4"
                  placeholder="Enter medical test result"
                  value={formData.result}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* REPORT DATE */}

              <div className="mb-3">

                <label className="form-label">

                  Report Date

                </label>


                <input
                  type="date"
                  name="report_date"
                  className="form-control"
                  value={formData.report_date}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* SUBMIT */}

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >

                {loading
                  ? "Uploading..."
                  : "Upload Report"}

              </button>


            </form>

          )}

        </div>

      </div>

    </div>

  );

}

export default StaffReports;