import React,{useState} from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
function RegisterPage() {

    const {handleUserRegister} = useAuth()
    const [credentials, setCredentials] = useState({name:'',email:'', password1:'', password2:''})

    const handleInputChange = (e) => { // we already set it dyanamic so no matter what type of value are
        let name = e.target.name
        let value = e.target.value 
    
        setCredentials({...credentials, [name]:value})
        // console.log('CREDS:', credentials)
      }

  return (
    <div className="auth--container">
          <div className="form--wrapper">
            <form onSubmit={(e) => {handleUserRegister(e, credentials)}} >
            <div className="field--wrapper">
                <label>Name:</label>
                <input 
                  required
                  type="text" 
                  name="name"
                  value={credentials.name}
                  placeholder="Enter your name..."
                  onChange={(e) => {handleInputChange(e)}}
                />
            </div>

            <div className="field--wrapper">
                <label>Email:</label>
                <input 
                  required
                  type="email" 
                  name="email"
                  placeholder="Enter your email..."
                  value={credentials.email}
                  onChange={(e) => {handleInputChange(e)}}
                />
            </div>

              <div className="field--wrapper">
                <label>Password:</label>
                <input
                  type="password"
                  required
                  name="password1"
                  placeholder="Enter your password..."
                  value={credentials.password1}
                  onChange={handleInputChange}
                />
              </div>

              <div className="field--wrapper">
                <label>Confirm Password:</label>
                <input
                  type="password"
                  required
                  name="password2"
                  placeholder="Confirm your password..."
                  value={credentials.password2}
                  onChange={handleInputChange}
                />
              </div>
              <div className="field--wrapper">
            <input
              className="btn btn--lg btn--main"
              type="submit"
              value="Login"
              />
          </div>      
        </form>
         <p>Already have an account? Register <Link to="/login">here</Link></p>
          </div>      
    </div>
  )
}

export default RegisterPage