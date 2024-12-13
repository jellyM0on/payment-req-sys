import {
  HStack,
  SearchField,
  Pagination,
  Button,
  ToggleButton,
  FormControlGroup,
} from "@freee_jp/vibes";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useAuthContext } from "../../providers/authProvider";

import { MdOutlinePostAdd } from "react-icons/md";

interface UsersTableHeaderProps {
  handleAddRequest: () => void;
  pageMeta: PageMeta | null;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  pageLimit: number;
  handleFilter: (mode:string) => void

}

interface PageMeta {
  current_page: number;
  next_page: number;
  total_pages: number;
  total_count: number;
}

interface Option {
  value: string;
  label: string;
}

interface FilterToggleInputProps{
  handleFilter: (mode:string) => void
}

function FilterToggleInput({handleFilter}: FilterToggleInputProps) {
  const [selectedOpt, setSelectedOpt] = useState("all");
  const options: Option[] = [
    {
      value: "all",
      label: "All Requests",
    },
    {
      value: "approval",
      label: "Needs My Approval",
    },
  ];

  //filter by reqs that require useers approval
  return (
    <FormControlGroup>
      <HStack gap={0}>
        {options.map((option, i) => (
          <ToggleButton
            key={i}
            type="radio"
            name="filter"
            value={option.value}
            toggled={selectedOpt == option.value ? true : false}
            onChange={() => {
              setSelectedOpt(option.value);
              handleFilter(selectedOpt)
            }}
          >
            {option.label}
          </ToggleButton>
        ))}
      </HStack>
    </FormControlGroup>
  );
}

function RequestsTableHeader({
  pageMeta,
  handleAddRequest,
  pageLimit,
  handleChange,
  handleFilter
}: UsersTableHeaderProps) {
  const { user } = useAuthContext();
  return (
    <HStack justifyContent="space-between" mb={1}>
      <HStack>
        <SearchField />
        <Pagination
          onChange={handleChange}
          currentPage={pageMeta ? pageMeta.current_page : 1}
          rowCount={pageMeta?.total_count}
          rowsPerPageValue={pageLimit}
          rowsPerPageOptions={[
            { value: "5", name: `5 items` },
            { value: "10", name: "10 items" },
            { value: "20", name: "20 items" },
            { value: "25", name: "25 items" },
          ]}
        />
        {
          user && user.role == "employee" ? <></> : <FilterToggleInput handleFilter={handleFilter} />
        }
      </HStack>
      <Button IconComponent={MdOutlinePostAdd} onClick={handleAddRequest}>
        Create Request
      </Button>
    </HStack>
  );
}

interface RequestsTableHeaderContainerProps {
  pageMeta: PageMeta | null;
  handlePageLimitChange: (limit: number) => void;
  pageLimit: number;
  handleFilter: (mode:string) => void
}

function RequestsTableHeaderContainer({
  pageMeta,
  handlePageLimitChange,
  pageLimit,
  handleFilter
}: RequestsTableHeaderContainerProps) {
  const navigate = useNavigate();

  const handleAddRequest = () => {
    navigate("/request/new");
  };
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handlePageLimitChange(Number(e.target.value));
  };

  return (
    <RequestsTableHeader
      pageMeta={pageMeta}
      handleAddRequest={handleAddRequest}
      handleChange={handleChange}
      pageLimit={pageLimit}
      handleFilter={handleFilter}

    />
  );
}

export default RequestsTableHeaderContainer;
