
import type { JSX } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AuthProvider from './components/auth/AuthProvider.jsx';
// import ProtectedRoute from './Components/auth/ProtectedRoute';

//layout
import DefaultLayout from './components/layouts/DefaultLayout';

//auth pages
// Frontend peeps can decide if these go in the layout or not, currently inside.
import Login from './pages/login/login.jsx';
import Register from './pages/register/register.jsx';
import Logout from './pages/logout/logout.jsx';
import TwoFactorAuth from './pages/2fa/2fa.jsx';

//home page
import Home from "./pages/Home/Home.jsx";

//adopt pages
import Adopt from './pages/Adopt/Adopt.jsx';
import AdoptableProfile from './pages/Adopt/AdoptableProfile.jsx';
import BrowseAdoptables from './pages/Adopt/BrowseAdoptables.jsx';


//global styles
import './App.css';

export default function App(): JSX.Element {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          <Route element={<DefaultLayout />}>

            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/logout' element={<Logout />} />
            <Route path='/2fa' element={<TwoFactorAuth />} />

            <Route path="/" element={<Home />} />
            <Route path='/adopt' element={<Adopt />} />
            <Route path='/adopt/profile' element={<AdoptableProfile />} />
            <Route path='/adopt/browse' element={<BrowseAdoptables />} />

          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
