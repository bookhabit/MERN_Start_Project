import { Route, Routes } from 'react-router'
import './App.css'
import Layout from './Layout';
import IndexPage from './pages/IndexPage';
import axios from 'axios';
import LoginPage from './pages/LoginPage';
import ReigsterPage from './pages/RegisterPage';
import { UserContextProvider } from './UserContext';
import PostForm from './components/testRestAPI/PostForm';

axios.defaults.baseURL = "http://localhost:4000"
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route path="/" element={<IndexPage/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/register" element={<ReigsterPage/>} />
          <Route path={'/post/create'} element={<PostForm/>}/>
          {/* <Route path={'/post/:id'} element={<PostPage/>}/>
          <Route path={'/edit/:id'} element={<EditPost/>}/> */}
        </Route>
      </Routes>
    </UserContextProvider>
  )
}

export default App
