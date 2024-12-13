import RequestTable from "../components/request/requestTable";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { FloatingMessageBlock, Text, MarginBase } from "@freee_jp/vibes";
import RequestsTableHeaderContainer from "../components/request/requestTableHeader";
import PageSelection from "../components/utils/pageSelection";
interface HomePropsInterface {
  requests: Request[] | null;
  pageMeta: PageMeta | null;
  handlePageChange: (page: number) => void;
  handlePageLimitChange: (limit: number) => void;
  pageLimit: number;
  handleFilter: (mode: string) => void;
}

interface PageMeta {
  current_page: number;
  next_page: number;
  total_pages: number;
  total_count: number;
}

interface Request {
  id: number;
  overall_status: string;
  user: User;
  purchase_category: string;
  department: string;
  current_stage: string;
  approvals: Approval[];
}

interface User {
  department: string;
  name: string;
}

interface Approval {
  reviewer: { name: string };
  stage: string;
}

function Home({
  requests,
  pageMeta,
  handlePageChange,
  handlePageLimitChange,
  pageLimit,
  handleFilter,
}: HomePropsInterface) {
  return (
    <>
      <MarginBase mb={3}>
        <RequestsTableHeaderContainer
          pageLimit={pageLimit}
          pageMeta={pageMeta}
          handlePageLimitChange={handlePageLimitChange}
          handleFilter={handleFilter}
        />
        <RequestTable requests={requests} />
      </MarginBase>

      <PageSelection pageMeta={pageMeta} handlePageChange={handlePageChange} />
    </>
  );
}

function NewRequestMsg() {
  return (
    <FloatingMessageBlock success onClose={() => {}}>
      <Text>Your Payment Request has been submitted successfully.</Text>
    </FloatingMessageBlock>
  );
}

function EditedRequestMsg() {
  return (
    <FloatingMessageBlock success onClose={() => {}}>
      <Text>Your Payment Request has been edited successfully.</Text>
    </FloatingMessageBlock>
  );
}

export default function HomeContainer() {
  const [requests, setRequests] = useState(null);
  const [pageMeta, setPageMeta] = useState(null);
  const [pageLimit, setPageLimit] = useState(5);

  useEffect(() => {
    getRequests(1, 5, "false");
    console.log(requests);
    console.log(pageMeta);
  }, []);

  const getRequests = async (page: number, limit: number, filtered: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/requests/?page=${page}&limit=${limit}&filter_approvals=${filtered}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const result = await response.json();

      if (response.ok) {
        setRequests(result.requests);
        setPageMeta(result.pagination_meta);
      }

      // return result
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (page: number) => {
    getRequests(page, pageLimit, "false");
  };

  const handlePageLimitChange = (limit: number) => {
    setPageLimit(limit);
    getRequests(1, limit, "false");
  };

  const handleFilter = (mode: string) => {
    console.log(mode);
    if (mode == "all") {
      getRequests(1, pageLimit, "false");
    }

    if (mode == "approval") {
      getRequests(1, pageLimit, "true");
    }
  };

  const location = useLocation();

  return (
    <>
      <Home
        requests={requests}
        pageMeta={pageMeta}
        pageLimit={pageLimit}
        handlePageChange={handlePageChange}
        handlePageLimitChange={handlePageLimitChange}
        handleFilter={handleFilter}
      />
      {location.state && location.state.hasNewRequest == true ? (
        <NewRequestMsg />
      ) : (
        <></>
      )}
      {location.state && location.state.hasEditedRequest == true ? (
        <EditedRequestMsg />
      ) : (
        <></>
      )}
    </>
  );
}
