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



  const signUpUser = async(e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');
    
    try {
      // Post request to backend
      const response = await axios.post('http://127.0.0.1:8000/api/v1/users/signup/', {
        email,
        password,
      });
  
      setSuccessMessage('Registration successful');
      window.alert('Registration successful!');
      console.log(successMessage);
      console.log(response.data);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.error === 'Email already in use') {
        window.alert('This email is already in use. Please try another one.');
      } else {
        window.alert('An error occurred during registration. Please try again.');
      }
    }
  };

  
  return (
    <Form onSubmit={signUpUser}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" value= {email} onChange={(e) => setEmail(e.target.value)} className="input-width" />
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

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