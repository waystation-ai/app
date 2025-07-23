import { SignIn } from '@clerk/nextjs'

import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Sign In or Sign Up',
  alternates: {
    canonical: 'https://waystation.ai/sign-in',
  },
  openGraph: {
    type: 'website',
    title: "Sign In or Sign Up",
    siteName: "WayStation",
    url: `/sign-in`,
    images : {
      url: '/images/promo-wide.png'
    }
  }
};

export default function Page() {
  return <div className="flex flex-col  mt-4 sm:mt-20 justify-center items-center">
      <SignIn />
    </div>
}
