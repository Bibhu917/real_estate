import React,{useState} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import axios from 'axios';
import {signInStart,signInFailure,signInSuccess} from '../redux/user/userslice'
import Loadspinner from '../components/Loadspinner';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth';

export default function Signin() {
  const [loginError, setloginError] = useState({})
  // const [loginLoading, setloginLoading] = useState(false);
  // const [loginSuccess, setloginSuccess] = useState(false);
  const {loading} = useSelector((state)=>state.user)
  const [loginFormData, setloginFormData] = useState({
    email:"",
    password:""
  })
  const loginnavigate = useNavigate();
  const dispatch = useDispatch();
  const handleLoginChange = (event) =>{
    setloginFormData({...loginFormData,[event.target.name]:event.target.value})
  }
  const handleLoginSubmit=async(event)=>{
    event.preventDefault();
    const data={
      email:loginFormData.email,
      password:loginFormData.password
    }
    try {
      const response = await axios.post('/api/auth/signin',data);
      dispatch(signInStart(data));
      if(response.data.success===true){
       dispatch(signInSuccess(response.data.data));
        loginnavigate('/');
      }
    } catch (error) {
     dispatch(signInFailure());
      if(error.response && error.response.data && error.response.data.errors){
        setloginError(error.response.data.errors);
        dispatch(signInFailure(error));
      }
    }

  } 
  return (
    <div className='max-w-lg mx-auto p-3'>
      <div className="signinpage text-center my-7">
        <h1 className='text-3xl font-semibold'>Sign In</h1>
      </div>
      <form onSubmit={handleLoginSubmit} className='flex flex-col gap-2'>
      <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          className="inputBordrer border p-3 rounded-lg"
          value={loginFormData.email}
          onChange={handleLoginChange}
        />
         {loginError.email && (
          <span className="text-red-500 mb-2">{loginError.email}</span>
        )}
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          className="inputBordrer border p-3 rounded-lg"
          value={loginFormData.password}
          onChange={handleLoginChange}
        />
          {loginError.password && (
          <span className="text-red-500 mb-2">{loginError.password}</span>
        )}
            <button
          className="bg-slate-700 p-2 my-2 rounded-lg text-white uppercase  hover:opacity-95 disabled:opacity-80"
        >
           {loading ? "Signing In..." : "Sign In"}
        </button>
        <OAuth />
      </form>
      <div className="accountParagraph flex gap-2 items-center my-2">
        <p>Dont Have an account?</p>
        <Link to="/sign-up">
          <span className="text-blue-700">Sign Up</span>
        </Link>
      </div>
      {loading && <Loadspinner />}
    </div>
  )
}
