'use client'

import React from 'react'


export default function AuthProvider({children}: {children : React.ReactNode}) {
  const isAuthenticated = true;
  return (
    <div >
      {isAuthenticated ? children : <>Sign In</>}
    </div>
  )
}