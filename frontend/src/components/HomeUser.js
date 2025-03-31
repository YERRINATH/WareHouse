import React, { useEffect, useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function UserHome() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [quantityRequested, setQuantityRequested] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!user?.userName) {
      navigate('/');
    }
  }, [user, navigate]);
  
  
  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(response => {
        setProducts(response.data);
        setFilteredProducts(response.data);
        const uniqueCategories = ['All', ...new Set(response.data.map(p => p.CategoryNames))];
        setCategories(uniqueCategories);
        toast.success('Products loaded successfully!');
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        toast.error('Failed to fetch products.');
      });
  }, []);

  useEffect(() => {
    let filtered = products;
    if (category !== 'All') {
      filtered = filtered.filter(product => product.CategoryNames === category);
    }
    if (searchTerm) {
      filtered = filtered.filter(product => product.ProductName.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredProducts(filtered);
  }, [searchTerm, category, products]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.info('Logged out successfully!');
    navigate('/');
  };

  const handleRequestSubmit = (productID) => {
    if (!quantityRequested[productID] || quantityRequested[productID] <= 0) {
      toast.warn('Please enter a valid quantity.');
      return;
    }
  
    const requestData = {
      UserID: user?.id,
      ProductID: productID,
      QuantityRequested: parseInt(quantityRequested[productID]),
    };
  
    axios.post('http://localhost:5000/api/requests', requestData)
      .then(() => {
        toast.success('Request submitted successfully!');
        setQuantityRequested((prev) => ({ ...prev, [productID]: '' }));
  
        // Fetch updated products
        axios.get('http://localhost:5000/api/products')
          .then(response => {
            setProducts(response.data);
          })
          .catch(error => {
            console.error('Error fetching updated products:', error);
          });
      })
      .catch(error => {
        console.error('Error submitting request:', error.response?.data || error);
        toast.error('Failed to submit request.');
      });
  };
  

  const handleQuantityChange = (productID, value) => {
    setQuantityRequested((prev) => ({ ...prev, [productID]: value }));
  };

  return (
    <div className="container mt-4">
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-3">
  <h2>Welcome, {user?.userName || 'User'}!</h2>
  <div>
    <button className="btn btn-secondary me-2" onClick={() => navigate('/userrequest')}>
    product requests
    </button>
    <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
  </div>
</div>

      
      <div className="mb-3 d-flex gap-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by product name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      
      <h3>Products</h3>
      <div className="row">
        {filteredProducts.map((product) => (
          <div className="col-md-4 mb-4" key={product.ProductID}>
            <div className="card h-100">
              {product.ImageURL ? (
                <img src={product.ImageURL} className="card-img-top" alt={product.ProductName} />
              ) : (
                <div className="card-img-top bg-light text-center p-5">No Image</div>
              )}
              <div className="card-body">
                <h5 className="card-title">{product.ProductName}</h5>
                <p className="card-text">Categories: {product.CategoryNames || 'None'}</p>
                <p className="card-text">Quantity: {product.Quantity}</p>
                <p className="card-text">Expiration: {product.ExpirationDate}</p>
                <p className="card-text">Selling Price: ₹{product.CostPrice}</p>
                <p className="card-text">MRP Price: ₹{product.SellingPrice}</p>
                <div className="input-group mb-2">
                  <input
                    type="number"
                    className="form-control"
                    value={quantityRequested[product.ProductID] || ''}
                    onChange={(e) => handleQuantityChange(product.ProductID, e.target.value)}
                    placeholder="Qty"
                  />
                  <button className="btn btn-primary" onClick={() => handleRequestSubmit(product.ProductID)}>Request</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserHome;
