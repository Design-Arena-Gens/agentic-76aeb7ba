export const metadata = {
  title: "Expenses",
  description: "Minimalist Expense Dashboard",
};

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-white text-gray-900 antialiased">
        <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </body>
    </html>
  );
}
