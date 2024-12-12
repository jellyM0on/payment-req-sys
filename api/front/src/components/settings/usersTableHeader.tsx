import { 
    HStack, 
    SearchField, 
    Pagination, 
    Button
} from "@freee_jp/vibes"
import { useNavigate } from "react-router";

import { AiOutlineUserAdd } from "react-icons/ai";

interface UsersTableHeaderProps{
    handleAddEmployee: () => void
}
function UsersTableHeader({handleAddEmployee}: UsersTableHeaderProps) {
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
            </HStack>
            <Button IconComponent={AiOutlineUserAdd} onClick={handleAddEmployee}>Add Employee</Button>
        </HStack>
    )
}

function UsersTableHeaderContainer() {

    const navigate = useNavigate()

    const handleAddEmployee = () => {
        navigate("/settings/new")
    }

    return(
        <UsersTableHeader handleAddEmployee={handleAddEmployee}/>
    )
}

export default UsersTableHeaderContainer