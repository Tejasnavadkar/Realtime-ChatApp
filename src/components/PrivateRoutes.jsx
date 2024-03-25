import React from 'react'
import {Outlet,Navigate} from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'

function PrivateRoutes() {
  const {user} = useAuth() // here context se puchenge ki user logedin hai ya nahi here we destructure 
  return (
    <>
    {user ? <Outlet/> : <Navigate to='/login'/>}
    </>
  )
}

export default PrivateRoutes