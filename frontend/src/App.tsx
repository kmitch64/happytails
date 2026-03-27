
import type { JSX } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AuthProvider from './components/auth/AuthProvider';
import ProtectedRoute from './components/auth/ProtectedRoute';

//layout
import DefaultLayout from './components/layouts/default/DefaultLayout';

//legal
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';

//auth pages
// Frontend peeps can decide if these go in the layout or not, currently inside.
import Login from './pages/login/login';
import Register from './pages/register/register';
import Logout from './pages/logout/logout';
import TwoFactorAuth from './pages/2fa/2fa';

//home page
import Home from "./pages/Home/Home";

//admin dashboard
import AdminLayout from './components/layouts/admin/AdminLayout';
import UserManagement from './pages/admin/UserManagement';
import UserForm from './pages/admin/UserForm';

//user dashboard
import DashboardLayout from './pages/dashboard/DashboardLayout';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import MyPets from './pages/dashboard/MyPets';
import AddEditPet from './pages/dashboard/AddEditPet';
import MyPetProfile from './pages/dashboard/MyPetProfile';
import CareReminders from './pages/dashboard/CareReminders';
import AddReminder from './pages/dashboard/AddReminder';
import MedicalRecords from './pages/dashboard/MedicalRecords';
import AddMedicalRecord from './pages/dashboard/AddMedicalRecord';

//adopt pages
import Adopt from './pages/dashboard/DashboardAdopt';
import AdoptableProfile from './pages/dashboard/DashboardPetProfile';
import BrowseAdoptables from './pages/dashboard/DashboardBrowseAdoptables';

// import MyApplications from './pages/dashboard/MyApplications';
// import Favorites from './pages/dashboard/Favorites';
// import AIAdvice from './pages/dashboard/AIAdvice';
// import Sitters from './pages/dashboard/Sitters';

//global styles
import './App.css';


export default function App(): JSX.Element {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          <Route element={<DefaultLayout />}>

            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />

            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/logout' element={<Logout />} />
            <Route path='/2fa' element={<TwoFactorAuth />} />

            <Route path="/" element={<Home />} />

            <Route path="/dashboard/admin" element={<AdminLayout />} >
              <Route index element={<UserManagement />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="users/create" element={<UserForm />} />
              <Route path="users/:id/edit" element={<UserForm />} />
            </Route>

            <Route path='/dashboard/*' element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<DashboardOverview />} />
              <Route path='adopt' element={<Adopt />} />
              <Route path='adopt/browse' element={<BrowseAdoptables />} />
              <Route path='adopt/pet/:id' element={<AdoptableProfile />} />
              <Route path='my-pets' element={<MyPets />} />
              <Route path='my-pets/add' element={<AddEditPet />} />
              <Route path='my-pets/edit/:id' element={<AddEditPet />} />
              <Route path='my-pets/:id' element={<MyPetProfile />} />
              <Route path='reminders' element={<CareReminders />} />
              <Route path='my-pets/:id/add-reminder' element={<AddReminder />} />
              <Route path="medical-records" element={<MedicalRecords />} />
              <Route path="my-pets/:id/add-medical-record"element={<AddMedicalRecord />} />





              {/* <Route path='my-applications' element={<MyApplications />} />
              <Route path='favorites' element={<Favorites />} />
              
              <Route path='sitters' element={<Sitters />} /> */}
            </Route>

          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
