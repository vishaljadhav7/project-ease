
import React, { useState } from 'react'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/Redux/store';

export default function AuthProvider({children}: {children : React.ReactNode}) {
  const dispatch = useAppDispatch();
  const {isAuthenticated} = useAppSelector(store => store.user)
  const [loading, setLoading] = useState(true); 
  const router = useRouter();

  useEffect(()=> {
   if(!isAuthenticated){
      router.push("/signin")
   }else{
    setLoading(false)
   }
  }, [dispatch, router, isAuthenticated])

  if(loading){
    return <h1>Loading ......</h1>
  }

  return (
    <div >
     {children}
    </div>
  )
}