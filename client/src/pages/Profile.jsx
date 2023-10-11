import React, { useState, useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import {updateUserFailure,updateUserStart,updateUserSuccess,signOutUserStart,signOutUserSuccess,signOutUserFailure} from '../redux/user/userslice'
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import axios from 'axios';
import { useRef } from "react";
import {useNavigate,Link} from 'react-router-dom'
import { app } from "../firebase";
export default function Profile() {
  const { currentUser,loading,error } = useSelector((state) => state.user);
  console.log(currentUser);
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [file, setfile] = useState(undefined);
  const [filepercent, setfilepercent] = useState(0);
  const [fileUploadError, setfileUploadError] = useState(false);
  const [updateSuccess, setupdateSuccess] = useState(false)
  const [formData, setformData] = useState({});
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setfilepercent(Math.round(progress));
      },
      (error) => {
        setfileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setformData({ ...formData, avatar: downloadURL });
        }); // <-- Missing closing parenthesis here
      }
    );
  }

  const handleProfileChange=(event)=>{
    setformData({...formData,[event.target.name]:event.target.value})
  }

  const handleProfileSubmit=async(e)=>{
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const response  = await axios.put(`/api/user/updateUser/${currentUser.data._id}`,formData);
      if(response.data.success===false){
        dispatch(updateUserFailure());
      }
      console.log(response)
      setupdateSuccess(true);
      dispatch(updateUserSuccess(response.data))
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  }

  const handleSignOut = async(e) =>{
    e.preventDefault();
    dispatch(signOutUserStart());
    try {
      const response = await axios.get('/api/auth/signOut');
      console.log(response)
      if(response.data.success===false){
        dispatch(signOutUserFailure(data.message))
        return;
      }
      dispatch(signOutUserSuccess(response.data));
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div className="profilePage max-w-lg mx-auto p-3">
      <div className="profileHeader text-center my-7">
        <h1 className="font-semibold text-3xl">Profile</h1>
      </div>
      <form onSubmit={handleProfileSubmit} className="flex flex-col gap-2">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setfile(e.target.files[0])}
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.data.avatar}
          alt="profile"
          className="rounded-full h-16 w-16 object-cover cursor-pointer self-center mt-2"
        />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filepercent > 0 && filepercent < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filepercent}%`}</span>
          ) : filepercent === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>

        <input
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          defaultValue={currentUser.data.username}
          onChange={handleProfileChange}
          className="inputBordrer border p-3 rounded-lg"
        />
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.data.email}
          onChange={handleProfileChange}
          className="inputBordrer border p-3 rounded-lg"
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          defaultValue={currentUser.data.password}
          onChange={handleProfileChange}
          className="inputBordrer border p-3 rounded-lg"
        />
        <button disabled={loading} className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          {loading?"Loading...":"Update"}
        </button>
        <Link to="/create-listing" className="bg-green-700 p-3 text-white rounded-lg uppercase text-center hover:opacity:95">Create Listing</Link>
        <div className="flex items-center justify-between">
          <span className="text-red-700 cursor-pointer">Delete Account</span>
          <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign Out</span>
        </div>
      </form>
      <p className="text-green-700 mt-2 text-center">{updateSuccess?"Updated Successfully":""}</p>
    </div>
  );
}
