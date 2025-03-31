import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">Inventory System</Link>
                <div>
                    {user ? (
                        <>
                            <span className="text-white me-3">{user.UserName} ({user.Role})</span>
                            <button className="btn btn-danger" onClick={logout}>Logout</button>
                        </>
                    ) : (
                        <Link className="btn btn-primary" to="/login">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
