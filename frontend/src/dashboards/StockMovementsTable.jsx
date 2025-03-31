import React, { useState, useEffect } from 'react';

function StockMovementsTable() {
  const [stockMovements, setStockMovements] = useState([]);
  const [formData, setFormData] = useState({ ProductID: '', QuantityMoved: '', MovementType: 'Allocated' });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  useEffect(() => {
    fetchStockMovements();
  }, []);

  const fetchStockMovements = async () => {
    const response = await fetch('http://localhost:5000/api/stock-movements');
    const data = await response.json();
    setStockMovements(data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId
      ? `http://localhost:5000/api/stock-movements/${editingId}`
      : 'http://localhost:5000/api/stock-movements';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    setFormData({ ProductID: '', QuantityMoved: '', MovementType: 'Allocated' });
    setEditingId(null);
    fetchStockMovements();
  };

  const handleEdit = (mov) => {
    setFormData({ ProductID: mov.ProductID, QuantityMoved: mov.QuantityMoved, MovementType: mov.MovementType });
    setEditingId(mov.MovementID);
  };

  const filteredMovements = stockMovements.filter(({ ProductID }) =>
    ProductID.toString().includes(search)
  );

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Stock Movements</h3>
      <form className="mb-3 d-flex gap-2" onSubmit={handleSubmit}>
        <input
          type="number"
          name="ProductID"
          className="form-control"
          value={formData.ProductID}
          onChange={handleChange}
          placeholder="Product ID"
          required
        />
        <input
          type="number"
          name="QuantityMoved"
          className="form-control"
          value={formData.QuantityMoved}
          onChange={handleChange}
          placeholder="Quantity"
          required
        />
        <select
          name="MovementType"
          className="form-select"
          value={formData.MovementType}
          onChange={handleChange}
        >
          <option value="Allocated">Allocated</option>
          <option value="Replenished">Replenished</option>
        </select>
        <button type="submit" className="btn btn-primary">
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by Product ID"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      
      <ul className="list-group">
        {filteredMovements.map((mov) => (
          <li key={mov.MovementID} className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              <strong>Product {mov.ProductID}</strong> - {mov.QuantityMoved} units ({mov.MovementType})
            </span>
            <button className="btn btn-sm btn-warning" onClick={() => handleEdit(mov)}>
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StockMovementsTable;
