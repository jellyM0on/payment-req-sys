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

import { MdOutlinePostAdd } from "react-icons/md";

interface UsersTableHeaderProps{
    handleAddRequest: () => void
}
function RequestsTableHeader({handleAddRequest}: UsersTableHeaderProps) {
    return(
        <HStack justifyContent="space-between" mb={1}> 
            <HStack>
                <SearchField/> 
                <Pagination currentPage={1} 
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

function RequestsTableHeaderContainer() {

    const navigate = useNavigate()

    const handleAddRequest= () => {
        navigate("/request/new")
    }

    return(
        <RequestsTableHeader handleAddRequest={handleAddRequest}/>
    )
}

export default RequestsTableHeaderContainer