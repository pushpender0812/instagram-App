import React from 'react'
import { NavLink,useNavigate } from 'react-router-dom'
import { useFirebase } from '../context/Firebase'
import {useAuthState} from 'react-firebase-hooks/auth'
import { firebaseAuth } from '../context/Firebase'



const Navbar = () => {

  const [user] = useAuthState(firebaseAuth)

    const firebase = useFirebase()
    // console.log(firebase);

    const navigate = useNavigate()

    const logout = () => {
        firebase.userLogOut()
        alert("Logout Success")
        navigate('login')
    }

    if (firebase.isLoggedIn) {
      return (
        <div className='grid grid-cols-5 gap-4 h-screen'>
          {/* Sidebar */}
          <div className='col-span-1 fixed top-0 left-0 h-full bg-gray-100 p-4 md:w-[150px] w-[80px]'>
            <div className='flex flex-col gap-6'>
              <i className='md:text-3xl text-xl font-bold pt-20'>Instagram by Pushpender</i>
              <NavLink to={'/'} className='font-bold md:text-2xl text-sm'>🏠 Home</NavLink>
              <NavLink to={'/addPosts'} className='text-xl flex items-center'>
                <b className='md:ml-0 ml-2'>[+]</b>
                <span className='md:inline hidden'>Create Post</span>
              </NavLink>
              <button onClick={logout} className='md:text-xl md:text-left text-sm text-left'>Log Out</button>
              {user && (
                <div className='mt-6'>
                  <span className='block md:text-base text-xs'>You have Signed In As</span>
                  <p className='md:text-2xl text-sm text-red-600'>{user.displayName || user.email}</p>
                </div>
              )}
            </div>
          </div>
          
         
        </div>
      );
    }

  return (
    <div className='flex flex-cols-4 gap-64'>
      {/* <NavLink  to={'/'}><p className="font-ectrabold" >🏠︎ Home</p></NavLink> */}
      {/* <NavLink to={'/addPosts'}><p>Add Post</p></NavLink> */}
      <NavLink to={'/login'}><p>Login</p></NavLink>
      <NavLink to={'/singup'}><p>Registration</p></NavLink>
    </div>
  )
}

export default Navbar
