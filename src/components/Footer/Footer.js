"use client";

import styles from "./Footer.module.css";

const FOOTER_LINKS = {
  shop: {
    title: "Shop",
    links: [
      { name: "New Arrivals", href: "/new" },
      { name: "Best Sellers", href: "/best-sellers" },
      { name: "Sale", href: "/sale" },
      { name: "Gift Cards", href: "/gift-cards" },
    ],
  },
  help: {
    title: "Help & Support",
    links: [
      { name: "Customer Service", href: "/customer-service" },
      { name: "Track Order", href: "/track-order" },
      { name: "Returns & Refunds", href: "/returns" },
      { name: "Shipping Info", href: "/shipping" },
      { name: "FAQ", href: "/faq" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
      { name: "Blog", href: "/blog" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
    ],
  },
};

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Top Section */}
        <div className={styles.topSection}>
          <div className={styles.brandSection}>
            <h3 className={styles.logo}>LOGO</h3>
            <p className={styles.tagline}>
              Your premium destination for quality products and exceptional
              shopping experience.
            </p>
            <div className={styles.socialLinks}>
              <a href="#" aria-label="Facebook" className={styles.socialLink}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className={styles.socialLink}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 0C7.284 0 6.944.012 5.877.06 4.813.109 4.086.278 3.45.525a4.92 4.92 0 00-1.772 1.153A4.92 4.92 0 00.525 3.45C.278 4.086.109 4.813.06 5.877.012 6.944 0 7.284 0 10s.012 3.056.06 4.123c.049 1.064.218 1.791.465 2.427a4.92 4.92 0 001.153 1.772 4.92 4.92 0 001.772 1.153c.636.247 1.363.416 2.427.465C6.944 19.988 7.284 20 10 20s3.056-.012 4.123-.06c1.064-.049 1.791-.218 2.427-.465a4.92 4.92 0 001.772-1.153 4.92 4.92 0 001.153-1.772c.247-.636.416-1.363.465-2.427.048-1.067.06-1.407.06-4.123s-.012-3.056-.06-4.123c-.049-1.064-.218-1.791-.465-2.427a4.92 4.92 0 00-1.153-1.772A4.92 4.92 0 0016.55.525C15.914.278 15.187.109 14.123.06 13.056.012 12.716 0 10 0zm0 1.802c2.67 0 2.987.01 4.041.059.976.045 1.505.207 1.858.344.466.181.8.398 1.15.748.35.35.567.684.748 1.15.137.353.3.882.344 1.858.048 1.054.058 1.37.058 4.039 0 2.67-.01 2.986-.058 4.04-.045.976-.207 1.505-.344 1.858a3.097 3.097 0 01-.748 1.15c-.35.35-.684.567-1.15.748-.353.137-.882.3-1.858.344-1.054.048-1.37.058-4.041.058-2.67 0-2.987-.01-4.04-.058-.976-.045-1.505-.207-1.858-.344a3.097 3.097 0 01-1.15-.748 3.098 3.098 0 01-.748-1.15c-.137-.353-.3-.882-.344-1.858-.048-1.054-.058-1.37-.058-4.04 0-2.67.01-2.986.058-4.04.045-.976.207-1.505.344-1.858.181-.466.398-.8.748-1.15.35-.35.684-.567 1.15-.748.353-.137.882-.3 1.858-.344 1.054-.048 1.37-.058 4.04-.058z" />
                  <path d="M10 13.337A3.337 3.337 0 1110 6.663a3.337 3.337 0 010 6.674zm0-8.471a5.134 5.134 0 100 10.268 5.134 5.134 0 000-10.268zm6.538-.203a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z" />
                </svg>
              </a>
              <a href="#" aria-label="Twitter" className={styles.socialLink}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" aria-label="YouTube" className={styles.socialLink}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M19.615 5.481a2.508 2.508 0 00-1.764-1.777C16.281 3.25 10 3.25 10 3.25s-6.281 0-7.851.454A2.508 2.508 0 00.385 5.481C0 7.055 0 10 0 10s0 2.945.385 4.519a2.508 2.508 0 001.764 1.777C3.719 16.75 10 16.75 10 16.75s6.281 0 7.851-.454a2.508 2.508 0 001.764-1.777C20 12.945 20 10 20 10s0-2.945-.385-4.519zM8 12.923V7.077L13.077 10 8 12.923z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([key, section]) => (
            <div key={key} className={styles.linkColumn}>
              <h4>{section.title}</h4>
              <ul>
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a href={link.href}>{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className={styles.bottomSection}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Multikart. All rights reserved.
          </p>
          <div className={styles.paymentMethods}>
            <span>We accept:</span>
            <div className={styles.paymentIcons}>
              {["Visa", "Mastercard", "PayPal", "Apple Pay"].map((method) => (
                <span key={method} className={styles.paymentBadge}>
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
