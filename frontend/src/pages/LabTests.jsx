import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function LabTests() {
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getTests();
  }, []);

  const getTests = async () => {
    try {
      const response = await api.get(
        "/labtests/"
      );

      console.log(
        "LAB TESTS RESPONSE:",
        response.data
      );

      setTests(response.data);

    } catch (error) {
      console.error(
        "LAB TESTS ERROR:",
        error
      );

      if (error.response?.status === 401) {
        alert(
          "Session expired. Please login again!"
        );

        localStorage.removeItem(
          "access_token"
        );

        localStorage.removeItem(
          "user_id"
        );

        navigate("/login");

      } else {
        alert(
          "Failed to load lab tests"
        );
      }
    }
  };

  return (
    <div className="container mt-5">

      <h2 className="text-center mb-4">
        Available Lab Tests
      </h2>

      <div className="row">

        {tests.map((test) => (

          <div
            className="col-md-4 mb-4"
            key={test.test_id}
          >

            <div className="card shadow h-100">

              <div className="card-body">

                <h5 className="card-title">
                  {test.test_name}
                </h5>

                <p className="card-text">
                  Price: ₹{test.price}
                </p>

                <button
                  className="btn btn-primary"
                  onClick={() =>
                    navigate(
                      "/booking",
                      {
                        state: {
                          test: test
                        }
                      }
                    )
                  }
                >
                  Book Test
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default LabTests;