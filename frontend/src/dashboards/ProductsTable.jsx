import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProductsTable() {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({
    ProductName: '',
    Quantity: '',
    ExpirationDate: '',
    CostPrice: '',
    SellingPrice: '',
    ImageURL: '',
    CategoryID: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newProductData, setNewProductData] = useState({
    ProductName: '',
    Quantity: '',
    ExpirationDate: '',
    CostPrice: '',
    SellingPrice: '',
    ImageURL: '',
    CategoryID: ''
  });
  const [newImageFile, setNewImageFile] = useState(null);
  const [categories, setCategories] = useState([]);

  // Fetch products and categories once on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await axios.get('http://localhost:5000/api/products');
        setProducts(productsResponse.data);
        console.log('Products fetched:', productsResponse.data);

        const categoriesResponse = await axios.get('http://localhost:5000/api/Categories');
        setCategories(categoriesResponse.data);
        console.log('Categories fetched:', categoriesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleEditClick = (product) => {
    setEditProduct(product.ProductID);
    setFormData({
      ProductName: product.ProductName || '',
      Quantity: product.Quantity || '',
      ExpirationDate: product.ExpirationDate || '',
      CostPrice: product.CostPrice || '',
      SellingPrice: product.SellingPrice || '',
      ImageURL: product.ImageURL || '',
      CategoryID: product.CategoryID || ''
    });
    setImageFile(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setFormData({ ...formData, ImageURL: URL.createObjectURL(file) });
    }
  };

  const handleUpdate = async () => {
    const updatedData = { ...formData };
    if (imageFile) {
      const formDataImage = new FormData();
      formDataImage.append('file', imageFile);
      try {
        const uploadResponse = await axios.post('http://localhost:5000/api/upload', formDataImage, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        updatedData.ImageURL = uploadResponse.data.imageUrl;
      } catch (error) {
        console.error('Image upload failed:', error);
        return;
      }
    }
    try {
      await axios.put(`http://localhost:5000/api/products/${editProduct}`, updatedData);
      setEditProduct(null);
      const productsResponse = await axios.get('http://localhost:5000/api/products');
      setProducts(productsResponse.data);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleNewProductChange = (e) => {
    setNewProductData({ ...newProductData, [e.target.name]: e.target.value });
  };

  const handleNewImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImageFile(file);
      setNewProductData({ ...newProductData, ImageURL: URL.createObjectURL(file) });
    }
  };

  const handleAddProduct = () => {
    setIsAdding(true);
  };

  const handleSaveNewProduct = async () => {
    let imageUrl = newProductData.ImageURL;
    if (newImageFile) {
      const formDataImage = new FormData();
      formDataImage.append('file', newImageFile);
      try {
        const uploadResponse = await axios.post('http://localhost:5000/api/upload', formDataImage, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrl = uploadResponse.data.imageUrl;
      } catch (error) {
        console.error('Image upload failed:', error);
        return;
      }
    }

    const newProduct = {
      ProductName: newProductData.ProductName,
      Quantity: newProductData.Quantity,
      ExpirationDate: newProductData.ExpirationDate,
      CostPrice: newProductData.CostPrice,
      SellingPrice: newProductData.SellingPrice,
      ImageURL: imageUrl || '',
      CategoryID: newProductData.CategoryID
    };

    try {
      await axios.post('http://localhost:5000/api/products', newProduct);
      setIsAdding(false);
      setNewProductData({
        ProductName: '',
        Quantity: '',
        ExpirationDate: '',
        CostPrice: '',
        SellingPrice: '',
        ImageURL: '',
        CategoryID: ''
      });
      setNewImageFile(null);
      const productsResponse = await axios.get('http://localhost:5000/api/products');
      setProducts(productsResponse.data);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };
  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${productId}`);
        setProducts(products.filter(product => product.ProductID !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <div className="container mt-4">
      {/* Add Product Button */}
      <div className="mb-4">
        <button className="btn btn-primary" onClick={handleAddProduct} disabled={isAdding}>
          Add New Product
        </button>
      </div>

      {/* Add Product Form */}
      {isAdding && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5>Add New Product</h5>
            <input
              type="text"
              className="form-control mb-2"
              name="ProductName"
              value={newProductData.ProductName}
              onChange={handleNewProductChange}
              placeholder="Product Name"
              required
            />
            <input
              type="number"
              className="form-control mb-2"
              name="Quantity"
              value={newProductData.Quantity}
              onChange={handleNewProductChange}
              placeholder="Quantity"
              min="0"
              required
            />
            <input
              type="date"
              className="form-control mb-2"
              name="ExpirationDate"
              value={newProductData.ExpirationDate}
              onChange={handleNewProductChange}
            />
            <input
              type="number"
              className="form-control mb-2"
              name="CostPrice"
              value={newProductData.CostPrice}
              onChange={handleNewProductChange}
              placeholder="Cost Price"
              step="0.01"
              min="0"
              required
            />
            <input
              type="number"
              className="form-control mb-2"
              name="SellingPrice"
              value={newProductData.SellingPrice}
              onChange={handleNewProductChange}
              placeholder="Selling Price"
              step="0.01"
              min="0"
              required
            />
            <select
              className="form-control mb-2"
              name="CategoryID"
              value={newProductData.CategoryID}
              onChange={handleNewProductChange}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.CategoryID} value={category.CategoryID}>
                  {category.CategoryName}
                </option>
              ))}
            </select>
            <input
              type="file"
              className="form-control-file mb-2"
              accept="image/*"
              onChange={handleNewImageChange}
            />
            {newProductData.ImageURL && (
              <img
                src={newProductData.ImageURL}
                alt="Preview"
                className="img-thumbnail mt-2"
                width="50"
                height="50"
              />
            )}
            <div className="d-flex justify-content-between mt-2">
              <button className="btn btn-success btn-sm" onClick={handleSaveNewProduct}>
                Save
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => setIsAdding(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className="row">
        {products.map((prod) => (
          <div key={prod.ProductID} className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <img
                src={prod.ImageURL || 'placeholder-image-url'}
                alt={prod.ProductName}
                className="card-img-top"
                style={{ height: '150px', objectFit: 'cover' }}
              />
              <div className="card-body">
                {editProduct === prod.ProductID ? (
                  <>
                    <input
                      type="text"
                      className="form-control mb-2"
                      name="ProductName"
                      value={formData.ProductName}
                      onChange={handleChange}
                      placeholder="Product Name"
                      required
                    />
                    <input
                      type="number"
                      className="form-control mb-2"
                      name="Quantity"
                      value={formData.Quantity}
                      onChange={handleChange}
                      placeholder="Quantity"
                      min="0"
                      required
                    />
                    <input
                      type="date"
                      className="form-control mb-2"
                      name="ExpirationDate"
                      value={formData.ExpirationDate}
                      onChange={handleChange}
                    />
                    <input
                      type="number"
                      className="form-control mb-2"
                      name="CostPrice"
                      value={formData.CostPrice}
                      onChange={handleChange}
                      placeholder="Cost Price"
                      step="0.01"
                      min="0"
                      required
                    />
                    <input
                      type="number"
                      className="form-control mb-2"
                      name="SellingPrice"
                      value={formData.SellingPrice}
                      onChange={handleChange}
                      placeholder="Selling Price"
                      step="0.01"
                      min="0"
                      required
                    />
                    <select
                      className="form-control mb-2"
                      name="CategoryID"
                      value={formData.CategoryID}
                      onChange={handleChange}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.CategoryID} value={category.CategoryID}>
                          {category.CategoryName}
                        </option>
                      ))}
                    </select>
                    <input
                      type="file"
                      className="form-control-file mb-2"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {formData.ImageURL && (
                      <img
                        src={formData.ImageURL}
                        alt="Preview"
                        className="img-thumbnail mt-2"
                        width="50"
                        height="50"
                      />
                    )}
                    <div className="d-flex justify-content-between mt-2">
                      <button className="btn btn-success btn-sm" onClick={handleUpdate}>
                        Save
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setEditProduct(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h5 className="card-title">{prod.ProductName}</h5>
                    <p className="card-text">Quantity: {prod.Quantity}</p>
                    <p className="card-text">Expiration: {prod.ExpirationDate}</p>
                    <p className="card-text">Cost Price: ₹{prod.CostPrice}</p>
                    <p className="card-text">Selling Price: ₹{prod.SellingPrice}</p>
                    <p className="card-text">Category: {prod.CategoryName || 'None'}</p>
                    <button
                      className="btn btn-primary btn-sm w-100"
                      onClick={() => handleEditClick(prod)}
                    >
                      Edit
                    </button>
                    <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteProduct(prod.ProductID)}
                  >
                    Delete
                  </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductsTable;