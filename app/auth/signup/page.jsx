import Authnav from '@/components/auth/Navbar'
import Authbody from '@/components/auth/Authbody'

const Signup = () => {
  return (
    <div className='h-screen w-screen flex flex-col justify-start items-center'>
        <Authnav />
        <Authbody signuppage={true} />
    </div>
  )
}

export default Signup