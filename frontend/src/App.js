import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import Home from "./Home";
import UserLogin from "./components/LoginUser";
import UserRegister from "./components/RegisterUser";
import HomeAdmin from "./components/HomeAdmin";
//import About from "./About";
//import NotFound from "./NotFound";
import AdminLogin from "./components/LoginAdmin";
import AdminRegister from "./components/RegisterAdmin";
import ManagerLogin from "./components/LoginManager";
import UserHome from "./components/HomeUser";
import ManagerHome from "./components/HomeManager";
import UserRequests from "./dashboards/ProductRequest";
function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserLogin />} />
        <Route path="*" element={<HomeAdmin />} />
        <Route path="/userregister" element={<UserRegister />} />
        <Route path="/adminhome" element={<HomeAdmin />} />
        <Route path="/AdminLogin" element={<AdminLogin />} />
        <Route path="/AdminRegister" element={<AdminRegister />} />
        <Route path="/ManagerLogin" element={<ManagerLogin />} />
        <Route path="/userhome" element={<UserHome />} />
        <Route path="/managerhome" element={<ManagerHome />} />
        <Route path="/UserRequest" element={<UserRequests />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
