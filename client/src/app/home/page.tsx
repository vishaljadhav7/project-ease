'use client'

import Navbar from '@/components/Navbar/index';
import Sidebar from '@/components/Sidebar';
import StoreProvider from '@/app/redux';
import Router from 'next/router';

const DashboardLayout = ({children} : {children : React.ReactNode}) => {

  return (    
    <div className='flex min-h-screen w-full text-gray-900'>
      <Sidebar/>
     <main className={`w-full flex flex-col `}>
         <Navbar/>
        {children}
     </main> 
    </div>
  )
}


const DashboardWrapper = ({children} : {children : React.ReactNode}) => {
    
  return (
   <StoreProvider>
     <DashboardLayout> 
       { children}
     </DashboardLayout>
   </StoreProvider> 
  )
}


export default DashboardWrapper;