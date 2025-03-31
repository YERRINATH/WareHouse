const express = require('express');


module.exports = (db) => {
  const router = express.Router();

  // Get all products
  router.get('/products', (req, res) => {
    const query = `
      SELECT p.*, c.CategoryName
      FROM Products p
      LEFT JOIN Categories c ON p.CategoryID = c.CategoryID
    `;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching products:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
    });
  });
// const categoryQuery = 'SELECT CategoryID FROM Categories WHERE CategoryName = ?';
router.post('/products', async (req, res) => {
  const { ProductName, Quantity, ExpirationDate, CostPrice, SellingPrice, CategoryID, ImageURL } = req.body;
  console.log('Received data:', req.body);

  if (!ProductName || !Quantity || !ExpirationDate || !CostPrice || !SellingPrice || !CategoryID) {
    return res.status(400).json({ error: 'Required fields: ProductName, Quantity, ExpirationDate, CostPrice, SellingPrice, CategoryID' });
  }

  try {
    const productQuery = `
      INSERT INTO Products (ProductName, Quantity, ExpirationDate, CostPrice, SellingPrice, CategoryID, ImageURL) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.promise().query(productQuery, [
      ProductName,
      Quantity,
      ExpirationDate,
      CostPrice,
      SellingPrice,
      CategoryID,
      ImageURL || null
    ]);

    res.json({ message: 'Product added successfully', ProductID: result.insertId });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// PUT route
router.put('/products/:id', async (req, res) => {
  const { ProductName, Quantity, ExpirationDate, CostPrice, SellingPrice, ImageURL, CategoryID } = req.body;
  const { id } = req.params;

  try {
    const query = `
      UPDATE Products 
      SET ProductName=?, Quantity=?, ExpirationDate=?, CostPrice=?, SellingPrice=?, ImageURL=?, CategoryID=? 
      WHERE ProductID=?
    `;
    await db.promise().query(query, [
      ProductName,
      Quantity,
      ExpirationDate,
      CostPrice,
      SellingPrice,
      ImageURL,
      CategoryID,
      id
    ]);
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE a product by ID
router.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM Products WHERE ProductID = ?';
    await db.promise().query(query, [id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



  // Get all categories
  router.get('/Categories', (req, res) => {
    db.query('SELECT * FROM Categories', (err, results) => {
      if (err) {
        console.error('Error fetching categories:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
    });
  });

  router.post('/categories', (req, res) => {
  const { CategoryName } = req.body;
  if (!CategoryName) {
    return res.status(400).json({ error: 'CategoryName is required' });
  }
  db.query('INSERT INTO Categories (CategoryName) VALUES (?)', [CategoryName], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ CategoryID: result.insertId, CategoryName });
  });
  });

  // Get all stock movements
  router.get('/Stock-Movements', (req, res) => {
    db.query('SELECT * FROM StockMovements', (err, results) => {
      if (err) {
        console.error('Error fetching stock movements:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
    });
  });

router.post('/stock-movements', async (req, res) => {
  try {
    const { ProductID, QuantityMoved, MovementType } = req.body;
    await db.query('INSERT INTO StockMovements (ProductID, QuantityMoved, MovementType) VALUES (?, ?, ?)', 
      [ProductID, QuantityMoved, MovementType]);
    res.json({ message: 'Stock movement added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
  
  // Edit stock movement
  router.put('/stock-movements/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { ProductID, QuantityMoved, MovementType } = req.body;
      await db.query('UPDATE StockMovements SET ProductID=?, QuantityMoved=?, MovementType=? WHERE MovementID=?', 
        [ProductID, QuantityMoved, MovementType, id]);
      res.json({ message: 'Stock movement updated' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// In your router
router.get('/Requests', (req, res) => {
  const sql = `
    SELECT r.*, p.ProductName 
    FROM Requests r
    JOIN Products p ON r.ProductID = p.ProductID
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching requests:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

  router.put("/Requests/:id", (req, res) => {
    const { Status } = req.body;
    const { id } = req.params;
    const validStatuses = ["Pending", "Fulfilled", "Partially Fulfilled", "Rejected"];
  
    if (!validStatuses.includes(Status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }
  
    db.query(
      "UPDATE Requests SET Status = ? WHERE RequestID = ?",
      [Status, id],
      (err, result) => {
        if (err) {
          console.error("Database update error:", err);
          return res.status(500).json({ error: "Database error", details: err.message });
        }
  
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Request not found" });
        }
  
        res.json({ RequestID: id, Status });
      }
    );
  });
  
// below one used need to check i think used in user home page
router.post('/requests', (req, res) => {
  const { UserID, ProductID, QuantityRequested } = req.body;

  if (!UserID || !ProductID || QuantityRequested <= 0) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  // Check available quantity
  const checkQuantityQuery = 'SELECT Quantity FROM Products WHERE ProductID = ?';

  db.query(checkQuantityQuery, [ProductID], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database query error' });
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const availableQuantity = results[0].Quantity;
    let newStatus = 'Pending';
    let fulfilledQuantity = 0;

    if (availableQuantity >= QuantityRequested) {
      newStatus = 'Fulfilled';
      fulfilledQuantity = QuantityRequested;
    } else if (availableQuantity > 0) {
      newStatus = 'Partially Fulfilled';
      fulfilledQuantity = availableQuantity; // Only fulfill available amount
    }

    // Insert request with actual fulfilled quantity
    const insertRequestQuery = 
      'INSERT INTO Requests (UserID, ProductID, QuantityRequested, Status) VALUES (?, ?, ?, ?)';

    db.query(insertRequestQuery, [UserID, ProductID, fulfilledQuantity, newStatus], (err, result) => {
      if (err) return res.status(500).json({ error: 'Database insert error' });

      // If any quantity was fulfilled, update product stock
      if (fulfilledQuantity > 0) {
        const updatedQuantity = availableQuantity - fulfilledQuantity;
        const updateProductQuery = 'UPDATE Products SET Quantity = ? WHERE ProductID = ?';

        db.query(updateProductQuery, [updatedQuantity, ProductID], (err) => {
          if (err) return res.status(500).json({ error: 'Failed to update product quantity' });
          res.json({ 
            message: 'Request added successfully', 
            requestID: result.insertId, 
            status: newStatus, 
            fulfilledQuantity 
          });
        });
      } else {
        res.json({ 
          message: 'Request added but is still pending due to insufficient stock', 
          requestID: result.insertId, 
          status: newStatus 
        });
      }
    });
  });
});


  
router.post("/managerRequests", (req, res) => {
  const { UserID, ProductID, QuantityRequested } = req.body;
  if (!UserID || !ProductID || QuantityRequested <= 0)
    return res.status(400).json({ error: "Invalid input data" });

  db.query(
    "INSERT INTO Requests (UserID, ProductID, QuantityRequested) VALUES (?, ?, ?)",
    [UserID, ProductID, QuantityRequested],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        RequestID: result.insertId,
        UserID,
        ProductID,
        QuantityRequested,
        Status: "Pending",
      });
    }
  );
});

  


  // Get all replenishments
  router.get('/Replenishments', (req, res) => {
    db.query('SELECT * FROM Replenishments', (err, results) => {
      if (err) {
        console.error('Error fetching replenishments:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
    });
  });
  router.post('/Replenishments', (req, res) => {
    const { ProductID, QuantityAdded } = req.body;
    if (!ProductID || !QuantityAdded || QuantityAdded <= 0) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    const query = 'INSERT INTO Replenishments (ProductID, QuantityAdded) VALUES (?, ?)';
    db.query(query, [ProductID, QuantityAdded], (err, result) => {
      if (err) {
        console.error('Error adding replenishment:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      db.query('SELECT * FROM Replenishments WHERE ReplenishmentID = ?', [result.insertId], (err2, results2) => {
        if (err2) {
          console.error('Error fetching new replenishment:', err2);
          return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json(results2[0]);
      });
    });
  });
  
  
  router.put('/Replenishments/:id', (req, res) => {
    const id = req.params.id;
    const { ProductID, QuantityAdded } = req.body;
    if (!ProductID || !QuantityAdded || QuantityAdded <= 0) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    const query = 'UPDATE Replenishments SET ProductID = ?, QuantityAdded = ? WHERE ReplenishmentID = ?';
    db.query(query, [ProductID, QuantityAdded, id], (err, result) => {
      if (err) {
        console.error('Error updating replenishment:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Replenishment not found' });
      }
      db.query('SELECT * FROM Replenishments WHERE ReplenishmentID = ?', [id], (err2, results2) => {
        if (err2) {
          console.error('Error fetching updated replenishment:', err2);
          return res.status(500).json({ error: 'Database error' });
        }
        res.json(results2[0]);
      });
    });
  });
  
  



  router.put('/categories/:id', async (req, res) => {
    const { id } = req.params;
    const { CategoryName } = req.body;
  
    try {
      await db.execute('UPDATE Categories SET CategoryName = ? WHERE CategoryID = ?', [CategoryName, id]);
      res.json({ message: 'Category updated' });
    } catch (error) {
      res.status(500).json({ error: 'Database error' });
    }
  });
  

  

  return router;
};