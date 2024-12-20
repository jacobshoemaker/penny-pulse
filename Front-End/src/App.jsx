import { useEffect, useState } from 'react';
import './App.css';
import { Outlet } from 'react-router-dom';
import NavBar from './components/NavBar';
import axios from 'axios'
import { alignPropType } from 'react-bootstrap/esm/types';

function App() {
  

  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

export default App;
