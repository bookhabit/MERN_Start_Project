import { Route, Routes } from 'react-router'
import './App.css'
import Layout from './Layout';
import IndexPage from './pages/IndexPage';
import axios from 'axios';
import { useEffect } from 'react';

axios.defaults.baseURL = "http://localhost:4000"
axios.defaults.withCredentials = true;

function App() {
  useEffect(()=>{
    axios.get('/').then(response=>{
      console.log(response)
    })
  },[])
  return (
    <Routes>
    <Route path="/" element={<Layout/>}>
      <Route path="/" element={<IndexPage/>} />
    </Route>
  </Routes>
  )
}

export default App
