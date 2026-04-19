import type { JSX } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AuthProvider from './components/auth/AuthProvider';
import ProtectedRoute from './components/auth/ProtectedRoute';

// layout
import DefaultLayout from './components/layouts/default/DefaultLayout';

// legal
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';

// auth pages
import Login from './pages/login/login';
import Register from './pages/register/register';
import Logout from './pages/logout/logout';
import TwoFactorAuth from './pages/2fa/2fa';

// home page
import Home from './pages/Home/Home';
import Verify from './pages/verify/Verify';
import VerifyEmailSentNotice from './pages/emailnotice/VerifyEmailSentNotice';

//home page
import Home from "./pages/Home/Home";

// admin dashboard
import AdminLayout from './components/layouts/admin/AdminLayout';
import UserManagement from './pages/admin/UserManagement';
import UserForm from './pages/admin/UserForm';

// user dashboard
import DashboardLayout from './components/layouts/dashboard/DashboardLayout';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import MyPets from './pages/dashboard/MyPets';
import AddEditPet from './components/dashboard/AddEditPet';
import MyPetProfile from './pages/dashboard/MyPetProfile';
import AIAssistant from './pages/dashboard/AIAssistant';
import CareReminders from './pages/dashboard/CareReminders';
import AddReminder from './components/dashboard/AddReminder';
import MedicalRecords from './pages/dashboard/MedicalRecords';
import AddMedicalRecord from './components/dashboard/AddMedicalRecord';
import AddMedRecordEdit from './components/dashboard/AddMedRecordEdit';

// adopt pages
import Adopt from './pages/dashboard/DashboardAdopt';
import DashboardPetProfile from './pages/dashboard/DashboardPetProfile';
import BrowseAdoptables from './pages/dashboard/DashboardBrowseAdoptables';
import AdoptionApplication from './pages/Adopt/AdoptionApplication';
import DashboardSitterForm from './pages/dashboard/DashboardSitterForm';

// public pages
import PublicAdoptableProfile from './pages/Adopt/AdoptableProfile';
import PublicBrowseAdoptables from './pages/Adopt/BrowseAdoptables';

// global styles
import './App.css';

import AdoptionApplication from './pages/Adopt/AdoptionApplication';

//global styles
import './App.css';



export default function App(): JSX.Element {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path="/" index element={<Home />} />

            <Route path="adopt" element={<PublicBrowseAdoptables />} />
            <Route path="adopt/:id" element={<PublicAdoptableProfile />} />
            <Route path="adopt-form" element={<AdoptionApplication />} />



            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/2fa" element={<TwoFactorAuth />} />

            <Route path="/test-dashboard-pet/:id" element={<DashboardPetProfile />} />
          </Route>

          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="adopt" element={<Adopt />} />
            <Route path="adopt/browse" element={<BrowseAdoptables />} />
            <Route path="adopt/pet/:id" element={<DashboardPetProfile />} />
            <Route path="adopt/apply" element={<AdoptionApplication />} />
            <Route path="sitters" element={<DashboardSitterForm />} />

            <Route path="my-pets" element={<MyPets />} />
            <Route path="my-pets/add" element={<AddEditPet />} />
            <Route path="my-pets/edit/:id" element={<AddEditPet />} />
            <Route path="my-pets/:id" element={<MyPetProfile />} />

            <Route path="ai-assistant" element={<AIAssistant />} />
            <Route path="reminders" element={<CareReminders />} />
            <Route path="my-pets/:id/add-reminder" element={<AddReminder />} />

            <Route path="medical-records" element={<MedicalRecords />} />
            <Route path="my-pets/:id/add-medical-record" element={<AddMedicalRecord />} />
            <Route
              path="my-pets/:id/medical-records/:recordId/edit"
              element={<EditMedicalRecord />}
            />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/logout' element={<Logout />} />
            <Route path='/2fa' element={<TwoFactorAuth />} />
            <Route path='/verify/:uid' element={<Verify />} />
            <Route path='/verify-email-sent' element={<VerifyEmailSentNotice />} />

            <Route path='/dashboard/*' element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<DashboardOverview />} />
              <Route path='adopt' element={<Adopt />} />
              <Route path='adopt/browse' element={<BrowseAdoptables />} />
              <Route path='adopt/pet/:id' element={<AdoptableProfile />} />
              <Route path="sitters" element={<SitterForm />} />
              <Route path="adopt" element={<PublicBrowseAdoptables />} />
              <Route path="adopt/:id" element={<PublicAdoptableProfile />} />
              <Route path="adopt-form" element={<AdoptionApplication />} />
              <Route path='my-pets' element={<MyPets />} />
              <Route path='my-pets/add' element={<AddEditPet />} />
              <Route path='my-pets/edit/:id' element={<AddEditPet />} />
              <Route path='my-pets/:id' element={<MyPetProfile />} />
              <Route path='ai-assistant' element={<AIAssistant />} />
              <Route path='reminders' element={<CareReminders />} />
              <Route path='my-pets/:id/add-reminder' element={<AddReminder />} />
              <Route path="medical-records" element={<MedicalRecords />} />
              <Route path="my-pets/:id/add-medical-record" element={<AddMedicalRecord />} />
              <Route path="my-pets/:id/medical-records/:recordId/edit" element={<EditMedicalRecord />} />

            </Route>
          </Route>

          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<UserManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="users/create" element={<UserForm />} />
            <Route path="users/:id/edit" element={<UserForm />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
