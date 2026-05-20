import type { ModeContent } from "@/data/types";

interface FooterProps {
  modeContent: ModeContent;
}

export function Footer({ modeContent }: FooterProps) {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="brand">
          <span className="brand-mark">SV</span>
          <span>
            <span className="brand-name">SV Enterprises</span>
            <span className="brand-sub">{modeContent.brandSub}</span>
          </span>
        </div>
        <p>{modeContent.footer.copy}</p>
      </div>
    </footer>
  );
}
