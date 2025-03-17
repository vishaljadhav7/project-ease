'use client'
import React from 'react';
import { useGetTeamsQuery } from '@/features/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import Header from '@/components/Header';
import {
    DataGrid,
    GridColDef,
  } from "@mui/x-data-grid";


const columns: GridColDef[] = [
    { field: "id", headerName: "Team ID", width: 100 },
    { field: "teamName", headerName: "Team Name", width: 200 },
    {
      field: "projectManagerUsername",
      headerName: "Project Manager",
      width: 200,
    },
  ];

export default function TeamsPage() {
 
  const {data, isLoading, isError} = useGetTeamsQuery({userId : ""}) ;
  
  if(isLoading) return <LoadingSpinner/>
  if (isError || !data) return <div>Error fetching teams</div>;
  
  return (
    <div className="flex w-full flex-col p-8">
     <Header name="Teams"/>
     <div style={{ height: 650, width: "100%" }}>
        <DataGrid
          rows={data || []}
          columns={columns}
          pagination
        />
      </div>
   </div>
  )
}