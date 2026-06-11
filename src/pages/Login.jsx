import LoginCard from '../components/auth/LoginCard';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Login() {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="login-bg">
      <LoginCard />
    </div>
  );
}