import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoriesTable from '../dashboards/CategoriesTable';
import ProductsTable from '../dashboards/ProductsTable';
import RequestsTable from '../dashboards/RequestsTable';
import StockMovementsTable from '../dashboards/StockMovementsTable';
import ReplenishmentsTable from '../dashboards/ReplenishmentsTable';
import 'bootstrap/dist/css/bootstrap.min.css';

function ManagerHome() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/ManagerLogin');
  };

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || user.role !== 'Warehouse Manager') {
      navigate('/ManagerLogin');
    }
  }, [navigate, user]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2>Welcome, {user?.userName || 'Manager'}!</h2>
          <p className="text-muted">You are logged in as: {user?.role || 'Manager'}</p>
        </div>
        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
      </div>
      
      {/* Tabs Navigation */}
      <ul className="nav nav-tabs mb-3">
        {['products', 'categories', 'requests', 'stock', 'replenishments'].map((tab) => (
          <li className="nav-item" key={tab}>
            <button 
              className={`nav-link ${activeTab === tab ? 'active' : ''}`} 
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      {/* Content Based on Active Tab */}
      <div className="card p-3">
        {activeTab === 'products' && <ProductsTable />}
        {activeTab === 'categories' && <CategoriesTable />}
        {activeTab === 'requests' && <RequestsTable />}
        {activeTab === 'stock' && <StockMovementsTable />}
        {activeTab === 'replenishments' && <ReplenishmentsTable />}
      </div>
    </div>
  );
}

export default ManagerHome;
