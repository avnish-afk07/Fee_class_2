import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import SignupForm from '../components/SignupForm';
import Logo from '../components/Logo';
import '../styles/login.css';
import '../styles/signup.css';

export default function Signup() {
  return (
    <div className="auth-page signup-page">
      <Link to="/" className="auth-page-nav">
        <Logo size={26} />
      </Link>

      <Hero
        eyebrow="Join AlgoTrade"
        title="Your edge in the market starts with the right platform."
        subtitle="Create an account to access real-time data, automated strategies, and a portfolio built for serious traders."
      />

      <div className="auth-form-panel">
        <SignupForm />
      </div>
    </div>
  );
}
