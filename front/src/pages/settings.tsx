import UsersTableContainer from "../components/settings/usersTable";
import UsersTableHeaderContainer from "../components/settings/usersTableHeader";
import { useState, useEffect } from "react";
import { useLocation } from "react-router";
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

  const getUsers = async (page: number, limit: number, search: string = "") => {
    try {
      const response = await fetch(
        `http://localhost:3000/users/?page=${page}&limit=${limit}&q[name_cont]=${search}`,
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
      }
    } catch (error) {
      console.log(error);
    }
  };

  function NewUserMsg() {
    return (
      <FloatingMessageBlock success>
        <Text>New user created successfully.</Text>
      </FloatingMessageBlock>
    );
  }

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
      {location.state && location.state.hasNewUser == true ? (
        <NewUserMsg />
      ) : (
        <></>
      )}
    </>
  );
}

export default SettingsContainer;
