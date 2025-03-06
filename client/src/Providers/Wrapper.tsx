'use client'
import React from 'react'
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import AuthProvider from './AuthProvider'

export default function Wrapper({children} : {children : React.ReactNode}) {
  return (
    <div>
      <AuthProvider>
        <div className='flex min-h-screen w-full text-gray-900'>
          <Sidebar/>
          <main className={`w-full flex flex-col `}>
            <Navbar/>
            {children}
          </main> 
        </div>
      </AuthProvider>
    </div>
  )    
}