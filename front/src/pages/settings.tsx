import UsersTableContainer from "../components/settings/usersTable";
import UsersTableHeaderContainer from "../components/settings/usersTableHeader";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { FloatingMessageBlock, Text, MarginBase } from "@freee_jp/vibes";
import PageSelection from "../components/utils/pageSelection";
import {
  getCurrentSettingsPage,
  getCurrentSettingsPageLimit,
  getCurrentSettingsSearch,
  setCurrentSettingsPage,
  setCurrentSettingsPageLimit,
  setCurrentSettingsSearch,
} from "../utils/settingsPageDataUtils";

interface Users {
  id: number;
  name: string;
  email: string;
  position: string;
  department: string;
  role: string;
  manager?: Manager;
}

interface Manager {
  id: number;
  name: string;
}

interface SettingsPropsInterface {
  users: Users[] | null;
  pageMeta: PageMeta | null;
  handlePageChange: (page: number) => void;
  handlePageLimitChange: (limit: number) => void;
  pageLimit: number;
  handleSearch: (input: string) => void;
}
interface PageMeta {
  current_page: number;
  next_page: number;
  total_pages: number;
  total_count: number;
}

function Settings({
  users,
  pageMeta,
  handlePageChange,
  handlePageLimitChange,
  pageLimit,
  handleSearch,
}: SettingsPropsInterface) {
  return (
    <>
      <div id="table">
        <MarginBase>
          <UsersTableHeaderContainer
            pageLimit={pageLimit}
            pageMeta={pageMeta}
            handlePageLimitChange={handlePageLimitChange}
            handleSearch={handleSearch}
          />
          <UsersTableContainer users={users} />
        </MarginBase>
      </div>
      <PageSelection pageMeta={pageMeta} handlePageChange={handlePageChange} />
    </>
  );
}

function SettingsContainer() {
  const [users, setUsers] = useState<Users[] | null>(null);
  const [pageMeta, setPageMeta] = useState(null);
  const [pageLimit, setPageLimit] = useState(10);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const page = getCurrentSettingsPage();
    const limit = getCurrentSettingsPageLimit();
    const search = getCurrentSettingsSearch();
    setPageLimit(limit);
    setSearch(search);
    getUsers(page, limit, search);
  }, []);

  const navigate = useNavigate()

  const redirectError = () => {
    navigate('/404')
  }


  const getUsers = async (page: number, limit: number, search: string = "") => {
    try {
      const response = await fetch(
        `http://localhost:3000/users/?page=${page}&limit=${limit}&search_by=${search}`,
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
        setUsers(result.users);
        setPageMeta(result.pagination_meta);
      } else {
        redirectError(); 
      }
    } catch (error) {
      console.log(error);
      redirectError(); 
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentSettingsPage(page);
    getUsers(page, pageLimit, search);
  };

  const handlePageLimitChange = (limit: number) => {
    setPageLimit(limit);
    setCurrentSettingsPageLimit(limit);
    getUsers(1, limit, search);
  };

  const handleSearch = (input: string) => {
    setCurrentSettingsSearch(input);
    setSearch(input);
    getUsers(1, pageLimit, input);
  };

  function NewUserMsg() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isShown, setIsShown] = useState(true);

    useEffect(() => {
      if (location.state.hasNewUser == true) {
        setIsShown(false);
      } else {
        setIsShown(true);
      }
    }, [location.state]);

    const handleClose = () => {
      setIsShown(false);
      navigate("/settings", {
        state: {
          hasNewUser: false,
        },
      });
    };

    return isShown ? (
      <></>
    ) : (
      <FloatingMessageBlock success onClose={handleClose}>
        <Text>New user created successfully.</Text>
      </FloatingMessageBlock>
    );
  }

  function EditedUserMsg() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isShown, setIsShown] = useState(true);
  
    useEffect(() => {
      if (location.state.hasEditedUser == true) {
        setIsShown(false);
      } else {
        setIsShown(true);
      }
    }, [location.state]);
  
    const handleClose = () => {
      setIsShown(false);
      navigate("/settings", {
        state: {
          hasEditedUser: false,
        },
      });
    };
  
    return isShown ? (
      <></>
    ) : (
      <FloatingMessageBlock success onClose={handleClose}>
        <Text>User information edited successfully.</Text>
      </FloatingMessageBlock>
    );
  }

  const location = useLocation();

  return (
    <>
      <Settings
        users={users}
        pageMeta={pageMeta}
        handlePageChange={handlePageChange}
        pageLimit={pageLimit}
        handlePageLimitChange={handlePageLimitChange}
        handleSearch={handleSearch}
      />

      {location.state ? <NewUserMsg /> : <></>}
      {location.state ? <EditedUserMsg/> : <></>}
    </>
  );
}

export default SettingsContainer;
