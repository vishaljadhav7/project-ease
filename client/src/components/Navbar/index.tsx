import {Search, Settings} from 'lucide-react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { RootState } from '@/Redux/store'
import { useAppDispatch, useAppSelector } from '@/Redux/store'
import {toggleSidebarView} from '@/features/status/statusSlice'

const Navbar = () => {
  
  const dispatch = useAppDispatch();
  const {isSidebarCollapsed} = useAppSelector((state : RootState) => state.global)

  return (
    <div className="flex items-center justify-between px-4 py-2 w-full bg-slate-500">
      <div className="flex items-center gap-8">
       {isSidebarCollapsed && 
       <button onClick={()=> dispatch(toggleSidebarView(false))}>
        <Menu/>
       </button>}
        <div className="relative flex h-min w-[200px]">
          <Search className='absolute left-[4px] top-1/2 -translate-y-1/2 transform cursor-pointer'/>
          <input type="search" 
           placeholder='Search here...'
          className='w-full rounded border-none p-2 pl-8 placeholder-green-500 focus:border-transparent focus:outline-none bg-slate-100'/>
        </div> 
      </div>

      <div className="flex items-center gap-8">
        <Link 
        className='h-min w-min rounded-lg p-2 hover:bg-gray-100'
        href="/settings">
          <Settings className='h-6 w-6 cursor-pointer'/> 
        </Link>
        <div className='ml-2 mr-5 hidden min-h-[2rem] w-[0.1rem] bg-gray-200 md:inline-block'>
        </div>       
      </div>
    </div>
  )
}

export default Navbar