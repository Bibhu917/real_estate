import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../redux/user/userslice";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import axios from "axios";
import { useRef } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { app } from "../firebase";
export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [file, setfile] = useState(undefined);
  const [showListingError, setshowListingError] = useState(false);
  const [filepercent, setfilepercent] = useState(0);
  const [showListing, setshowListing] = useState([]);
  const [fileUploadError, setfileUploadError] = useState(false);
  const [updateSuccess, setupdateSuccess] = useState(false);
  const [formData, setformData] = useState({});
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  const param = useParams();
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
  };

  const handleProfileChange = (event) => {
    setformData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const response = await axios.put(
        `/api/user/updateUser/${currentUser.data._id}`,
        formData
      );
      if (response.data.success === false) {
        dispatch(updateUserFailure());
      }
      console.log(response);
      setupdateSuccess(true);
      dispatch(updateUserSuccess(response.data));
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const handleSignOut = async (e) => {
    e.preventDefault();
    dispatch(signOutUserStart());
    try {
      const response = await axios.get("/api/auth/signOut");
      console.log(response);
      if (response.data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(response.data));
    } catch (error) {
      console.log(error);
    }
  };
  const getFirstLetter = (name) => {
    return name ? name.charAt(0).toUpperCase() : "";
  };
  const avatarBackgroundColor = "bg-blue-500";

  const showHandleListings = async (e) => {
    try {
      setshowListingError(false);
      console.log(currentUser.rest._id);
      const response = await axios.get(
        `/api/listing/list/${currentUser.rest._id}`
      );
      console.log(response);
      if (response.data.success === false) {
        setshowListingError(true);
        return;
      }
      setshowListing(response.data.listing);
    } catch (error) {
      setshowListingError(true);
    }
  };

  const handleDeleteListing = async (listingId) => {
    try {
      console.log(currentUser.rest._id);
      const response = await axios.delete(
        `/api/listing/deletelist/${listingId}`
      );
      console.log(response);
      if (response.data.success === false) {
        console.log(response.data.message);
      }
      setshowListing((prev) =>
        prev.map((listing) => {
          if (listing._id === listingId) {
            return { ...listing, deleted: true };
          }
          return listing;
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

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
        <div className="Textwrapper">
          <div
            className={`rounded-full profilediv object-cover flex items-center justify-center text-white ${avatarBackgroundColor}`}
          >
            <div className="lletterFont">
              {getFirstLetter(currentUser.rest.username)}
            </div>
          </div>
        </div>
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filepercent > 0 && filepercent < 100 ? (
            <span className="text-slate-700">{`Uploading ${filepercent}%`}</span>
          ) : filepercent === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>

        <input
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          defaultValue={currentUser.rest.username}
          onChange={handleProfileChange}
          className="inputBordrer border p-3 rounded-lg"
        />
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.rest.email}
          onChange={handleProfileChange}
          className="inputBordrer border p-3 rounded-lg"
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          defaultValue={currentUser.rest.password}
          onChange={handleProfileChange}
          className="inputBordrer border p-3 rounded-lg"
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          to="/create-listing"
          className="bg-green-700 p-3 text-white rounded-lg uppercase text-center hover:opacity:95"
        >
          Create Listing
        </Link>
        <div className="flex items-center justify-between">
          <span className="text-red-700 cursor-pointer">Delete Account</span>
          <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
            Sign Out
          </span>
        </div>
      </form>
      <p className="text-green-700 mt-2 text-center">
        {updateSuccess ? "Updated Successfully" : ""}
      </p>
      <div className="showListings text-center">
        <button onClick={showHandleListings} className="text-green-700 w-full">
          Show Listings
        </button>
        <p className="text-red-500 mt-5">
          {showListingError ? "Error showing listings" : ""}
        </p>
        {showListing &&
          showListing.length > 0 &&
          showListing.map((listing, index) => (
            <div key={listing._id} className="">
              <Link to={`/listing/${listing._id}`}>
                {listing.imageUrls.map((imageurl, index) => (
                  <div
                    key={index}
                    className="border rounded-lg flex items-center justify-between p-3"
                  >
                    <img
                      src={imageurl}
                      alt="listing image"
                      className="h-16 w-16 object-contain rounded-lg"
                    />
                    <p className="font-semibold text-slate-700 hover:underline truncate">
                      {listing.name}
                    </p>{" "}
                    {/* Display the name from the root of the listing object */}
                    <div className="flex flex-col items-center">
                      <button
                        className="text-red-700 uppercase"
                        onClick={() => handleDeleteListing(listing._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}
