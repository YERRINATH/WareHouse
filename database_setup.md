# Database Setup Guide

## **Database Name**: `warehouse`

### **1. Default Admin User**
- If no admin exists in the `Users` table, the system will create a default admin:
  - **Email**: `admin@gmail.com`
  - **Password**: `pass`
  - **Role**: `Admin`
- If an admin already exists, this default login will not be created.

---

## **2. Tables Overview**
| Table Name        | Description |
|-------------------|-------------|
| `Users`          | Stores user information (Admins, Managers, Users). |
| `Categories`     | Manages product categories. |
| `Products`       | Stores product details (price, quantity, expiry). |
| `Requests`       | Logs user product requests. |
| `StockMovements` | Tracks inventory stock movements. |
| `Replenishments` | Logs stock replenishment details. |

---

## **3. Role-Based Access**
| Role               | Permissions |
|--------------------|-------------|
| **Admin**         | Can manage all users, products, stock, requests, and replenishments. |
| **Warehouse Manager** | Can view and manage stock, requests, and replenishments, but cannot manage users. |
| **User**          | Can request products and view product availability. |


