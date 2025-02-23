"use client"
import Image from 'next/image';


export default function BodyBackground() {
  return (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -2,
  }}>
    <Image width={1440} height={900} src="/images/background.png" alt="Background" style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  }}/>
      <div className="w-[539px] h-[539px] left-[1205px] top-0 absolute bg-[#00e5a8] rounded-full blur-[400px]" />
      <div className="w-[934px] h-[934px] left-0 top-[590px] absolute bg-[#609aff] rounded-full blur-[400px]" />
  </div>

  );
}
