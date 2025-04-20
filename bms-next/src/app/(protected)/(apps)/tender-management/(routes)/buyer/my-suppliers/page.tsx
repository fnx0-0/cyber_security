import MySuppliersComponent from "../../../_components/buyer/my-suppliers/my-suppliers-component"
import { getRegisteredSuppliers } from "../../../_utils/buyer/my-suppliers/get-registered-suppliers"

export default async function Page(){
    
    const suppliers = await getRegisteredSuppliers()

    return (
        <>
            <MySuppliersComponent suppliers={suppliers}/>
        </>
    )
}