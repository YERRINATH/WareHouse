-- Create Database
CREATE DATABASE IF NOT EXISTS warehouse;
USE warehouse;

-- Users Table
CREATE TABLE Users (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    UserName VARCHAR(255) NOT NULL UNIQUE,
    Email VARCHAR(255) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Role ENUM('Admin', 'Warehouse Manager', 'User') NOT NULL DEFAULT 'User',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Default Admin (if no admin exists)
INSERT INTO Users (UserName, Email, PasswordHash, Role)
SELECT 'Admin', 'admin@gmail.com', 'pass', 'Admin'
WHERE NOT EXISTS (SELECT 1 FROM Users WHERE Role = 'Admin');

-- Categories Table
CREATE TABLE Categories (
    CategoryID INT AUTO_INCREMENT PRIMARY KEY,
    CategoryName VARCHAR(50) UNIQUE NOT NULL
);

-- Products Table
CREATE TABLE Products (
    ProductID INT AUTO_INCREMENT PRIMARY KEY,
    ProductName VARCHAR(100) NOT NULL,
    Quantity INT NOT NULL CHECK (Quantity >= 0),
    ExpirationDate DATE NOT NULL,
    CostPrice DECIMAL(10,2) NOT NULL,
    SellingPrice DECIMAL(10,2) NOT NULL,
    CategoryID INT NOT NULL,
    ImageURL VARCHAR(255),
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID) ON DELETE CASCADE
);

-- Requests Table
CREATE TABLE Requests (
    RequestID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    ProductID INT NOT NULL,
    QuantityRequested INT NOT NULL CHECK (QuantityRequested > 0),
    RequestDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Status ENUM('Pending', 'Fulfilled', 'Partially Fulfilled', 'Rejected') DEFAULT 'Pending',
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE
);

-- Stock Movements Table
CREATE TABLE StockMovements (
    MovementID INT AUTO_INCREMENT PRIMARY KEY,
    ProductID INT NOT NULL,
    QuantityMoved INT NOT NULL CHECK (QuantityMoved <> 0),
    MovementDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    MovementType ENUM('Allocated', 'Replenished') NOT NULL,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE
);

-- Replenishments Table
CREATE TABLE Replenishments (
    ReplenishmentID INT AUTO_INCREMENT PRIMARY KEY,
    ProductID INT NOT NULL,
    QuantityAdded INT NOT NULL CHECK (QuantityAdded > 0),
    ReplenishmentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE
);
