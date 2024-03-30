import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BiUserCircle, BiLock } from 'react-icons/bi';
import axios from 'axios';

function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Check if the field is dateOfBirth and format it as "yyyy-mm-dd"
    const formattedValue = name === 'dateOfBirth' ? new Date(value).toISOString().split('T')[0] : value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: formattedValue,
    }));
  };

  const handleSubmit = async (e, redirectToLogin) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/users/register', formData);
      const { token } = response.data;
      localStorage.setItem('token', token);
      // Redirect to sign-in component upon successful registration
      if (redirectToLogin) {
        window.location.href = '/sign-in'; // Redirect to the sign-in page
      }
    } catch (error) {
      console.error('Registration failed:', error);
      // Handle registration failure, display error message to the user
    }
  };

  return (
    <div className="container mt-5 pt-5">
      <div className="row justify-content-center align-items-center">
        <div className="col-lg-5">
          <div className="card bg-blue shadow-lg p-5">
            <div className="mb-4 bg-info text-white p-3 d-flex justify-content-center align-items-center" style={{ width: '200px', margin: '0 auto' }}>
              <h2 className="fw-bold mb-0">Sign up</h2>
            </div>

            <Form onSubmit={(e) => handleSubmit(e, true)}>
              {/* Your form fields */}
              <Form.Group controlId="formBasicName" className="mb-3">
                <div className="input-group mb-3">
                  <span className="input-group-text"><BiUserCircle /></span>
                  <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                </div>
              </Form.Group>

              <Form.Group controlId="formBasicDateOfBirth" className="mb-3">
                <div className="input-group mb-3">
                  <span className="input-group-text"><BiUserCircle /></span>
                  <Form.Control type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} placeholder="Date of Birth" />
                </div>
              </Form.Group>

              <Form.Group controlId="formBasicEmail" className="mb-3">
                <div className="input-group mb-3">
                  <span className="input-group-text">@</span>
                  <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                </div>
              </Form.Group>

              <Form.Group controlId="formBasicPassword" className="mb-3">
                <div className="input-group">
                  <span className="input-group-text"><BiLock /></span>
                  <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
                </div>
              </Form.Group>

              <Button variant="info" type="submit" className="w-100 mb-3">
                Sign Up
              </Button>
            </Form>

            <div className="text-center">
              <span>Already have an account? </span>
              <Link to="/sign-in">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistrationForm;
