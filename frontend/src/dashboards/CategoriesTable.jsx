import React, { useState, useEffect } from 'react';

function CategoriesTable({ onUpdate }) {
  const [categories, setCategories] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    fetch('http://localhost:5000/api/categories')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const handleEdit = (index, name) => {
    setEditIndex(index);
    setNewCategoryName(name);
  };

  const handleSave = (id) => {
    fetch(`http://localhost:5000/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ CategoryName: newCategoryName })
    })
      .then(response => response.json())
      .then(() => {
        setCategories(categories.map(cat => (cat.CategoryID === id ? { ...cat, CategoryName: newCategoryName } : cat)));
        setEditIndex(null);
      })
      .catch(error => console.error('Error updating category:', error));
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    fetch('http://localhost:5000/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ CategoryName: newCategory })
    })
      .then(response => response.json())
      .then(data => {
        setCategories([...categories, data]);
        setNewCategory("");
      })
      .catch(error => console.error('Error adding category:', error));
  };


  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4 border-0 rounded-4">
        <h3 className="text-center text-primary fw-bold mb-4">Manage Categories</h3>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control border-primary shadow-sm"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter new category"
          />
          <button className="btn btn-primary" onClick={handleAddCategory}>Add</button>
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-hover text-center align-middle">
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>Category Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, index) => (
                <tr key={cat.CategoryID}>
                  <td>{index + 1}</td>
                  <td>
                    {editIndex === index ? (
                      <input
                        type="text"
                        className="form-control"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                      />
                    ) : (
                      cat.CategoryName
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <button className="btn btn-success btn-sm me-2" onClick={() => handleSave(cat.CategoryID)}>Save</button>
                    ) : (
                      <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(index, cat.CategoryName)}>Edit</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CategoriesTable;
