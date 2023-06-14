import { Route, Routes } from 'react-router'
import './App.css'
import Layout from './Layout';
import IndexPage from './pages/IndexPage';
import axios from 'axios';
import { useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import ReigsterPage from './pages/RegisterPage';

axios.defaults.baseURL = "http://localhost:4000"
axios.defaults.withCredentials = true;

function App() {
  return (
    <Routes>
    <Route path="/" element={<Layout/>}>
      <Route path="/" element={<IndexPage/>} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/register" element={<ReigsterPage/>} />
    </Route>
  </Routes>
  )
}

export default App
