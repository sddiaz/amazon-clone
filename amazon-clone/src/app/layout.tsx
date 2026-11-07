import type { Metadata } from "next";
import "./styles/globals.css";
import ProviderWrapper from "./provider";
import Navbar from "./components/Isolated/Navbar/Navbar";
import FirebaseInitializer from "@/lib/firebase/initializer";
import Footer from "./components/Isolated/Footer/Footer";

export const metadata: Metadata = {
  title: "Amazon Clone",
  description: "Santiago's Amazon Clone using JAMstack",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/apple-icon.png" />
      </head>
      <body className="antialiased">
        <div className="min-h-screen flex flex-col">
          <ProviderWrapper>
            <FirebaseInitializer />
            <Navbar />
            {children}
            <Footer />
          </ProviderWrapper>
        </div>
      </body>
    </html>
  );
}
