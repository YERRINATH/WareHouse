# Inventory Management System

## Overview
This is a role-based inventory management system built with React (Bootstrap) for the frontend, Express.js for the backend, JWT for authentication, and MySQL for database management. It allows users, managers, and administrators to manage inventory efficiently.

## Features
- **User Authentication**: Separate login pages for Admin, Manager, and Users.
- **Role-Based Access Control**: Each role has specific permissions.
- **Inventory Management**:
  - Users can request products.
  - Managers can review and approve requests.
  - Admins can manage stock, replenishments, and users.
- **Dashboard for Each Role**: Separate homepages for Admin, Manager, and User.

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/YERRINATH/warehouse.git
   ```
2. Install dependencies:
   ```sh
   cd project-folder
   npm install
   ```
3. Set up the MySQL database with the required tables.
4. Add admin login details manually to MySQL.
5. Start the backend server:
   ```sh
   node server.js
   ```
6. Start the frontend:
   ```sh
   npm start
   ```

## Screenshots
### **Authentication**
- **User Login Page**  
  ![User Login](/gInk/userlogin.png)
- **User Register Page**  
  ![User Register](/gInk/userregsiter.png)
- **Admin Login Page**  
  ![Admin Login](/gInk/adminlogin.png)
- **Manager Login Page**  
    ![Manager Login](/gInk/manager%20login.png)

### **Admin Dashboard**
- **Admin Home**  
  ![Admin Home](/gInk/adminusers.png)
- **Manage Categories**  
  ![Admin Categories](/gInk/admin%20catogories.png)
- **Manage Products**  
  ![Admin Products](/gInk/admin%20products.png)
- **Stock Management**  
  ![Stock Management](/gInk/admin%20stocks.png)
- **Replenishment Requests**  
  ![Replenishment Requests](/gInk/admin%20replensihment.png)
- **User Requests**  
  ![Admin Requests](/gInk/admin%20requests.png)

### **Manager Dashboard**
- **Manager Home**  
  ![Manager Home](/gInk/manager%20home%20page.png)

### **User Dashboard**
- **User Home**  
  ![User Home](/gInk/user%20products%20home.png)
- **Product Requests**  
  ![User Requests](/gInk/user%20reuqests.png)

## Usage
- Users can log in, browse available products, and place requests.
- Managers can approve or reject user requests.
- Admins can manage stock, replenishments, and user accounts.

## Notes
- The initial admin login details need to be added manually to the MySQL database.
- All three roles have dedicated homepages with relevant permissions.

