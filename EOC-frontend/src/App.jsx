import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import EOCLandingPage from './components/EOCLandingPage/EOCLandingPage.jsx';
import SignIn from './components/SignIn/SignIn.jsx';
import SignUp from './components/SignUp/SignUp.jsx';
import StudentDashboard from './components/StudentDashboard/StudentDashboard.jsx';
import CoordinatorDashboard from './components/CoordinatorDashboard/CoordinatorDashboard.jsx';

import ProtectedRoute from './components/ProtectedRoute.jsx'; // import the protected route
import VerifyEmail from './components/VerifyEmail/VerifyEmail.jsx';
import VerifyEmailToken from './components/VerifyEmailToken/VerifyEmailToken.jsx';
import AdminDashboard from './components/AdminDashboard/AdminDashboard.jsx';
import ForgotPassword from './components/ForgotPassword/ForgotPassword.jsx';
import ResetPassword from './components/ResetPassword/ResetPassword.jsx';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EOCLandingPage />} />
        <Route path="/signin" element={<SignIn setIsLoggedIn={setIsLoggedIn}/>} />
        <Route path="/signup" element={<SignUp setIsLoggedIn={setIsLoggedIn}/>} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/verify-email/:token" element={<VerifyEmailToken />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        {/* Protect these routes based on role */}
        <Route 
          path="/admin" 
          element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/student-dashboard" 
          element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/coordinator-dashboard" 
          element={<ProtectedRoute allowedRoles={['coordinator']}><CoordinatorDashboard /></ProtectedRoute>} 
        />
      </Routes>
    </Router>
  );
}

export default App;
