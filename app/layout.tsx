import type { Metadata } from "next";
import type { ReactNode } from "react";
import { phantomSans, zarathustra } from "./fonts";
import { themesrc } from "./theme-script";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Hack Club Nigeria — Build together",
    template: "%s · Hack Club Nigeria",
  },
  description:
    "Practical guides for starting and running teen-led Hack Clubs in Nigeria, plus a way to connect schools with local volunteers.",
  openGraph: {
    title: "Hack Club Nigeria — Build together",
    description: "Guides, local support, and school outreach for Nigeria’s teen hackers.",
    siteName: "Hack Club Nigeria",
    locale: "en_NG",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en-NG"
      className={`${phantomSans.variable} ${zarathustra.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themesrc }} />
        <link rel="icon" href="/favicon.png" />
      </head>
      <body>
        <a className="skip-to-content" href="#main-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
