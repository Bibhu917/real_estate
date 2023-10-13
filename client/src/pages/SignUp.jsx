import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Loadspinner from "../components/Loadspinner";

export default function SignUp() {
  const [error, setError] = useState({})
  const [isLoading, setIsLoading] = useState(false); 
  const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false);
  const [formDetails, setformDetails] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleChange = (event) => {
    setformDetails({ ...formDetails, [event.target.name]: event.target.value });
  };
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    console.log(formDetails);
    const data = {
      username: formDetails.username,
      email: formDetails.email,
      password: formDetails.password,
    };
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const response = await axios.post("/api/auth/signup",data,{headers: headers}
      );
      console.log(response);
      setIsRegistrationSuccess(true);
      if(response.data.success===true){
        setIsLoading(true);
        navigate('/sign-in')
      }
    } catch (error) {
      setIsLoading(false);
      if (error.response && error.response.data && error.response.data.errors) {
        setError(error.response.data.errors);
      }
    }
  };
  return (
    <div className="max-w-lg mx-auto p-3">
      <div className="signUpText text-center my-7">
        <h1 className="text-3xl font-semibold">Sign Up</h1>
      </div>
      <form onSubmit={handleSignupSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          className="inputBordrer border p-3 rounded-lg"
          value={formDetails.username}
          onChange={handleChange}
        />
         {error.username && (
          <span className="text-red-500 mb-2">{error.username}</span>
        )}
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          className="inputBordrer border p-3 rounded-lg"
          value={formDetails.email}
          onChange={handleChange}
        />
          {error.email && (
          <span className="text-red-500 mb-2">{error.email}</span>
        )}
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          className="inputBordrer border p-3 rounded-lg"
          value={formDetails.password}
          onChange={handleChange}
        />
           {error.password && (
          <span className="text-red-500 mb-2">{error.password}</span>
        )}
        <button
          className="bg-slate-700 p-2 my-2 rounded-lg text-white uppercase  hover:opacity-95 disabled:opacity-80"
        >
            {isLoading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
      <div className="accountParagraph flex gap-2 items-center my-2">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-700">Sign In</span>
        </Link>
      </div>
      {isLoading && <Loadspinner />} {/* Conditionally render the LoadingSpinner */}
    </div>
  );
}
