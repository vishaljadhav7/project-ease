import React , {useState} from 'react'
import Header from '@/components/Header';
import {  Filter, Grid3x3, PlusSquare, Share2, Table } from "lucide-react";

type Props = {
  currentTab: string;
  setCurrentTab: (currentTab: string) => void;
};

export default function ProjectTitle({currentTab, setCurrentTab} : Props) {

  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState<boolean>(false);

  return (
    <div className='bg-slate-300'>
      
      {/* <ModalNewProject
        isOpen={isModalNewProjectOpen}
        onClose={() => setIsModalNewProjectOpen(false)}
      /> */}

      <div className="pb-6 pt-6 lg:pb-4 lg:pt-8">            
      <Header 
        name="Product Design Development"
        buttonComponent={
          <button
            className="flex items-center rounded-md bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
            onClick={() => setIsModalNewProjectOpen(true)}
          >
            <PlusSquare className="mr-2 h-5 w-5" /> New Boards
          </button>
        }
      />
      </div>

       {/* TABS */} 
       
       <div className='flex flex-wrap-reverse gap-3 border-y border-gray-200 pb-[8px] pt-2  md:items-center'>
           <div className="flex flex-1 items-center gap-2 md:gap-4 ">
             <TabLink
              name='Grid'
              icon ={<Grid3x3 className='w-5 h-5'/>}
              setCurrentTab={setCurrentTab}
              currentTab={currentTab}
             />
             
             <TabLink
              name='Table'
              icon ={<Table className='w-5 h-5'/>}
              setCurrentTab={setCurrentTab}
              currentTab={currentTab}
             />
           </div>

           <div className="flex items-center gap-2">
              <button className="text-gray-500 hover:text-gray-600">
                <Filter className="h-5 w-5" />
              </button>

              <button className="text-gray-500 hover:text-gray-600 ">
               <Share2 className="h-5 w-5" />
              </button>

              <div className='relative'>
                 <input
                 type="text"
                 placeholder="Search Task"
                 className="rounded-md border py-1 pl-10 pr-4 focus:outline-none "
                 />
                  <Grid3x3 className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
              </div> 
           </div>
       </div>
    </div>
  )
}


type TabLinkProps = {
  name : string,
  icon : React.ReactNode,
  setCurrentTab : (currentTab : string) => void,
  currentTab : string
}

const TabLink = ({name, icon, setCurrentTab, currentTab} : TabLinkProps) => {
  const isActive = currentTab === name; 

  return (
    <button
     className={`relative flex items-center gap-2 px-1 py-2 text-gray-500  hover:text-blue-600  sm:px-2 lg:px-4 ${
      isActive ? "text-violet-600 font-bold after:bg-blue-600" : ""
    }`}
    onClick={()=> setCurrentTab(name)}
    >
      {icon}
      {name}
    </button>
  )
}