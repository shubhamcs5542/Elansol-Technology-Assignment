import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Updated imports
import LoginForm from './Components/LoginForm';
import RegistrationForm from './Components/RegistrationForm';
import ProtectedTable from './Components/ProtectedTable'; // Import ProtectedTable component

function App() {
  // Function to check if the user is authenticated
  const isAuthenticated = () => {
    // Check if the authentication token exists in local storage
    return localStorage.getItem('token');
  };

  // ProtectedRoute component to protect routes that require authentication
  const ProtectedRoute = ({ element, ...rest }) => {
    // If the user is authenticated, render the provided element (component)
    // Otherwise, redirect to the login page
    return isAuthenticated() ? element : <Navigate to="/sign-in" />;
  };

  return (
    <Router>
      <div className="App">
        <div className="auth-wrapper">
          <div className="auth-inner">
            <Routes>
              {/* Use the ProtectedRoute component for the protected table route */}
              <Route exact path="/" element={<LoginForm />} />
              <Route path="/sign-in" element={<LoginForm />} />
              <Route path="/sign-up" element={<RegistrationForm />} />
              {/* Protected route for the protected table */}
              <Route path="/protected-table" element={<ProtectedRoute element={<ProtectedTable />} />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
