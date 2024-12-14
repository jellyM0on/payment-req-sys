import { HStack, SearchField, Pagination, Button } from "@freee_jp/vibes";
import { useNavigate } from "react-router";

import { AiOutlineUserAdd } from "react-icons/ai";
import { getCurrentSettingsSearch } from "../../utils/settingsPageDataUtils";

interface UsersTableHeaderProps {
  handleAddEmployee: () => void;
  pageMeta: PageMeta | null;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  pageLimit: number;
  handleSearch: (input: string) => void;
}

interface PageMeta {
  current_page: number;
  next_page: number;
  total_pages: number;
  total_count: number;
}

function UsersTableHeader({
  pageMeta,
  pageLimit,
  handleChange,
  handleAddEmployee,
  handleSearch,
}: UsersTableHeaderProps) {
  return (
    <HStack justifyContent="space-between" mb={1}>
      <HStack>
        <SearchField value={getCurrentSettingsSearch()} placeholder="Employee" onChange={(e) => handleSearch(e.target.value)}  />
        <Pagination
          onChange={handleChange}
          currentPage={pageMeta ? pageMeta.current_page : 1}
          rowCount={pageMeta?.total_count}
          rowsPerPageValue={pageLimit}
          rowsPerPageOptions={[
            { value: "10", name: "10 items" },
            { value: "20", name: "20 items" },
            { value: "50", name: "50 items" },
          ]}
        />
      </HStack>
      <Button IconComponent={AiOutlineUserAdd} onClick={handleAddEmployee}>
        Add Employee
      </Button>
    </HStack>
  );
}

interface UsersTableHeaderContainerProps {
  pageMeta: PageMeta | null;
  handlePageLimitChange: (limit: number) => void;
  pageLimit: number;
  handleSearch: (input: string) => void; 
}

function UsersTableHeaderContainer({
  pageMeta,
  handlePageLimitChange,
  pageLimit,
  handleSearch
}: UsersTableHeaderContainerProps) {
  const navigate = useNavigate();

  const handleAddEmployee = () => {
    navigate("/settings/new");
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handlePageLimitChange(Number(e.target.value));
  };

  return (
    <UsersTableHeader
      handleAddEmployee={handleAddEmployee}
      pageMeta={pageMeta}
      handleChange={handleChange}
      pageLimit={pageLimit}
      handleSearch={handleSearch}
    />
  );
}

export default UsersTableHeaderContainer;
