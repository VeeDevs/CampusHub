import { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "CampusHub",
  description: "Student economic ecosystem platform"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}
