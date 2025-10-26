import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/signin" />;
  }

  let payload = null;
  try {
    payload = JSON.parse(atob(token.split('.')[1]));
  } catch {
    return <Navigate to="/signin" />;
  }

  if (!allowedRoles.includes(payload.role)) {
    return <Navigate to="/" />;
  }

  // Role matches, render children
  return children;
};

export default ProtectedRoute;
