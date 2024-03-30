import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BiUserCircle, BiLock } from 'react-icons/bi';
import axios from 'axios';
import { createBrowserHistory } from 'history';

function LoginForm() {
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    rememberMe: false,
  });

  const history = createBrowserHistory();

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'rememberMe' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/users/login', {
        name: formData.name,
        password: formData.password,
      });
      const { token } = response.data;
      localStorage.setItem('token', token);
      // Navigate to the dashboard
      history.push('/protected-table');
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login failure, display error message to the user
    }
  };

  return (
    <div className=" bg-blue container mt-5 pt-5">
      <div className=" bg-blue row justify-content-center align-items-center">
        <div className="col-lg-5">
          <div className="card bg-blue shadow-lg p-5">
            <div className="mb-4 bg-info text-white p-3 d-flex justify-content-center align-items-center" style={{ width: '200px', margin: '0 auto' }}>
              <h2 className="fw-bold mb-0">Sign in</h2>
            </div>

            <div className="row justify-content-center">
              <div className="col-lg-10 d-flex justify-content-center">
                <BiUserCircle size={100} />
              </div>
            </div>

            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicUsername" className="mb-3">
                <div className="input-group mb-3">
                  <span className="input-group-text"><BiUserCircle /></span>
                  <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Username" />
                </div>
              </Form.Group>

              <Form.Group controlId="formBasicPassword" className="mb-3">
                <div className="input-group">
                  <span className="input-group-text"><BiLock /></span>
                  <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
                </div>
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <Form.Group controlId="formBasicCheckbox" className="mb-0 me-3">
                  <Form.Check type="checkbox" label="Remember me" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} />
                </Form.Group>
                <Link to="/forgot-password" className="me-3">Forgot your password?</Link>
              </div>

              <Button variant="info" type="submit" className="w-100 mb-3">
                Login
              </Button>
            </Form>
            
            <div className="text-center">
              <span>Don't have an account? </span>
              <Link to="/sign-up">Register</Link>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
