import {
  ListTable,
  TableRow,
  Text,
} from "@freee_jp/vibes";

import { useState, useEffect } from "react";

interface UsersTableContainerPropsInterface {
  users: Users[] | null;
}

interface UsersTablePropsInterface {
  rows: TableRow[];
}

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

function UsersTable({ rows }: UsersTablePropsInterface) {
  const headerArr = [
    { value: "Employee No." },
    { value: "Name" },
    { value: "Role" },
    { value: "Email" },
    { value: "Position" },
    { value: "Department" },
    { value: "Manager" },
    { value: ""}
  ];

  return <ListTable headers={headerArr} rows={rows} />;
}

function UsersTableContainer({ users }: UsersTableContainerPropsInterface) {
  const [rows, setRows] = useState<TableRow[]>([]);

  
  useEffect(() => {
    if (users && users.length > 0) {
      const rows = [];
      for (let i = 0; i < users.length; i++) {
        const cUser = users[i];
        console.log(cUser.manager);
        rows.push({
          url: `/settings/user/${cUser.id}`,
          cells: [
            { value: <Text>{cUser.id}</Text> },
            { value: <Text>{cUser.name}</Text> },
            { value: <Text>{cUser.role}</Text> },
            { value: <Text>{cUser.email}</Text> },
            { value: <Text>{cUser.position}</Text> },
            { value: <Text>{cUser.department}</Text> },
            { value: <Text>{cUser.manager ? cUser.manager.name : "TBA"}</Text> },
          ],
        });
        setRows(rows);
      }
    } else {
      setRows([]);
    }
  }, [users]);

  return <UsersTable rows={rows} />;
}

export default UsersTableContainer;
