import {
  CardBase,
  DescriptionList,
  PageTitle,
  Button,
  FormControlLabel,
  RequiredIcon,
  DropdownButton,
  ApiComboBox,
  SingleComboBoxOption,
  useApiComboBox,
  MarginBase,
  Text,
  FloatingMessageBlock,
  HStack,
  BackwardButton,
  DropdownContent,
  Message,
  VStack,
} from "@freee_jp/vibes";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

interface UserEdit {
  position?: string;
  role?: string;
  manager_id?: number;
}

interface User {
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

interface UserErrors {
  manager_id?: Array<string>;
  role?: Array<string>;
}

// list item
interface TextFormInput {
  label: string;
  name: string;
  formValue?: string | null;
}

const setListItem = ({ label, name, formValue }: TextFormInput) => {
  return {
    title: (
      <FormControlLabel mr={3} id={name}>
        {label}
      </FormControlLabel>
    ),
    value: <Text>{formValue}</Text>,
  };
};

//dropdown

interface DropdownInputProps {
  options: { text: string; value: string }[];
  formValue: string | null | undefined;
  handleChange: (category: string) => void;
}

const DropdownInput = ({
  options,
  formValue,
  handleChange,
}: DropdownInputProps) => {
  const [category, setCategory] = useState(options[0].text);

  useEffect(() => {
    if (formValue) {
      const option = options.find((opt) => opt.value == formValue);
      setCategory(option!.text);
    }
  }, [formValue]);

  const contents: DropdownContent[] = [];
  options.map((option) =>
    contents.push({
      type: "selectable",
      text: option.text,
      onClick: () => {
        setCategory(option.text);
        handleChange(option.value);
      },
    })
  );
  return <DropdownButton buttonLabel={category} dropdownContents={contents} />;
};

interface UserFormProps {
  user: User | null;
}
interface Manager {
  id: number;
  name: string;
}

function UserForm({ user }: UserFormProps) {
  const [inViewMode, setInViewMode] = useState(true);
  const [noManager, setNoManager] = useState(true);
  const [manager, setManager] = useState<SingleComboBoxOption>();
  const [formInput, setFormInput] = useState<UserEdit | null>(null);
  const [errors, setErrors] = useState<UserErrors | null>(null);

  const handleRoleChange = (role: string) => {
    setFormInput((prevInputs) => ({
      ...prevInputs,
      role: role,
    }));

    if (role == "manager") {
      setManager(undefined);
    }

    if (role == "employee" && user?.manager) {
      setManager({ id: user.manager.id, label: user.manager.name });
    }
  };

  const handleManagerChange = (manager_id: number | undefined) => {
    setFormInput((prevInputs) => ({
      ...prevInputs,
      manager_id: manager_id,
    }));
  };

  useEffect(() => {
    if (!user) return;
    setFormInput((prevInputs) => ({
      ...prevInputs,
      role: user.role,
    }));

    if (!user.manager) return;
    setManager({ id: user.manager.id, label: user.manager.name });
  }, [user]);

  useEffect(() => {
    if (
      (formInput?.role == "employee" && !inViewMode) ||
      (user?.role == "employee" && formInput == null && !inViewMode)
    ) {
      setNoManager(false);
    } else {
      setNoManager(true);
    }
  }, [formInput, inViewMode]);

  const getManagers = async () => {
    try {
      const response = await fetch("http://localhost:3000/managers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      console.log("test");

      const result = await response.json();

      const filteredManagers = result.managers.filter(
        (manager: Manager) => manager.id !== user?.id
      );

      return {
        items: filteredManagers,
        meta: result.pagination_meta,
      };
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

  const navigate = useNavigate();

  const redirectSuccess = () => {
    navigate("/settings", {
      state: {
        hasEditedUser: true,
      },
    });
  };

  const handleSubmit = () => {
    console.log(formInput);
    updateUser();
  };

  const updateUser = async () => {
    if (!user) return;
    try {
      const response = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formInput),
      });

      const result = await response.json();

      if (response.ok) {
        redirectSuccess();
      } else if (result.error) {
        setErrors(result.error);
        console.log(result.error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <CardBase paddingSize="small" overflowHidden={false}>
      {errors == null ? (
        <></>
      ) : (
        <FloatingMessageBlock error>
          <Text>
            There was an issue with your submission. Please check the
            highlighted fields and try again.
          </Text>
        </FloatingMessageBlock>
      )}

      <MarginBase mt={2} mb={2}>
        <HStack justifyContent="space-between" mr={2} mb={2}>
          <PageTitle ml={1}>{`User ID: ${user?.id}`}</PageTitle>
          {!user || user?.role == "admin" ? null : (
            <HStack>
              <BackwardButton url="/settings">Back to Home</BackwardButton>
              <Button
                appearance="primary"
                onClick={() => {
                  if (inViewMode) {
                    setInViewMode(false);
                  } else {
                    handleSubmit();
                  }
                }}
              >
                {inViewMode ? "Edit" : "Submit"}
              </Button>
              {inViewMode ? (
                <></>
              ) : (
                <Button
                  onClick={() => {
                    setInViewMode(true);

                    //reset
                    if (!user) return;
                    setFormInput((prevInputs) => ({
                      ...prevInputs,
                      role: user.role,
                    }));

                    if (!user.manager) return;
                    setManager({
                      id: user.manager.id,
                      label: user.manager.name,
                    });
                  }}
                >
                  Cancel
                </Button>
              )}
            </HStack>
          )}
        </HStack>

        <div id="user-edit-form">
          <DescriptionList
            listContents={[
              setListItem({
                label: "Name",
                name: "name",
                formValue: `${user?.name}`,
              }),
              setListItem({
                label: "Email",
                name: "email",
                formValue: `${user?.email}`,
              }),
              setListItem({
                label: "Position",
                name: "email",

                formValue: `${user?.position}`,
              }),
              setListItem({
                label: "Department",
                name: "department",
                formValue: user?.department,
              }),
              {
                title: (
                  <FormControlLabel htmlFor="manager" mr={3}>
                    Role {inViewMode ? null : <RequiredIcon ml={0.5} />}
                  </FormControlLabel>
                ),
                value: inViewMode ? (
                  <Text>{user?.role}</Text>
                ) : (
                  <VStack>
                    <DropdownInput
                      formValue={user?.role}
                      handleChange={handleRoleChange}
                      options={[
                        { text: "Employee", value: "employee" },
                        { text: "Manager", value: "manager" },
                      ]}
                    />
                    {errors?.role ? (
                      <Message error>
                        <Text size={0.75}>{errors.role}</Text>
                      </Message>
                    ) : null}
                  </VStack>
                ),
              },
              {
                title: (
                  <FormControlLabel htmlFor="manager" mr={3}>
                    Manager
                    {inViewMode == false && formInput?.role == "employee" ? (
                      <RequiredIcon ml={0.5} />
                    ) : null}
                  </FormControlLabel>
                ),
                value: inViewMode ? (
                  <Text>{`${user && user.manager ? user.manager.name : "N/A"}`}</Text>
                ) : (
                  <VStack>
                    <ApiComboBox
                      width="large"
                      listWidth="large"
                      value={manager}
                      disabled={noManager}
                      placeholder="Select a Manager"
                      onChange={(opt) => {
                        if (opt) {
                          setManager(opt);
                          handleManagerChange(Number(opt.id));
                        } else {
                          setManager(undefined);
                          handleManagerChange(undefined);
                        }
                      }}
                      {...managers}
                    />
                    {errors?.manager_id ? (
                      <Message error>
                        <Text size={0.75}>{errors.manager_id}</Text>
                      </Message>
                    ) : null}
                  </VStack>
                ),
              },
            ]}
            spacing="normal"
          />
        </div>
      </MarginBase>
    </CardBase>
  );
}

export default UserForm;
