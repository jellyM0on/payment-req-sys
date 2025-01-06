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
import {
  getCurrentHomePageFilter,
  getCurrentHomeSearch,
} from "../../utils/homePageDataUtils";

interface RequestTableHeaderProps {
  handleAddRequest: () => void;
  pageMeta: PageMeta | null;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  pageLimit: number;
  handleFilter: (mode: string) => void;
  handleSearch: (input: string) => void;
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

interface FilterToggleInputProps {
  handleFilter: (mode: string) => void;
}

function FilterToggleInput({ handleFilter }: FilterToggleInputProps) {
  const [selectedOpt, setSelectedOpt] = useState(getCurrentHomePageFilter());
  const options: Option[] = [
    {
      value: "all",
      label: "All Requests",
    },
    {
      value: "own_approvals",
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
              handleFilter(option.value);
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
  handleFilter,
  handleSearch,
}: RequestTableHeaderProps) {
  const { user } = useAuthContext();
  return (
    <HStack justifyContent="space-between" mb={1}>
      <HStack>
        <SearchField
          value={getCurrentHomeSearch()}
          placeholder="Request"
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Pagination
          disabled={pageMeta && pageMeta?.total_count > 0 ? false : true}
          onChange={handleChange}
          currentPage={pageMeta ? pageMeta.current_page : 1}
          rowCount={pageMeta?.total_count}
          rowsPerPageValue={
            pageMeta && pageMeta.total_count > 0 ? pageLimit : 0
          }
          rowsPerPageOptions={[
            { value: "10", name: "10 items" },
            { value: "20", name: "20 items" },
            { value: "50", name: "50 items" },
          ]}
        />
        {user && user.role == "Employee" ? (
          <></>
        ) : (
          <FilterToggleInput handleFilter={handleFilter} />
        )}
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
  handleFilter: (mode: string) => void;
  handleSearch: (input: string) => void;
}

function RequestsTableHeaderContainer({
  pageMeta,
  handlePageLimitChange,
  pageLimit,
  handleFilter,
  handleSearch,
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
      handleSearch={handleSearch}
    />
  );
}

export default RequestsTableHeaderContainer;
