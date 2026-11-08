const THISJ_URL =
  "https://www.linkedin.com/in/mohammad-javad-moghofei-907671214/";

export default function SiteFooter() {
  return (
    <footer className="site-footer" role="contentinfo">
      <p className="site-footer__text">
        Powered by{" "}
        <a
          href={THISJ_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="site-footer__link"
        >
          ThisJ
        </a>
      </p>
    </footer>
  );
}
