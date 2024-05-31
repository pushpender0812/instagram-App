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
            <div className='flex flex-cols-4 gap-48'>
              <i className='text-3xl font-bold'>Intagram</i>
              <NavLink  to={'/'}><p className='font-bold text-2xl'>🏠︎ Home</p></NavLink>
              <NavLink to={'/addPosts'}><p className='flex text-xl'> <b>[+]</b> Create</p></NavLink>
              <NavLink onClick={logout}><p>Log Out</p></NavLink>

              {user && (
                <>
                <span className=''>
                You have Signed In As <p className='text-2xl text-red-600'>{user.displayName || user.email}</p>
                </span>
                </>
              )}
              {/* <NavLink to={'/login'}><p>Login</p></NavLink> */}
              {/* <NavLink to={'/singup'}><p>Registration</p></NavLink> */}
            </div>
          )
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
