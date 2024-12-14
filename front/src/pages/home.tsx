import RequestTable from "../components/request/requestTable";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { FloatingMessageBlock, Text, MarginBase } from "@freee_jp/vibes";
import RequestsTableHeaderContainer from "../components/request/requestTableHeader";
import PageSelection from "../components/utils/pageSelection";
import {
  getCurrentHomePage,
  getCurrentHomePageFilter,
  getCurrentHomePageLimit,
  setCurrentHomePage,
  setCurrentHomePageFilter,
  setCurrentHomePageLimit,
} from "../utils/homePageDataUtils";
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
  const location = useLocation();
  const navigate = useNavigate();
  const [isShown, setIsShown] = useState(true);

  useEffect(() => {
    if (location.state.hasNewRequest == true) {
      setIsShown(false);
    } else {
      setIsShown(true);
    }
  }, [location.state]);

  const handleClose = () => {
    setIsShown(false);
    navigate("/", {
      state: {
        hasNewRequest: false,
      },
    });
  };

  return isShown ? (
    <></>
  ) : (
    <FloatingMessageBlock success onClose={handleClose}>
      <Text>Your Payment Request has been submitted successfully.</Text>
    </FloatingMessageBlock>
  );
}

function EditedRequestMsg() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isShown, setIsShown] = useState(true);

  useEffect(() => {
    if (location.state.hasEditedRequest == true) {
      setIsShown(false);
    } else {
      setIsShown(true);
    }
  }, [location.state]);

  const handleClose = () => {
    setIsShown(false);
    navigate("/", {
      state: {
        hasEditedRequest: false,
      },
    });
  };

  return isShown ? (
    <></>
  ) : (
    <FloatingMessageBlock success onClose={handleClose}>
      <Text>Your Payment Request has been edited successfully.</Text>
    </FloatingMessageBlock>
  );
}

export default function HomeContainer() {
  const [requests, setRequests] = useState(null);
  const [pageMeta, setPageMeta] = useState(null);
  const [pageLimit, setPageLimit] = useState(10);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const page = getCurrentHomePage(); 
    const limit = getCurrentHomePageLimit(); 
    const filter = getCurrentHomePageFilter(); 
    setPageLimit(limit)
    setFilter(filter)
    getRequests(page, limit, filter);
  }, []);

  const getRequests = async (
    page: number,
    limit: number,
    filtered: string = ""
  ) => {
    console.log(filtered);
    try {
      const response = await fetch(
        `http://localhost:3000/requests/?page=${page}&limit=${limit}&filter_by=${filtered}`,
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
        console.log(requests);
      }

      // return result
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentHomePage(page);
    getRequests(page, pageLimit, filter);
  };

  const handlePageLimitChange = (limit: number) => {
    setCurrentHomePage(1); 
    setPageLimit(limit);
    setCurrentHomePageLimit(limit);
    getRequests(1, limit, filter);
  };

  const handleFilter = (mode: string) => {
    if (mode == "all") {
      setFilter("all");
      setCurrentHomePageFilter("all"); 
      setCurrentHomePage(1)
      getRequests(1, pageLimit, "all");
    }

    if (mode == "own_approvals") {
      setFilter("own_approvals");
      setCurrentHomePageFilter("own_approvals"); 
      setCurrentHomePage(1)
      getRequests(1, pageLimit, "own_approvals");
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

      {location.state ? <NewRequestMsg /> : <></>}
      {location.state ? <EditedRequestMsg /> : <></>}
    </>
  );
}
