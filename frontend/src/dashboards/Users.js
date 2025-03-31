import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [formData, setFormData] = useState({ UserName: "", Email: "", PasswordHash: "", Role: "User" });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user.UserID);
    setFormData({ ...user, PasswordHash: "" });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/users/${id}`);
      setUsers(users.filter(user => user.UserID !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/users/${editingUser}`, formData);
      setUsers(users.map(user => user.UserID === editingUser ? { ...user, ...formData } : user));
      setEditingUser(null);
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  const handleInsert = async () => {
    try {
      await axios.post("http://localhost:5000/users", formData);
      
      // Refetch users after insert
      axios.get("http://localhost:5000/users")
        .then((res) => setUsers(res.data))
        .catch((err) => console.error("Error fetching users:", err));
  
      // Reset form
      setFormData({ UserName: "", Email: "", PasswordHash: "", Role: "User" });
      setShowAddUser(false);
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };
  

  return (
    <div className="container mt-4">
      <h2>User List</h2>
      <button onClick={() => setShowAddUser(!showAddUser)} className="btn btn-primary mb-3">
        {showAddUser ? "Cancel" : "Add User"}
      </button>
      {showAddUser && (
        <div className="p-3 border rounded">
          <h3>Add New User</h3>
          <input name="UserName" placeholder="User Name" value={formData.UserName} onChange={handleChange} className="form-control mb-2" />
          <input name="Email" placeholder="Email" value={formData.Email} onChange={handleChange} className="form-control mb-2" />
          <input name="PasswordHash" type="password" placeholder="Password" value={formData.PasswordHash} onChange={handleChange} className="form-control mb-2" />
          <select name="Role" value={formData.Role} onChange={handleChange} className="form-control mb-2">
            <option value="Admin">Admin</option>
            <option value="Warehouse Manager">Warehouse Manager</option>
            <option value="User">User</option>
          </select>
          <button onClick={handleInsert} className="btn btn-success">Add User</button>
        </div>
      )}
      {["Admin", "Warehouse Manager", "User"].map(role => (
        <div key={role} className="mt-4">
          <h3>{role}</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>UserID</th>
                <th>UserName</th>
                <th>Email</th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.filter(user => user.Role === role).map((user) => (
                <tr key={user.UserID}>
                  {editingUser === user.UserID ? (
                    <>
                      <td>{user.UserID}</td>
                      <td><input name="UserName" value={formData.UserName} onChange={handleChange} className="form-control" /></td>
                      <td><input name="Email" value={formData.Email} onChange={handleChange} className="form-control" /></td>
                      <td><input name="PasswordHash" type="password" placeholder="Enter new password" onChange={handleChange} className="form-control" /></td>
                      <td>
                        <button onClick={handleUpdate} className="btn btn-success btn-sm">Save</button>
                        <button onClick={() => setEditingUser(null)} className="btn btn-secondary btn-sm">Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{user.UserID}</td>
                      <td>{user.UserName}</td>
                      <td>{user.Email}</td>
                      <td>******</td>
                      <td>
                        <button onClick={() => handleEdit(user)} className="btn btn-primary btn-sm">Edit</button>
                        <button onClick={() => handleDelete(user.UserID)} className="btn btn-danger btn-sm">Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default UsersTable;