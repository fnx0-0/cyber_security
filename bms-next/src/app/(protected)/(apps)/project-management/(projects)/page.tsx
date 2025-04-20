import React from 'react'
import { getUserMapForCurrentAccount } from './components/getProjectManagerDetails';
import ProjectTable from './components/projectTable';
import TotalData from './components/totalData';

export default async function page() {
    // const projectManagersDetails = await getProjectManagerDetails();
    const usersProjectManagerGroup = await getUserMapForCurrentAccount({ groups: ["Project Manager"] });
    const activeUsersPMGrp = Object.values(usersProjectManagerGroup).filter((managerDetails) => (
        managerDetails?.userActive
    )).map((activeManagerDetails) => (
        {
            "value": activeManagerDetails?.userId,
            "label": activeManagerDetails?.userName
        }
    ))
   
    // const projectData = await AllProjectData();
    const totalData = await TotalData();
    const totalProjectData = totalData.filter((data)=>data.type==="Project")
    // console.log(totalProjectData)
    
    return (
        <>
            <ProjectTable projectmanager={activeUsersPMGrp} projectTableData={totalProjectData}/>
        </>
    )
}
