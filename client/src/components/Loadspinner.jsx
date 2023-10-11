import React from 'react'
import { FaSpinner } from "react-icons/fa";

const Loadspinner = () => {
  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-gray-800 bg-opacity-50 z-50"
      style={{ backdropFilter: "blur(5px)" }}
    >
      <FaSpinner className="text-4xl text-white animate-spin" />
    </div>
  )
}

export default Loadspinner