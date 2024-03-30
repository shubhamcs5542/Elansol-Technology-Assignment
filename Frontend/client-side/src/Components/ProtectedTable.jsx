import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { Spinner, Table } from 'react-bootstrap';

const ProtectedTable = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      fetchUserData(token);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const fetchUserData = async (token) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">User Information</h2>
      {!isAuthenticated && <Link to="/sign-in">Sign in to view user information</Link>}
      {loading && <Spinner animation="border" role="status" />}
      {error && <div className="alert alert-danger">{error}</div>}
      {userData && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Date of Birth</th>
              {/* Add more columns as needed */}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{userData.name}</td>
              <td>{userData.email}</td>
              <td>{userData.dateOfBirth}</td>
              {/* Display more user information */}
            </tr>
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ProtectedTable;
