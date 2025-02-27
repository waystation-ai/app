import { SignIn } from '@clerk/nextjs'

import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Sign In - WayStation',
};

export default function Page() {
  return <div className="flex flex-col  mt-4 sm:mt-20 justify-center items-center"><SignIn fallbackRedirectUrl='/dashboard' /></div>
}
