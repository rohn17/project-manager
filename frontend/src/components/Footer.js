export default function Footer() {

  return (

    <footer className="footer">

      {/* LEFT */}
      <div className="footer-left">

        <p>
          © {new Date().getFullYear()}
          {" "}
          Project Manager
        </p>

      </div>

      {/* RIGHT */}
      <div className="footer-links">

        <span>
          Privacy
        </span>

        <span>
          Terms
        </span>

        <span>
          Support
        </span>

      </div>

    </footer>

  );
}