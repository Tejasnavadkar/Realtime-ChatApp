import React from 'react'
import { useAuth } from '../utils/AuthContext'
import { Link } from 'react-router-dom'
import { LogOut, LogIn } from 'react-feather'

function Header() {
    const {user,handleUserLogout} = useAuth()
  return (
    <div id="header--wrapper">
    {user ? (
        <>
            Welcome {user.name}
            <LogOut className="header--link" onClick={handleUserLogout}/>
        </>
    ): (
        <>
            <Link to="/">
                <LogIn className="header--link"/>
            </Link>
        </>
    )}
</div>

  )
}

export default Header