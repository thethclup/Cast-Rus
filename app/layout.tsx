import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Cast Rush',
  description: 'Cast Rush Game',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="base:app_id" content="68f4d7adb6320e0dd0819bb3" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
