import React from 'react';
import './globals.css';
import { AppProvider } from '../lib/i18n-context';

export const metadata = {
  title: 'AGRI-INTELLIGENCE SYSTEM 360°',
  description: 'AI-Powered Agricultural Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <AppProvider children={children} />
      </body>
    </html>
  );
}