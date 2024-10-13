"use client";
import { useEffect } from 'react';
import Authnav from '@/components/auth/Navbar'
import Authbody from '@/components/auth/Authbody'
import { useSession } from 'next-auth/react';
import { useLoggedIn } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';

const Login = () => {
  const { data: session } = useSession();
  const { loggedIn } = useLoggedIn();
  const router = useRouter();

  useEffect(() => {
    if (session || loggedIn) {
      router.push('/dashboard');
    }
  }, [session, loggedIn, router]);

  if (session || loggedIn) {
    return null;
  }

  return (
    <div className='h-screen w-screen flex flex-col justify-start items-center'>
        <Authnav />
        <Authbody loginpage={true} />
    </div>
  )
}

export default Login;