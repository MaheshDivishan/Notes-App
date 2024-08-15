import React, { useState } from 'react'
import Navbar from '../../components/navbar/navbar';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/input/PasswordInput';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
      e.preventDefault();

      if(!name){
        setError("Please Enter Your Name");
        return;
    }

      if(!validateEmail(email)){
          setError("Please Enter a Valid Email Address");
          return;
      }
      if(!password){
          setError("Please Enter a Valid Email Address");
          return;
      }
      setError("");

              // Sign Up API Call
              try{
                const response = await axiosInstance.post("/create-account",{
                    fullName:name,
                    email:email,
                    password:password,
                });
                //Handle successful registration success
                if(response.data && response.data.error){
                    setError(response.data.message);
                    return;
                }
                if(response.data && response.data.accessToken){
                    localStorage.setItem("token",response.data.accessToken);
                    navigate("/dashboard")
                }
            }catch(error){
                setError("Login failed. Please check your credentials and try again.");
            }
    
  }


return (
  <>
  <Navbar/>
  
  <div className="flex items-center justify-center mt-28" >
      <div className="py-10 bg-white border rounded w-96 px-7">
          <form onSubmit={handleSignUp} >
              <h4 className='text-2xl mb-7'>Sign Up</h4>
              <input type="text" placeholder='Name' className='input-box'
              value={name} onChange={(e) => setName(e.target.value)} />
              <input type="text" placeholder='Email' className='input-box'
              value={email} onChange={(e) => setEmail(e.target.value)} />
              <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}/>
              {error && <p className='pb-1 text-xs text-red-500'>{error}</p>}

              <button type='submit' className='btn-primary'>
                  Create Account
              </button>
              <p className='mt-4 text-sm text-center'>
                  Already have a Account?{" "}
                  <Link to='/login' className='font-medium underline text-primary'>
                  Log In
                  </Link>
              </p> 
          </form>

      </div>
  </div>
  </>
)
}

export default SignUp;