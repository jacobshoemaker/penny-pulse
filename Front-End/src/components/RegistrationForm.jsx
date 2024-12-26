import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

function RegistrationForm() {
  // Use states for inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');


  // Function to sign up user
  const signUpUser = async(e) => {
    // Prevent default form submission
    e.preventDefault();
    // Reset error and success message
    setError(null);
    setSuccessMessage('');
    
    try {
      // Send a POST request to the signup endpoint
      const response = await axios.post('http://127.0.0.1:8000/api/v1/users/signup/', {
        // Include email and password in the request body
        email,
        password,
      });
      
      // If the request is successful, set the success message
      setSuccessMessage('Registration successful');
      // Log the success message and response data to the console
      // and show an alert to the user
      window.alert('Registration successful!');
      console.log(successMessage);
      console.log(response.data);
    } catch (err) {
      console.error(err);
      // Checks if the error is due to the email already being in use
      if (err.response && err.response.data && err.response.data.error === 'Email already in use') {
        // If so, display an alert to the user
        window.alert('This email is already in use. Please try another one.');
      } else {
        // Otherwise, display an alert to the user
        window.alert('An error occurred during registration. Please try again.');
      }
    }
  };

  // Return the registration form
  return (
    // Define form with onSubmit handler that calls signUpUser function
    <Form onSubmit={signUpUser}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        {/* Set type, placeholder, value, and onChange props */}
        {/* Update email state when input value changes.*/}
        <Form.Control type="email" placeholder="Enter email" value= {email} onChange={(e) => setEmail(e.target.value)} className="input-width" />
        {/* Display a text below the input field */}
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>
      {/* Password input field */}
      {/* Set value and onChange props to password state */}
      {/* Update password state when input value changes.*/}
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-width" />
      </Form.Group>
      <Button variant="primary" type="submit">
        Register
      </Button>
    </Form>
  );
}

export default RegistrationForm;