export default function Footer() {
  return (
    <div className="footer">
      <p>© {new Date().getFullYear()} Project Manager</p>

      <div className="footer-links">
        <span>Privacy</span>
        <span>Terms</span>
        <span>Support</span>
      </div>
    </div>
  );
}
