import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: '%s | WayStation',
    default: 'Home',
  },  
  description: "Empowering LLMs to take real-world actions",
  icons: {
    icon: '/images/logo-32.png',
    apple: '/images/logo-32.png'
  },
  openGraph: {
    title: "WayStation",
    description: "Empowering LLMs to take real-world actions",
    siteName: "WayStation",
    images : {
      url: '/images/named-logo-w512.png'
    },
    url: "https://waystation.ai"
  },
  metadataBase: process.env.NEXT_PUBLIC_APP_URL ? new URL(process.env.NEXT_PUBLIC_APP_URL) : null
};
