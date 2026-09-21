import React from 'react';
import { InspectorProvider } from '@/components/dev/InspectorContext';
import { DevHudDock } from '@/components/dev/DevHudDock';

export const metadata = {
  title: 'Booster Friends',
  description: 'Community & Business Networking Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <InspectorProvider>
          {/* Hela appens innehåll (Header, Pages, Dashboards) */}
          {children}

          {/* Dev HUD är nu alltid tillgänglig nere i hörnet för Admins */}
          <DevHudDock />
        </InspectorProvider>
      </body>
    </html>
  );
}
