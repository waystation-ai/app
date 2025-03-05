import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: '%s | WayStation',
    default: 'Home',
  },  
  description: "Empowering LLMs to take real-world actions",
  icons: {
    icon: '/images/logo.svg',
    apple: '/images/logo.svg'
  },
  openGraph: {
    type: 'article',
    title: "WayStation",
    description: "Empowering LLMs to take real-world actions",
    siteName: "WayStation",
    url: 'https://waystation.ai',
    images : {
      url: '/images/promo-wide.png'
    }
  },
  metadataBase: process.env.NEXT_PUBLIC_APP_URL ? new URL(process.env.NEXT_PUBLIC_APP_URL) : null
};
