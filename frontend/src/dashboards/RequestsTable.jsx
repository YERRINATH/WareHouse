import React, { useState, useEffect } from "react";

function RequestsTable() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/requests")
      .then((res) => res.json())
      .then((data) => {
        console.log("Response:", data);
        setRequests(data);
      })
      .catch((err) => console.error("Error fetching requests:", err));
  }, []);

  const handleEdit = (id, updatedStatus) => {
    fetch(`http://localhost:5000/api/requests/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Status: updatedStatus }),
    })
      .then(() =>
        setRequests((prev) =>
          prev.map((req) =>
            req.RequestID === id ? { ...req, Status: updatedStatus } : req
          )
        )
      )
      .catch((err) => console.error("Error updating request:", err));
  };

  const filteredRequests = requests.filter(({ ProductID }) =>
    ProductID.toString().includes(search)
  );

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Requests</h3>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by Product ID"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul className="list-group">
        {filteredRequests.map(({ RequestID, ProductID, ProductName, QuantityRequested, Status }) => (
          <li key={RequestID} className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              <strong>{ProductName} (ID: {ProductID})</strong> - {QuantityRequested} units
            </span>
            <select
              className="form-select w-auto"
              value={Status}
              onChange={(e) => handleEdit(RequestID, e.target.value)}
            >
              {["Pending", "Fulfilled", "Partially Fulfilled", "Rejected"].map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RequestsTable;