import {
  ListTable,
  TableRow,
  Text,
  HStack,
  IconOnlyButton,
  DropdownButton,
  ApiComboBox,
  SingleComboBoxOption,
  useApiComboBox,
} from "@freee_jp/vibes";

import { MdModeEdit } from "react-icons/md";
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
  ];

  return <ListTable headers={headerArr} rows={rows} />;
}

interface EditRoleContainerInterface {
  role: string;
  id: number;
  handleUpdate: (user: Users) => void;
}

const EditRoleContainer = ({
  role,
  id,
  handleUpdate,
}: EditRoleContainerInterface) => {
  const [isEditable, setIsEditable] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>(role);

  const handleRoleEdit = () => {
    if (isEditable) {
      setIsEditable(false);
    } else {
      setIsEditable(true);
    }
  };

  const handleRoleSelect = (selectedRole: string) => {
    setSelectedRole(selectedRole);
    updateRole(selectedRole, id);
  };

  const updateRole = async (role: string, id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ role: role.toLowerCase() }),
      });

      const result = await response.json();

      console.log(result);

      if (response.ok) {
        setIsEditable(false);
        handleUpdate(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <HStack justifyContent="space-between">
      {isEditable ? (
        <DropdownButton
          buttonLabel={selectedRole}
          dropdownContents={[
            {
              type: "selectable",
              text: "Employee",
              onClick: () => handleRoleSelect("employee"),
            },
            {
              type: "selectable",
              text: "Manager",
              onClick: () => handleRoleSelect("manager"),
            },
          ]}
        />
      ) : (
        <Text>{selectedRole}</Text>
      )}
      {role == "admin" ? (
        <></>
      ) : (
        <IconOnlyButton
          onClick={handleRoleEdit}
          label="edit"
          appearance="tertiary"
          IconComponent={MdModeEdit}
        ></IconOnlyButton>
      )}
    </HStack>
  );
};

interface EditManagerContainerProps {
  manager: Manager | null;
  id: number;
  role: string;
}

const EditManagerContainer = ({
  manager,
  id,
  role,
}: EditManagerContainerProps) => {
  const [isEditable, setIsEditable] = useState(false);
  const [selectedManagerOpt, setSelectedManagerOpt] =
    useState<SingleComboBoxOption>();
  const [selectedManager, setSelectedManager] = useState<Manager | null>(
    manager
  );

  const getManagers = async () => {
    try {
      const response = await fetch("http://localhost:3000/users/managers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const result = await response.json();

      return {
        items: result.managers,
        meta: result.pagination_meta,
      };
    } catch (error) {
      console.log(error);
    }
  };

  const updateManager = async () => {
    try {
      const response = await fetch(`http://localhost:3000/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          role: role.toLowerCase(),
          manager_id: selectedManager ? selectedManager.id : null,
        }),
      });

      const result = await response.json();

      console.log(result);

      if (response.ok) {
        console.log(result);
        setIsEditable(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const managers = useApiComboBox<Manager>({
    fetchItems: getManagers,
    createOptions: (managers: Manager[]) =>
      managers?.map(
        ({ id, name }): SingleComboBoxOption => ({
          id,
          label: name,
        })
      ),
  });

  const handleManagerEdit = () => {
    if (isEditable) {
      setIsEditable(false);
    } else {
      setIsEditable(true);
    }
  };

  const handleManagerSelect = (
    opt: SingleComboBoxOption<never> | undefined
  ) => {
    setSelectedManagerOpt(opt);

    if (opt) {
      setSelectedManager({ id: Number(opt.id), name: opt.label });
    } else {
      setSelectedManager(null);
    }
  };

  useEffect(() => {
    if (manager != selectedManager) {
      updateManager();
    }
  }, [selectedManager]);

  return (
    <HStack justifyContent="space-between">
      {isEditable ? (
        <ApiComboBox
          width="full"
          listWidth="large"
          value={selectedManagerOpt}
          placeholder="Select a Manager"
          onChange={(opt) => handleManagerSelect(opt)}
          {...managers}
        />
      ) : (
        <Text>{selectedManager ? selectedManager.name : "N/A"}</Text>
      )}
      {role == "admin" || role == "manager" ? (
        <></>
      ) : (
        <IconOnlyButton
          onClick={handleManagerEdit}
          label="edit"
          appearance="tertiary"
          IconComponent={MdModeEdit}
        ></IconOnlyButton>
      )}
    </HStack>
  );
};

function UsersTableContainer({ users }: UsersTableContainerPropsInterface) {
  const [rows, setRows] = useState<TableRow[]>([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [, setUpdatedUsers] = useState<Users[] | null>(users);

  const updateUsers = (updatedUser: Users) => {
    if (!users) return;
    const oldUserIndex = users.findIndex((cUser) => cUser.id == updatedUser.id);
    console.log(oldUserIndex);
    users[oldUserIndex] = updatedUser;
    setUpdatedUsers(users);
    console.log(users);
  };

  const handleUpdate = (updatedUser: Users) => {
    if (isUpdated) {
      setIsUpdated(false);
    } else {
      setIsUpdated(true);
    }
    updateUsers(updatedUser);
  };

  useEffect(() => {
    console.log("RERENDER");
    if (users && users.length > 0) {
      const rows = [];
      for (let i = 0; i < users.length; i++) {
        const cUser = users[i];
        console.log(cUser.manager);
        rows.push({
          cells: [
            { value: <Text>{cUser.id}</Text> },
            { value: <Text>{cUser.name}</Text> },
            {
              value: (
                <EditRoleContainer
                  role={cUser.role}
                  id={cUser.id}
                  handleUpdate={handleUpdate}
                />
              ),
            },
            { value: <Text>{cUser.email}</Text> },
            { value: <Text>{cUser.position}</Text> },
            { value: <Text>{cUser.department}</Text> },
            {
              value: (
                <EditManagerContainer
                  id={cUser.id}
                  manager={cUser.manager ? cUser.manager : null}
                  role={cUser.role}
                />
              ),
            },
          ],
        });
        setRows(rows);
      }
    } else {
      setRows([])
    }
  }, [users, isUpdated]);

  return <UsersTable rows={rows} />;
}

export default UsersTableContainer;
