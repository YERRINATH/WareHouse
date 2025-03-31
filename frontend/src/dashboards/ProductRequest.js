import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RequestsTable() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate('/');
      return;
    }
    const userObj = JSON.parse(storedUser);
    setUser(userObj);

    fetch("http://localhost:5000/api/requests")
      .then((res) => res.json())
      .then(setRequests)
      .catch((err) => console.error("Error fetching requests:", err));
  }, [navigate]);

  const filteredRequests = requests.filter(({ ProductID, ProductName, UserID }) => {
    const searchLower = search.toLowerCase();
    return (
      (ProductID.toString().includes(search) ||
       (ProductName && ProductName.toLowerCase().includes(searchLower))) &&
      UserID === user?.id
    );
  });

  return (
    <div className="container mt-4">
      <h2>Welcome, {user?.userName || "Guest"}</h2>
      <h3 className="mb-3">Your Requests</h3>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by Product ID or Name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul className="list-group">
        {filteredRequests.length > 0 ? (
          filteredRequests.map(({ RequestID, ProductID, ProductName, QuantityRequested, Status }) => (
            <li key={RequestID} className="list-group-item d-flex justify-content-between align-items-center">
              <span>
                <strong>{ProductName} (ID: {ProductID})</strong> - {QuantityRequested} units
              </span>
              <span className={`badge ${Status === "Fulfilled" ? "bg-success" : "bg-secondary"}`}>
                {Status}
              </span>
            </li>
          ))
        ) : (
          <li className="list-group-item text-center">No requests found.</li>
        )}
      </ul>
    </div>
  );
}

export default RequestsTable;
