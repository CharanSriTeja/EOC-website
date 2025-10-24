import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import EOCLandingPage from './components/EOCLandingPage/EOCLandingPage.jsx';
import SignIn from './components/SignIn/SignIn.jsx';
import SignUp from './components/SignUp/SignUp.jsx';
import StudentDashboard from './components/StudentDashboard/StudentDashboard.jsx';
import CoordinatorDashboard from './components/CoordinatorDashboard/CoordinatorDashboard.jsx';

import ProtectedRoute from './components/ProtectedRoute.jsx'; // import the protected route

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EOCLandingPage />} />
        <Route path="/signin" element={<SignIn setIsLoggedIn={setIsLoggedIn}/>} />
        <Route path="/signup" element={<SignUp setIsLoggedIn={setIsLoggedIn}/>} />

        {/* Protect these routes based on role */}
        <Route 
          path="/student-dashboard" 
          element={<ProtectedRoute component={StudentDashboard} role="student" setIsLoggedIn={setIsLoggedIn}/>} 
        />
        <Route 
          path="/coordinator-dashboard" 
          element={<ProtectedRoute component={CoordinatorDashboard} role="coordinator" setIsLoggedIn={setIsLoggedIn}/>} 
        />
      </Routes>
    </Router>
  );
}

export default App;
