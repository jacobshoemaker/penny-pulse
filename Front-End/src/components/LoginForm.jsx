import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);


    const loginUser = async(e) => {
      e.preventDefault();
      setError(null);
    
      try {
      // Post request to backend
        const response = await axios.post('http://127.0.0.1:8000/api/v1/users/login/', {
        email,
        password,
      });
      
        
      window.alert('Login successful!');
      console.log('Login successful');
      console.log(response.data);

      const { token } = response.data;
      localStorage.setItem('token', token);
      
      } catch (err) {
        window.alert('An error occurred during login. Please try again.');
        console.error(err);
        setError('An error occurred during login.')
      }
      
    };

  return (
    <Form onSubmit={loginUser}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-width" />
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

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