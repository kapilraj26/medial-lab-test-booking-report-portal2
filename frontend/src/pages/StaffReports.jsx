import { useEffect, useState } from "react";
import axios from "axios";
import api from "../api/axios";

function StaffReports() {
  const [bookings, setBookings] = useState([]);

  const [formData, setFormData] = useState({
    booking_id: "",
    result: "",
    report_date: "",
  });

  const [reportFile, setReportFile] = useState(null);

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
        const response = await api.get("/bookings/all");

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

        if (error.response?.status === 401) {
          setError(
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

        } else if (error.response?.status === 403) {
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
  // HANDLE PDF FILE
  // ==========================================

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setReportFile(null);
      return;
    }

    if (file.type !== "application/pdf") {
      setError(
        "Only PDF files are allowed."
      );

      setReportFile(null);

      e.target.value = "";

      return;
    }

    setError("");
    setReportFile(file);
  };

  // ==========================================
  // UPLOAD REPORT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    // Check booking
    if (!formData.booking_id) {
      setError(
        "Please select a booking."
      );

      setLoading(false);
      return;
    }

    // Check result
    if (!formData.result.trim()) {
      setError(
        "Please enter the test result."
      );

      setLoading(false);
      return;
    }

    // Check date
    if (!formData.report_date) {
      setError(
        "Please select report date."
      );

      setLoading(false);
      return;
    }

    // Check PDF
    if (!reportFile) {
      setError(
        "Please select a PDF file."
      );

      setLoading(false);
      return;
    }

    try {

      // ========================================
      // CREATE FORMDATA
      // ========================================

      const data = new FormData();

      data.append(
        "booking_id",
        formData.booking_id
      );

      data.append(
        "result",
        formData.result
      );

      data.append(
        "report_date",
        formData.report_date
      );

      data.append(
        "report_file",
        reportFile
      );


      // ========================================
      // DEBUG
      // ========================================

      console.log(
        "BOOKING ID:",
        formData.booking_id
      );

      console.log(
        "RESULT:",
        formData.result
      );

      console.log(
        "REPORT DATE:",
        formData.report_date
      );

      console.log(
        "REPORT FILE:",
        reportFile
      );


      // ========================================
      // CHECK FORMDATA
      // ========================================

      for (const pair of data.entries()) {
        console.log(
          "FORM DATA:",
          pair[0],
          pair[1]
        );
      }


      // ========================================
      // UPLOAD PDF
      // ========================================

      const response = await axios.post(
        "http://127.0.0.1:8000/reports/",
        data,
        {
          headers: {
            Authorization:
              "Bearer " +
              localStorage.getItem(
                "access_token"
              ),
          },
        }
      );


      // ========================================
      // SUCCESS
      // ========================================

      console.log(
        "REPORT CREATED:",
        response.data
      );

      setMessage(
        "Report uploaded successfully!"
      );


      // ========================================
      // RESET FORM
      // ========================================

      setFormData({
        booking_id: "",
        result: "",
        report_date: "",
      });

      setReportFile(null);

      const fileInput =
        document.getElementById(
          "report_file"
        );

      if (fileInput) {
        fileInput.value = "";
      }


    } catch (error) {

      console.error(
        "REPORT ERROR:",
        error
      );

      console.log(
        "STATUS:",
        error.response?.status
      );

      console.log(
        "SERVER RESPONSE:",
        error.response?.data
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

        localStorage.removeItem(
          "role"
        );

      } else if (
        error.response?.status === 403
      ) {

        setError(
          "Access denied. Staff or Admin access required."
        );

      } else if (
        error.response?.status === 422
      ) {

        setError(
          "Invalid report data. Please check all fields."
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


  // ==========================================
  // UI
  // ==========================================

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


              {/* ================================= */}
              {/* BOOKING */}
              {/* ================================= */}

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


              {/* ================================= */}
              {/* PDF FILE */}
              {/* ================================= */}

              <div className="mb-3">

                <label className="form-label">
                  Report PDF
                </label>

                <input
                  id="report_file"
                  type="file"
                  name="report_file"
                  className="form-control"
                  accept="application/pdf,.pdf"
                  onChange={handleFileChange}
                  required
                />

                <small className="text-muted">
                  Only PDF files are allowed.
                </small>

              </div>


              {/* ================================= */}
              {/* RESULT */}
              {/* ================================= */}

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


              {/* ================================= */}
              {/* REPORT DATE */}
              {/* ================================= */}

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


              {/* ================================= */}
              {/* SUBMIT */}
              {/* ================================= */}

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