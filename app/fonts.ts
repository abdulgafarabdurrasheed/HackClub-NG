import localFont from "next/font/local";

export const phantomSans = localFont({
  src: [
    { path: "../public/font/PhantomSans0.8-Light.ttf", weight: "300", style: "normal" },
    { path: "../public/font/PhantomSans0.8-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/font/PhantomSans0.8-Italic.ttf", weight: "400", style: "italic" },
    { path: "../public/font/PhantomSans0.8-Semibold.ttf", weight: "600", style: "normal" },
    { path: "../public/font/PhantomSans0.8-Bold.ttf", weight: "700", style: "normal" },
    { path: "../public/font/PhantomSans0.8-BoldItalic.ttf", weight: "700", style: "italic" },
  ],
  variable: "--font-phantom-src",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
  preload: false,
});

export const zarathustra = localFont({
  src: "../public/font/zarathustra-kerned.ttf",
  variable: "--font-zarathustra-src",
  display: "swap",
  weight: "400",
  fallback: ["Georgia", "serif"],
  preload: false,
});
