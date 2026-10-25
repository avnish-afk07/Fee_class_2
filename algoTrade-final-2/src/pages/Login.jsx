import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import LoginForm from '../components/LoginForm';
import Logo from '../components/Logo';
import '../styles/login.css';

export default function Login() {
  return (
    <div className="auth-page">
      <Link to="/" className="auth-page-nav">
        <Logo size={26} />
      </Link>

      <Hero />

      <div className="auth-form-panel">
        <LoginForm />
      </div>
    </div>
  );
}
