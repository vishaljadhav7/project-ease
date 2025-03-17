import React from 'react'
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Task} from '@/features/api';
import Header from '@/components/Header';
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";

type TableViewProps = {
  setShowNewTaskModal : (isOpen: boolean) => void
  tasks : Task[]
}

const columns: GridColDef[] = [
  {
    field: "taskName",
    headerName: "Title",
    width: 100,
  },
  {
    field: "description",
    headerName: "Description",
    width: 200,
  },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    renderCell: (params) => (
      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
        {params.value}
      </span>
    ),
  },
  {
    field: "priority",
    headerName: "Priority",
    width: 75,
  },
  {
    field: "tags",
    headerName: "Tags",
    width: 130,
  },
  {
    field: "startDate",
    headerName: "Start Date",
    width: 130,
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    width: 130,
  },
  {
    field: "createdTask",
    headerName: "Author",
    width: 150,
    renderCell: (params) => params.value.userName || "Unknown",
  },
  {
    field: "assignedTo",
    headerName: "Assignee",
    width: 150,
    renderCell: (params) => params.value?.userName || "Unassigned",
  },
];

export default function TableView({setShowNewTaskModal, tasks}: TableViewProps) {
 
  return (
    <div className='h-[540px] w-full px-4 pb-8 xl:px-6'>
      <div className="pt-5">
        <Header
          name="Table"
          buttonComponent={
           <button
             className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
             onClick={() => setShowNewTaskModal(true)}
           >
             Add Task
           </button>
          }
          isSmallText
        />
      </div>
      <DataGrid
        rows={tasks || []}
        columns={columns}
        className={dataGridClassNames}
        sx={dataGridSxStyles()}
      />
    </div>
  )
}