import React, { useState, useEffect } from 'react';

function ReplenishmentsTable() {
  const [replenishments, setReplenishments] = useState([]);
  const [newRep, setNewRep] = useState({ ProductID: '', QuantityAdded: '' });
  const [editingId, setEditingId] = useState(null);
  const [editRep, setEditRep] = useState({ ProductID: '', QuantityAdded: '' });
  const [search, setSearch] = useState("");
  // Fetch data from backend
  useEffect(() => {
    fetch('http://localhost:5000/api/replenishments')
      .then(res => res.json())
      .then(data => setReplenishments(data))
      .catch(err => console.error(err));
  }, []);

  // Add a new replenishment
  const handleAdd = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/replenishments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRep),
    })
      .then(res => res.json())
      .then(data => {
        setReplenishments([...replenishments, data]);
        setNewRep({ ProductID: '', QuantityAdded: '' });
      })
      .catch(err => console.error(err));
  };

  // Start editing a replenishment
  const handleEdit = (id) => {
    setEditingId(id);
    const rep = replenishments.find(r => r.ReplenishmentID === id);
    setEditRep({ ProductID: rep.ProductID, QuantityAdded: rep.QuantityAdded });
  };

  // Update a replenishment
  const handleUpdate = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/api/replenishments/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editRep),
    })
      .then(res => res.json())
      .then(updatedRep => {
        setReplenishments(
          replenishments.map(r =>
            r.ReplenishmentID === editingId ? updatedRep : r
          )
        );
        setEditingId(null);
      })
      .catch(err => console.error(err));
  };

  const filteredReplenishments = replenishments.filter(({ ProductID }) =>
    ProductID.toString().includes(search)
  );

  return (
    <div className="container mt-4">
      <h4>Add Replenishment</h4>
      <form className="mb-3 d-flex gap-2" onSubmit={handleAdd}>
        <input
          type="number"
          className="form-control"
          placeholder="Product ID"
          value={newRep.ProductID}
          onChange={(e) => setNewRep({ ...newRep, ProductID: e.target.value })}
          required
        />
        <input
          type="number"
          className="form-control"
          placeholder="Quantity Added"
          value={newRep.QuantityAdded}
          onChange={(e) => setNewRep({ ...newRep, QuantityAdded: e.target.value })}
          required
        />
        <button type="submit" className="btn btn-primary">Add</button>
      </form>
      <h3 className="mb-3">Replenishments</h3>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by Product ID"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul className="list-group mb-3">
        {filteredReplenishments.map(rep => (
          <li key={rep.ReplenishmentID} className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              <strong>Product {rep.ProductID}</strong> - {rep.QuantityAdded} units replenished
            </span>
            <button className="btn btn-sm btn-warning" onClick={() => handleEdit(rep.ReplenishmentID)}>
              Edit
            </button>
          </li>
        ))}
      </ul>
      
      
      
      {editingId && (
        <div>
          <h4>Edit Replenishment</h4>
          <form className="d-flex gap-2" onSubmit={handleUpdate}>
            <input
              type="number"
              className="form-control"
              placeholder="Product ID"
              value={editRep.ProductID}
              onChange={(e) => setEditRep({ ...editRep, ProductID: e.target.value })}
              required
            />
            <input
              type="number"
              className="form-control"
              placeholder="Quantity Added"
              value={editRep.QuantityAdded}
              onChange={(e) => setEditRep({ ...editRep, QuantityAdded: e.target.value })}
              required
            />
            <button type="submit" className="btn btn-success">Update</button>
            <button type="button" className="btn btn-secondary" onClick={() => setEditingId(null)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};


export default ReplenishmentsTable;
