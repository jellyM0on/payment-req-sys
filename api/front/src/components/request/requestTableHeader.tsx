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
  
function RequestsTableHeader({pageMeta, handleAddRequest, pageLimit, handleChange}: UsersTableHeaderProps) {
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
                <FormControlGroup>
                    <HStack gap={0}>
                        <ToggleButton type="radio" name="filter" toggled={true}>All Requests</ToggleButton>
                        <ToggleButton type="radio" name="filter">Needs My Approval</ToggleButton>
                    </HStack>
                </FormControlGroup>

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