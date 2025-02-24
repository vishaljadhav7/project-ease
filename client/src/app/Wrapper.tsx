'use client'
import React from 'react'
import AuthProvider from './AuthProvider'
import StoreProvider from './redux'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'

export default function Wrapper({children} : {children : React.ReactNode}) {
  return (
    <div>
      <StoreProvider>
        <AuthProvider>
        <div className='flex min-h-screen w-full text-gray-900'>
          <Sidebar/>
          <main className={`w-full flex flex-col `}>
            <Navbar/>
            {children}
          </main> 
        </div>
        </AuthProvider>
      </StoreProvider>
    </div>
  )    
}