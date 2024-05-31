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
        <div className='grid grid-cols-5 gap-10   h-screen'>
          <div className='col-span-1  w-[400px] mr-[100px]  top-0 p-4'>
            <div className='flex flex-col  bg-gray-100 w-[400px] gap-20 fixed'>
              <i className='text-3xl font-bold pt-20'>Instagram by Pushpender</i>
              <NavLink to={'/'} className='font-bold text-2xl'>🏠 Home</NavLink>
              <NavLink to={'/addPosts'} className='text-xl flex items-center'>
                <b className='ml-28'>[+]</b> Create Post
              </NavLink>
              <button onClick={logout} className='text-xl '>Log Out</button>
              {user && (
                <div className='mt-6'>
                  <span className='block'>You have Signed In As</span>
                  <p className='text-2xl text-red-600'>{user.displayName || user.email}</p>
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
