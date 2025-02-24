'use client'

import React, { useState } from "react";
import ProjectTitle from "../projectTitle";
import GridView from "../GridView";
import TableView from "../TableView";

const Project = ({ params }: { params: Promise<{ id: string }> }) => {
  const [currentTab, setCurrentTab] = useState("Grid");
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  return (
  <div>

    {/* <ModalNewTask
       isOpen={isModalNewTaskOpen}
       onClose={() => setIsModalNewTaskOpen(false)}
       id={id}
     /> */}

    {/* {project title will be consistent} */}
    <ProjectTitle currentTab={currentTab} setCurrentTab={setCurrentTab}/> 

    {currentTab === "Grid" && (
        <GridView id={id} setShowNewTaskModal={setShowNewTaskModal} />
      )}

    {currentTab === "Table" && (
        <TableView id={id} setShowNewTaskModal={setShowNewTaskModal} />
    )}
    
  </div>
) ;
};

export default Project;