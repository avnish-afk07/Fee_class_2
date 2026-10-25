import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

export default function NotFound() {
  return (
    <div className="not-found-page">
      <Link to="/" className="auth-page-nav">
        <Logo size={26} />
      </Link>
      <div className="not-found-content">
        <span className="eyebrow mono">404</span>
        <h1>This page took a wrong turn.</h1>
        <p>The page you're looking for doesn't exist or may have moved.</p>
        <Link to="/" className="btn btn-primary">
          Back to home
        </Link>
      </div>
    </div>
  );
}
