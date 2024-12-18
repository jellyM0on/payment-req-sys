import {
  CardBase,
  DescriptionList,
  TextField,
  Button,
  FormControlLabel,
  RequiredIcon,
  RadioButton,
  FormControlGroup,
  DropdownButton,
  ApiComboBox,
  SingleComboBoxOption,
  useApiComboBox,
  Stack,
  MarginBase,
  Text,
  Message,
  FloatingMessageBlock,
  HStack,
  BackwardButton,
  Note,
  TextFieldType,
  DropdownContent,
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
  name?: Array<string>;
  email?: Array<string>;
  position?: Array<string>;
  department?: Array<string>;
  manager_id?: Array<string>;
  role?: Array<string>;
}

interface TextFormInput {
  label: string;
  name: string;
  type: TextFieldType;
  errors?: Array<string>;
  formValue?: string | null;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  message?: string;
}

const setListItem = ({
  label,
  name,
  type,
  errors,
  formValue,
  disabled,
  message,
  handleChange,
}: TextFormInput) => {
  return {
    title: (
      <FormControlLabel mr={3} id={name}>
        {label}
        <RequiredIcon ml={0.5} />
      </FormControlLabel>
    ),
    value: (
      <Stack gap={0.5}>
        <TextField
          name={name}
          type={type}
          onChange={handleChange}
          disabled={disabled}
          value={formValue ? formValue : ""}
          error={errors ? true : false}
          width="large"
          required
        />
        {message ? <Note>{message}</Note> : null}
        {errors ? (
          errors.map((msg) => (
            <Message error>
              <Text size={0.75}>{msg}</Text>
            </Message>
          ))
        ) : (
          <></>
        )}
      </Stack>
    ),
  };
};

interface DropdownInputProps {
  options: { text: string; value: string }[];
  formValue: string | null | undefined;
  handleChange: (category: string) => void;
  disabled: boolean;
}

const DropdownInput = ({
  options,
  formValue,
  handleChange,
  disabled,
}: DropdownInputProps) => {
  console.log(formValue);
  console.log(typeof formValue == "string");
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
  return (
    <DropdownButton
      buttonLabel={category}
      dropdownContents={contents}
      disabled={disabled}
    />
  );
};

interface DropdownFormInput {
  options: { text: string; value: string }[];
  formValue?: string | null;
  label: string;
  id: string;
  handleChange: (category: string) => void;
  disabled: boolean;
}

const setDropdownItem = ({
  options,
  formValue,
  label,
  id,
  disabled,
  handleChange,
}: DropdownFormInput) => {
  return {
    title: (
      <FormControlLabel id={id}>
        {label}
        <RequiredIcon ml={0.5} />
      </FormControlLabel>
    ),
    value: (
      <DropdownInput
        options={options}
        formValue={formValue}
        handleChange={handleChange}
        disabled={disabled}
      />
    ),
  };
};

interface RadioContainerProps {
  options: { name: string; value: string; label: string; checked?: boolean }[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  formValue?: string;
}

const RadioContainer = ({
  options,
  handleChange,
  disabled,
  formValue,
}: RadioContainerProps) => {
  console.log(formValue);
  const [selectedOpt, setSelectedOpt] = useState(
    formValue ? formValue : options[0].value
  );

  useEffect(() => {
    if (formValue) {
      setSelectedOpt(formValue);
    }
  }, [formValue]);

  return (
    <FormControlGroup>
      <Stack gap={0}>
        {options.map((option, i) => (
          <RadioButton
            name={option.name}
            disabled={disabled}
            value={option.value}
            key={i}
            checked={selectedOpt == option.value ? true : false}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (disabled) return;
              setSelectedOpt(option.value);
              handleChange(e);
            }}
          >
            {option.label}
          </RadioButton>
        ))}
      </Stack>
    </FormControlGroup>
  );
};

interface RadioFormInput {
  options: { name: string; value: string; label: string; checked?: boolean }[];
  label: string;
  id: string;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  formValue?: string;
}

const setRadioItem = ({
  options,
  label,
  id,
  disabled,
  formValue,
  handleChange,
}: RadioFormInput) => {
  return {
    title: (
      <FormControlLabel id={id} mr={3}>
        {label}
        <RequiredIcon ml={0.5} />
      </FormControlLabel>
    ),
    value: (
      <RadioContainer
        options={options}
        handleChange={handleChange}
        disabled={disabled}
        formValue={formValue?.toLowerCase()}
      />
    ),
  };
};

interface UserFormProps {
  user: User | null;
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
    console.log(formInput);
  };

  const handleManagerChange = (manager_id: number|undefined) => {
    setFormInput((prevInputs) => ({
        ...prevInputs,
        manager_id: manager_id,
      }));
      console.log(formInput);
  }

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

      return {
        items: result.managers,
        meta: result.pagination_meta,
      };
    } catch (error) {
      console.log(error);
    }
  };

  interface Manager {
    id: number;
    name: string;
  }

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

//   useEffect(() => {
//     if(user && user.manager){
//         const manager = managers.options.find((opt) => opt.id == user.manager?.id)
//         setManager(manager)
//     }
//     console.log({...managers})
//   }, [managers])


  const navigate = useNavigate();

  const redirectSuccess = () => {
    navigate("/settings", {
      state: {
        hasNewUser: true,
      },
    });
  };

  return (
    <CardBase paddingSize="zero" overflowHidden={false}>
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
        <HStack justifyContent="end" ma={2}>
          <BackwardButton>Back to Home</BackwardButton>
          <Button
            appearance="primary"
            onClick={() => {
              if (inViewMode) {
                setInViewMode(false);
              } else {
                //handle save
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
              }}
            >
              Cancel
            </Button>
          )}
        </HStack>

        <div id="user-edit-form">
          <DescriptionList
            listContents={[
              setListItem({
                label: "Name",
                name: "name",
                type: "text",
                formValue: `${user?.name}`,
                disabled: true,
              }),
              setListItem({
                label: "Email",
                name: "email",
                type: "text",
                formValue: `${user?.email}`,
                disabled: true,
              }),
              setListItem({
                label: "Position",
                name: "email",
                type: "text",
                formValue: `${user?.position}`,
                disabled: true,
              }),
              setRadioItem({
                handleChange: () => console.log("test"),
                disabled: true,
                formValue: `${user?.department}`,
                label: "Department",
                id: "department",
                options: [
                  {
                    name: "department",
                    label: "Technical",
                    value: "technical",
                  },
                  {
                    name: "department",
                    label: "HR & Admin",
                    value: "hr_admin",
                  },
                  {
                    name: "department",
                    label: "Accounting",
                    value: "accounting",
                  },
                ],
              }),
              setDropdownItem({
                id: "role",
                label: "Role",
                disabled: inViewMode,
                formValue: user?.role,
                handleChange: handleRoleChange,
                options: [
                  {
                    text: "Employee",
                    value: "employee",
                  },
                  {
                    text: "Manager",
                    value: "manager",
                  },
                ],
              }),
              {
                title: (
                  <FormControlLabel htmlFor="manager" mr={3}>
                    Manager <RequiredIcon ml={0.5} />
                  </FormControlLabel>
                ),
                value: (
                  <ApiComboBox
                    width="full"
                    listWidth="large"
                    value={manager}
                    disabled={noManager}
                    placeholder="Select a Manager"
                    onChange={(opt) => {
                      if (opt) {
                        setManager(opt);
                        handleManagerChange(Number(opt.id))
                      } else {
                        setManager(undefined);
                        handleManagerChange(undefined)
                      }
                    }}
                    {...managers}
                  />
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
