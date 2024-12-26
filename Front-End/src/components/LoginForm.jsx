import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

// Login form component
function LoginForm() {
    // State variables for email, password, and error
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);


    // Function to handle login
    const loginUser = async(e) => {
      // Prevent default form submission
      e.preventDefault();
      // Reset error state
      setError(null);
      
      // Check if email and password are empty
      try {
      // Make a POST request to the API
        const response = await axios.post('http://127.0.0.1:8000/api/v1/users/login/', {
        // Pass email and password in the request body
        email,
        password,
      });
      
      // Display an alert if login is successful
      window.alert('Login successful!');
      // Log the response data
      console.log('Login successful');
      // Log the response data
      console.log(response.data);

      // Store the token in local storage
      const { token } = response.data;
      // Set the token in local storage
      localStorage.setItem('token', token);
      
      // Display an alert if login is unsuccessful.
      } catch (err) {
        window.alert('An error occurred during login. Please try again.');
        console.error(err);
        setError('An error occurred during login.')
      }
      
    };

  return (
    // Define form with onSubmit handler that calls loginUser function
    <Form onSubmit={loginUser}>
      {/* Email input field */}
      {/* Set value and onChange props to email state */}
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        {/* Set type, placeholder, value, and onChange props */}
        {/* Update email state when input value changes.*/}
        <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-width" />
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      {/* Password input field */}
      {/* Set value and onChange props to password state */}
      {/* Update password state when input value changes.*/}
      {/* Set type, placeholder, value, and onChange props */}
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-width" />
      </Form.Group>
      <Button variant="primary" type="submit">
        Login
      </Button>
    </Form>
  );
}

export default LoginForm;