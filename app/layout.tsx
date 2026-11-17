import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rangga Figo Hidayat — Full-Stack Web Developer",
  description:
    "Portofolio Rangga Figo Hidayat — Full-Stack Web Developer dari Demak. Next.js, React, Laravel, MySQL, PostgreSQL, MongoDB.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%230F2A43'/><text x='50' y='68' font-size='52' font-family='Arial' font-weight='bold' fill='white' text-anchor='middle'>RF</text></svg>"
        />
      </head>
      <body>
        {/* Sakuga VFX — file asli dari finktheartist/sakuga-vfx (MIT), dipakai
            apa adanya via script tag. Urutan bebas: file pertama yang dimuat
            memasang window.SakugaFX, sisanya memakai ulang core yang sama. */}
        <Script src="/sakuga-vfx/button.js" strategy="beforeInteractive" />
        <Script src="/sakuga-vfx/progress.js" strategy="beforeInteractive" />
        <Script src="/sakuga-vfx/tooltip.js" strategy="beforeInteractive" />
        <Script src="/sakuga-vfx/toast.js" strategy="beforeInteractive" />
        {children}
      </body>
    </html>
  );
}
