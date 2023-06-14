import { Route, Routes } from 'react-router'
import './App.css'
import Layout from './Layout';
import IndexPage from './pages/IndexPage';
import axios from 'axios';
import LoginPage from './pages/LoginPage';
import ReigsterPage from './pages/RegisterPage';
import { UserContextProvider } from './UserContext';
import PostFormPage from './pages/PostFormPage';
import AccountPage from './pages/ProfilePage';
import PostDetail from './pages/PostDetail';
import ProfilePage from './pages/ProfilePage';
import UserPostsPage from './pages/UserPostsPage';

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
          <Route path={'/post/create'} element={<PostFormPage/>}/>
          <Route path={'/post/update/:id'} element={<PostFormPage/>}/>
          <Route path={'/post/:id'} element={<PostDetail/>}/>
          <Route path="/account" element={<ProfilePage />} />
          <Route path="/account/posts" element={<UserPostsPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  )
}

export default App
