import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, role: Role ,...rest}) => {
  const token = localStorage.getItem('token');
  if (!token) {
    // No token, redirect to sign-in
    return <Navigate to="/signin" />;
  }

  const payload = JSON.parse(atob(token.split('.')[1]));
  if (payload.role !== Role) {
    // Role doesn't match, redirect to home or sign-in
    return <Navigate to="/" />;
  }

  // Role matches, render component
  return <Component {...rest}/>;
};

export default ProtectedRoute;
