import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import {useSelector} from 'react-redux'

export default function Header() {
  const {currentUser} = useSelector(state=>state.user);
  console.log(currentUser);
  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex items-center justify-between max-w-7xl mx-auto p-3'>
        <div className="estate_logo">
          <Link to="/">
            <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
              <span className='text-slate-500'>Birla</span>
              <span className='text-slate-700'>Estate</span>
            </h1>
          </Link>
        </div>
        <form action="" className='bg-slate-100 p-2 rounded-lg flex items-center'>
          <input type="text" name="" id="" placeholder='Search...' className='bg-transparent focus:outline:none w-24 sm:w-64' />
          <FaSearch className='text-slate-600' />
        </form>
        <ul className='flex items-center gap-4'>
          <Link to="/">
            <li className='hidden sm:inline text-slate-700 hover:underline'>
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className='hidden sm:inline text-slate-700 hover:underline'>About</li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img className='rounded-full h-7 w-7 object-cover' src={currentUser.data.avatar} alt="" />
              ):(
              <li className='sm:inline text-slate-700 hover:underline'>Sign In</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  )
}
