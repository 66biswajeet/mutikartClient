import "@/styles/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { CartProvider } from "@/contexts/CartContext";
import Header from "@/components/Header/Header";
import CartSlider from "@/components/CartSlider/CartSlider";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001"),
  title: "Multikart - Modern E-Commerce",
  description: "Modern e-commerce platform with premium products",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }) {
  const adminApiUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL;
  const isProduction = process.env.NODE_ENV === "production";

  return (
    <html lang="en">
      <head>
        {/* DNS prefetch for faster connection */}
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />

        {/* Only preconnect to Cloudinary if we're actually using images */}
        {isProduction && (
          <link
            rel="preconnect"
            href="https://res.cloudinary.com"
            crossOrigin="anonymous"
          />
        )}

        {/* Preconnect to admin API only in production */}
        {isProduction && adminApiUrl && (
          <link rel="preconnect" href={adminApiUrl} crossOrigin="anonymous" />
        )}
      </head>
      <body>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <Header />
              {children}
              <CartSlider />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
