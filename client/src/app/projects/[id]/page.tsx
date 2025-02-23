'use client'
import { useState } from "react";

type Props = {
    params: { id: string };
  };
  
const Project = ({ params }: Props) => {
const { id } = params;

const [activeTab, setActiveTab] = useState("Board");
const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

// TaskCreationModal, ProjectTitle,  
// GridView ItemListView DataTableView TimelineView

  return <></>;
};

export default Project;
