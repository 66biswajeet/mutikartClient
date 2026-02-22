import "@/styles/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import Header from "@/components/Header/Header";

export const metadata = {
  title: "Multikart - Modern E-Commerce",
  description: "Modern e-commerce platform with premium products",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }) {
  const adminApiUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL;
  const isProduction = process.env.NODE_ENV === 'production';
  
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
          <link 
            rel="preconnect" 
            href={adminApiUrl} 
            crossOrigin="anonymous"
          />
        )}
        
        {/* Font preload for better performance */}
        <link
          rel="preload"
          href="/assets/fonts/your-font.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <AuthProvider>
          <WishlistProvider>
            <Header />
            {children}
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
