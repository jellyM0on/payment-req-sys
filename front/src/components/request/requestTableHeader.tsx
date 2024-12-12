import { 
    HStack, 
    SearchField, 
    Pagination, 
    Button, 
    ToggleButton, 
    ButtonGroup,
    FormControlGroup
} from "@freee_jp/vibes"
import { useNavigate } from "react-router";
import { useState } from "react";
import { useAuthContext } from "../../providers/authProvider";

import { MdOutlinePostAdd } from "react-icons/md";

interface UsersTableHeaderProps{
    handleAddRequest: () => void
    pageMeta: PageMeta | null
    handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    pageLimit: number
}

interface PageMeta{
    current_page: number
    next_page: number
    total_pages: number
    total_count: number
}

interface Option{
    value: string
    label: string
}

function FilterToggleInput(){
    const [selectedOpt, setSelectedOpt] = useState("all")
    const options:Option[] = [{
        value: "all", 
        label: "All Requests"
    }, 
    {
        value: "needs-approval-only", 
        label: "Needs My Approval"
    }
]

    //filter by reqs that require useers approval
    return(
        <FormControlGroup>
            <HStack gap={0}>
                {options.map((option, i) => (
                     <ToggleButton key={i} type="radio" name="filter" value={option.value}
                     toggled={selectedOpt == option.value ? true : false} 
                     onChange={(e :React.ChangeEvent<HTMLInputElement>)  => {
                        setSelectedOpt(option.value)
                        console.log("test")
                        // handleChange(e)
                     }}>{option.label}</ToggleButton>
                ))}
                {/* <ToggleButton type="radio" name="filter" toggled={true} value="all" onChange={() => console.log("all reqs")}>All Requests</ToggleButton>
                <ToggleButton type="radio" name="filter" value="my-request" onChange={() => console.log("needs")}>Needs My Approval</ToggleButton> */}
            </HStack>
        </FormControlGroup>

    )
}
  
function RequestsTableHeader({pageMeta, handleAddRequest, pageLimit, handleChange}: UsersTableHeaderProps) {
    const { user } = useAuthContext()
    return(
        <HStack justifyContent="space-between" mb={1}> 
            <HStack>
                <SearchField/> 
                <Pagination 
                onChange={handleChange}
                currentPage={pageMeta ? pageMeta.current_page : 1} 
                rowCount={pageMeta?.total_count}
                rowsPerPageValue={pageLimit}
                rowsPerPageOptions={[
                    {value: "5", name: `5 items`}, 
                    {value: "10", name: "10 items"}, 
                    {value: "20", name: "20 items"}, 
                    {value: "25", name: "25 items"}
                ]}/>
                {user && user.role == "employee" ? <></> :
                <FilterToggleInput/>
                // <FormControlGroup>
                //     <HStack gap={0}>
                //         <ToggleButton type="radio" name="filter" toggled={true} onChange={() => console.log("all reqs")}>All Requests</ToggleButton>
                //         <ToggleButton type="radio" name="filter" onChange={() => console.log("needs")}>Needs My Approval</ToggleButton>
                //     </HStack>
                // </FormControlGroup>
                }

            </HStack>
            <Button IconComponent={MdOutlinePostAdd} onClick={handleAddRequest}>Create Request</Button>
        </HStack>
    )
}

interface RequestsTableHeaderContainerProps{
    pageMeta: PageMeta | null
    handlePageLimitChange: (limit:number) => void
    pageLimit: number
}


function RequestsTableHeaderContainer({pageMeta, handlePageLimitChange, pageLimit}:RequestsTableHeaderContainerProps) {
    const navigate = useNavigate()

    const handleAddRequest= () => {
        navigate("/request/new")
    }
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        handlePageLimitChange(Number(e.target.value))
    }

    return(
        <RequestsTableHeader pageMeta={pageMeta} 
        handleAddRequest={handleAddRequest}
        handleChange={handleChange}
        pageLimit={pageLimit}/>
    )
}

export default RequestsTableHeaderContainer