import React from 'react';
import Image from 'next/image';

const Learn = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Image src="/game.png" alt="Learn" width={4000} height={4000} className='h-full w-4/5' />
    </div>
  )
}

export default Learn