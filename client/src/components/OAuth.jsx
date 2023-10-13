// import React from 'react'
// import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
// import axios from 'axios';
// import { app } from '../firebase';
// import {Navigate, useNavigate} from 'react-router-dom'
// import {useDispatch} from "react-redux"
// import {signInStart,signInSuccess,signInFailure} from '../redux/user/userslice'
// export default function OAuth() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//     const handleGoogle = async(e)=>{
//         e.preventDefault();
//         try {
//             const provider = new GoogleAuthProvider();
//             const auth  = getAuth(app);
//             const result  = await signInWithPopup(auth,provider);
//             const data = {
//               name:result.user.displayName,
//               email:result.user.email,
//               photo:result.user.photoURL
//             }
//             const headers={
//               'Content-Type': 'application/json'
//             }
//             const resposne  = await axios.post('/api/auth/google',data,{headers:headers});
//             dispatch(signInSuccess(resposne))
//             navigate('/')
//         } catch (error) {
//             console.log('Could not signed with google',error)
//         }
//     }
//   return (
//     <button onClick={handleGoogle} type='button' className='bg-red-700 text-white p-2 rounded-lg uppercase'>Continue with google</button>
//   )
// }
