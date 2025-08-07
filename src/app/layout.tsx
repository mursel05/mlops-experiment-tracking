import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/assets/styles/globals.scss";
import { PrimeReactProvider } from "primereact/api";
import { DataProvider } from "@/context/ApiContext";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MLOps",
  description: "MLOps experiment tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <PrimeReactProvider>
          <DataProvider>
            {children}
          </DataProvider>
        </PrimeReactProvider>
      </body>
    </html>
  );
}
