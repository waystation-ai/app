import { SignIn } from '@clerk/nextjs'

import { Metadata } from 'next';
import Head from 'next/head';
 
export const metadata: Metadata = {
  title: 'Sign In or Sign Up | WayStation',
  openGraph: {
    type: 'website',
    title: "Sign In or Sign Up | WayStation",
    siteName: "WayStation",
    url: `/sign-in`,
    images : {
      url: '/images/promo-wide.png'
    }
  }
};

export default function Page() {
  return <div className="flex flex-col  mt-4 sm:mt-20 justify-center items-center">
      <Head>
        <link rel="canonical" href="/sign-in" />
      </Head>
      <SignIn />
    </div>
}
