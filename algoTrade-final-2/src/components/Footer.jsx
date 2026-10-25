import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <Logo size={22} />
        <div className="footer-links">
          <a href="#product">Product</a>
          <a href="#security">Security</a>
          <a href="#docs">Docs</a>
          <a href="#contact">Contact</a>
        </div>
        <span className="footer-copy">© {new Date().getFullYear()} AlgoTrade. All rights reserved.</span>
      </div>
    </footer>
  );
}
