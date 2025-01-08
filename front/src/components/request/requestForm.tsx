import {
  WithTOC,
  AccordionPanel,
  Stack,
  DescriptionList,
  SectionTitle,
  FormControlLabel,
  TextField,
  FormControlGroup,
  RadioButton,
  DateInput,
  DropdownButton,
  Text,
  Message,
  CardBase,
  ButtonGroup,
  Button,
  TextFieldType,
  FloatingMessageBlock,
  DropdownContent,
  Note,
  HStack,
  VStack,
  InlineLink,
} from "@freee_jp/vibes";

import { RequiredIcon } from "@freee_jp/vibes";
import { useState, useEffect, useRef } from "react";
import { useAuthContext } from "../../providers/authProvider";
import { useNavigate } from "react-router";

interface Request {
  vendor_name: string | null;
  vendor_address: string | null;
  vendor_tin: string | null;
  vendor_email: string | null;
  vendor_contact_num: string | null;
  vendor_certificate_of_reg: string | null;
  payment_due_date: string | null;
  payment_payable_to: string | null;
  payment_mode: string | null;
  purchase_category: string | null;
  purchase_description: string | null;
  purchase_amount: number | null;
  vendor_attachment: Attachment[] | null;
  supporting_documents: Attachment[] | null;
}

interface RequestErrors {
  vendor_name?: Array<string>;
  vendor_address?: Array<string>;
  vendor_tin?: Array<string>;
  vendor_email?: Array<string>;
  vendor_contact_num?: Array<string>;
  vendor_certificate_of_reg?: Array<string>;
  payment_due_date?: Array<string>;
  payment_payable_to?: Array<string>;
  payment_mode?: Array<string>;
  purchase_category?: Array<string>;
  purchase_description?: Array<string>;
  purchase_amount?: Array<string>;
  vendor_attachment?: Array<string>;
  supporting_documents?: Array<string>;
}

interface RequestFormProps {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangeTin: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangeAmount: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangeDate: (date: string) => void;
  handleChangeDropdown: (category: string) => void;
  handleChangeVendorAttachment: (
    attachment: Attachment[],
    editedAttachment: Attachment[],
    ids: number[]
  ) => void;
  handleChangeDocumentsAttachment: (
    attachment: Attachment[],
    editedAttachment: Attachment[],
    ids: number[]
  ) => void;
  handleSubmit: () => void;
  handleCancel: () => void;
  errors: RequestErrors | null;
  formInput: Request | null | undefined;
  existingRequest: Request | undefined;
}

// normal list item
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

// radio buttons
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
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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

// form date input
interface DateFormInputProps {
  handleChange: (date: string) => void;
  formValue: string | null | undefined;
}

const DateFormInput = ({ handleChange, formValue }: DateFormInputProps) => {
  const [date, setDate] = useState(new Date().toString());

  useEffect(() => {
    if (formValue) {
      setDate(formValue);
    }
  }, [formValue]);

  return (
    <DateInput
      onChange={(date) => {
        setDate(new Date(date).toString());
        console.log(date);
        handleChange(new Date(date).toString());
      }}
      value={date}
    />
  );
};

interface DateFormInput {
  handleChange: (date: string) => void;
  id: string;
  label: string;
  formValue?: string | null;
}

const setDateItem = ({ handleChange, id, label, formValue }: DateFormInput) => {
  return {
    title: (
      <FormControlLabel id={id}>
        {label}
        <RequiredIcon ml={0.5} />
      </FormControlLabel>
    ),
    value: <DateFormInput handleChange={handleChange} formValue={formValue} />,
  };
};

// dropdown

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
  console.log(formValue);
  console.log(typeof formValue == "string");
  const [category, setCategory] = useState(options[0].text);

  useEffect(() => {
    if (formValue) {
      const option = options.find((opt) => opt.value == formValue);
      setCategory(option!.text);
    }
  }, [formValue, options]);

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

interface DropdownFormInput {
  options: { text: string; value: string }[];
  formValue?: string | null;
  label: string;
  id: string;
  handleChange: (category: string) => void;
}

const setDropdownItem = ({
  options,
  formValue,
  label,
  id,
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
      />
    ),
  };
};

interface AttachmentInputProps {
  id: string;
  limit: number;
  formValue?: Attachment[] | null;
  handleFormUpdate: (
    attachment: Attachment[],
    editedAttachment: Attachment[],
    ids: number[]
  ) => void;
}

const AttachmentInput = ({
  id,
  limit,
  formValue,
  handleFormUpdate,
}: AttachmentInputProps) => {
  const [editMode, setEditMode] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [editedAttachments, setEditedAttachments] = useState<Attachment[]>([]);
  const [deletedAttachments, setDeletedAttachments] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (formValue) {
      setEditMode(true);
    }
  }, [formValue]);

  useEffect(() => {
    if (editMode && formValue) {
      setAttachments(formValue);
    }
  }, [editMode]);

  useEffect(() => {
    console.log(deletedAttachments);

    if (attachments.length >= 1 || editMode) {
      handleFormUpdate(
        attachments,
        editedAttachments,
        deletedAttachments
      );
    }
  }, [attachments]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const fileObj = {
        name: file.name,
        url: URL.createObjectURL(file),
        file: file,
      };
      setAttachments((prevInputs) => [...prevInputs, fileObj]);
      if (editMode)
        setEditedAttachments((prevInputs) => [...prevInputs, fileObj]);
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileDeletion = (currentAttachment: Attachment, id: number | null = null) => {
    if (editMode && id) {
      console.log("enter");
      setDeletedAttachments([...deletedAttachments, id]);
      console.log(deletedAttachments);
    }
    setAttachments((prevInputs) => prevInputs.filter((attachment) => attachment != currentAttachment));
    if(editMode){
      setEditedAttachments((prevInputs) => prevInputs.filter((attachment) => attachment != currentAttachment));
    }
  };

  return (
    <VStack justifyContent="center">
      {attachments.length <= 0 ? (
        <></>
      ) : (
        <VStack>
          {attachments.map((attachment) => (
            <HStack>
              <InlineLink href={attachment.url} target="_blank">
                {attachment.name}
              </InlineLink>
              <Button
                appearance="tertiary"
                danger
                small
                onClick={() => handleFileDeletion(attachment, attachment.id)}
              >
                x
              </Button>
            </HStack>
          ))}
        </VStack>
      )}
      <HStack gap={1}>
        <div style={{ width: "fit-content" }}>
          <input
            ref={fileInputRef}
            id={id}
            type="file"
            accept=".png,.pdf,.jpg.,.jpeg"
            hidden
            onChange={handleFileChange}
            multiple={limit > 1 ? true : false}
            disabled={attachments.length >= limit ? true : false}
          ></input>
          <label
            htmlFor={id}
            className={`vb-button vb-button--appearanceSecondary vb-button--small ${attachments.length >= limit ? "vb-button--disabled" : ""}`}
          >
            Select a File
          </label>
        </div>
      </HStack>
    </VStack>
  );
};

interface AttachmentInput {
  id: string;
  label: string;
  limit: number;
  formValue?: Attachment[] | null;
  handleFormUpdate: (
    attachment: Attachment[],
    editedAttachment: Attachment[],
    ids: number[]
  ) => void;
  errors?: Array<string>;
  message?: string;
}

interface Attachment {
  name: string;
  url: string;
  file?: File;
  id?: number;
}

const setAttachmentInput = ({
  id,
  label,
  limit,
  formValue,
  handleFormUpdate,
  message,
  errors,
}: AttachmentInput) => {
  return {
    title: (
      <FormControlLabel id={id}>
        {label}
        <RequiredIcon ml={0.5} />
      </FormControlLabel>
    ),
    value: (
      <Stack gap={0.5}>
        <HStack>
          <AttachmentInput
            id={`${id}-input`}
            limit={limit}
            formValue={formValue}
            handleFormUpdate={handleFormUpdate}
          />
          <Note>{message}</Note>
        </HStack>

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

// request form

function RequestForm({
  handleChange,
  handleChangeAmount,
  handleChangeTin,
  handleChangeDate,
  handleChangeDropdown,
  handleChangeVendorAttachment,
  handleChangeDocumentsAttachment,
  handleSubmit,
  handleCancel,
  errors,
  formInput,
}: RequestFormProps) {
  const { user } = useAuthContext();

  const [accordionState, setAccordionState] = useState([
    true,
    true,
    true,
    true,
  ]);

  function handleAccordion(index: number) {
    const newAccordionState = accordionState;
    newAccordionState[index] = newAccordionState[index] ? false : true;
    setAccordionState([...newAccordionState]);
  }

  function formatRole(dept: string | undefined) {
    if (dept && dept == "HR & Admin") return "hr_admin";
    if (dept && dept == "Accounting") return "accounting";
  }

  const contents = [
    {
      id: "request-form-requestor",
      label: "Requestor's Information",
      content: (
        <AccordionPanel
          title={<SectionTitle ml={1}>Requestor's Information</SectionTitle>}
          onClick={() => handleAccordion(0)}
          open={accordionState[0]}
        >
          <DescriptionList
            headCellMinWidth={20}
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
                type: "email",
                formValue: `${user?.email}`,
                disabled: true,
              }),
              setRadioItem({
                handleChange: handleChange,
                formValue: formatRole(user?.department),
                disabled: true,
                label: "Department",
                id: "department",
                options: [
                  {
                    name: "department",
                    label: "Technical <keiichiro-soeda@c-fo.com>",
                    value: "technical",
                  },
                  {
                    name: "department",
                    label: "HR and Admin <mendoza-cyrilleangela@c-fo.com>",
                    value: "hr_admin",
                  },
                  {
                    name: "department",
                    label: "Accounting <julieann-cosme@c-fo.com>",
                    value: "accounting",
                  },
                ],
              }),
              {
                title: "",
                value: <></>,
              },
            ]}
          />
        </AccordionPanel>
      ),
    },
    {
      id: "request-form-vendor-info",
      label: "Vendor Information",
      content: (
        <AccordionPanel
          title={<SectionTitle ml={1}>Vendor Information</SectionTitle>}
          onClick={() => handleAccordion(1)}
          open={accordionState[1]}
        >
          <DescriptionList
            headCellMinWidth={20}
            listContents={[
              setListItem({
                label: "Vendor Name",
                name: "vendor_name",
                type: "text",
                errors: errors?.vendor_name,
                formValue: formInput?.vendor_name,
                message: "Owned and Operated By or Proprietor Name",
                handleChange: handleChange,
              }),
              setListItem({
                label: "Tax Identification Number (TIN)",
                name: "vendor_tin",
                type: "text",
                errors: errors?.vendor_tin,
                formValue: formInput?.vendor_tin,
                message:
                  "Input the 1st 9-digits of TIN; for example: 010358084",
                handleChange: handleChangeTin,
              }),
              setListItem({
                label: "Address",
                name: "vendor_address",
                type: "text",
                errors: errors?.vendor_address,
                formValue: formInput?.vendor_address,
                handleChange: handleChange,
              }),
              setListItem({
                label: "Email Address",
                name: "vendor_email",
                type: "email",
                errors: errors?.vendor_email,
                formValue: formInput?.vendor_email,
                handleChange: handleChange,
              }),
              setListItem({
                label: "Contact No.",
                name: "vendor_contact_num",
                type: "text",
                errors: errors?.vendor_contact_num,
                formValue: formInput?.vendor_contact_num,
                handleChange: handleChange,
              }),
              setRadioItem({
                handleChange: handleChange,
                formValue: `${formInput?.vendor_certificate_of_reg}`,
                label: "Certificate of Registration",
                id: "vendor_certificate_of_reg",
                options: [
                  {
                    name: "vendor_certificate_of_reg",
                    label: "Applicable",
                    value: "applicable",
                  },
                  {
                    name: "vendor_certificate_of_reg",
                    label: "Not Applicable",
                    value: "n_applicable",
                  },
                ],
              }),
              setAttachmentInput({
                label: "Attachment",
                id: "vendor_attachment",
                limit: 1,
                handleFormUpdate: handleChangeVendorAttachment,
                message:
                  "You can upload 1 PDF, PNG, and JPG/JPEG file of up to 10MB.",
                errors: errors?.vendor_attachment,
                formValue: formInput?.vendor_attachment
                  ? formInput.vendor_attachment
                  : null,
              }),
              {
                title: "",
                value: <></>,
              },
            ]}
          />
        </AccordionPanel>
      ),
    },
    {
      id: "request-form-payment-instruc",
      label: "Payment Instruction",
      content: (
        <AccordionPanel
          title={<SectionTitle ml={1}>Payment Instruction</SectionTitle>}
          onClick={() => handleAccordion(2)}
          open={accordionState[2]}
        >
          <DescriptionList
            headCellMinWidth={20}
            listContents={[
              setDateItem({
                id: "payment_due_date",
                label: "Payment Due Date",
                handleChange: handleChangeDate,
                formValue: formInput?.payment_due_date,
              }),
              setListItem({
                label: "Make Payable To",
                name: "payment_payable_to",
                type: "text",
                errors: errors?.payment_payable_to,
                formValue: formInput?.payment_payable_to,
                handleChange: handleChange,
              }),
              setRadioItem({
                handleChange: handleChange,
                formValue: `${formInput?.payment_mode}`,
                label: "Payment Mode",
                id: "payment_mode",
                options: [
                  {
                    name: "payment_mode",
                    label: "Bank Transfer",
                    value: "bank_transfer",
                  },
                  {
                    name: "payment_mode",
                    label: "Credit Card",
                    value: "credit_card",
                  },
                  {
                    name: "payment_mode",
                    label: "Check",
                    value: "check",
                  },
                ],
              }),
              {
                title: "",
                value: <></>,
              },
            ]}
          />
        </AccordionPanel>
      ),
    },
    {
      id: "request-form-purchase-descrip",
      label: "Purchase Description",
      content: (
        <AccordionPanel
          mb={3}
          title={<SectionTitle ml={1}>Payment Description</SectionTitle>}
          onClick={() => handleAccordion(3)}
          open={accordionState[3]}
        >
          <DescriptionList
            headCellMinWidth={20}
            listContents={[
              setDropdownItem({
                id: "category",
                label: "Category",
                formValue: formInput?.purchase_category,
                handleChange: handleChangeDropdown,
                options: [
                  {
                    text: "Company Events and Activities",
                    value: "company_events",
                  },
                  {
                    text: "Office Events and Activities",
                    value: "office_events",
                  },
                  {
                    text: "Trainings and Seminars",
                    value: "trainings",
                  },
                  {
                    text: "Others",
                    value: "others",
                  },
                ],
              }),
              setListItem({
                label: "Description",
                name: "purchase_description",
                type: "text",
                formValue: formInput?.purchase_description,
                errors: errors?.purchase_description,
                handleChange: handleChange,
              }),
              setListItem({
                label: "Amount",
                name: "purchase_amount",
                type: "text",
                formValue: formInput?.purchase_amount?.toString(),
                errors: errors?.purchase_amount,
                message: "Values are in Php by default. Format: 20000000.00000",
                handleChange: handleChangeAmount,
              }),
              {
                title: "Supporting Documents",
                value: (
                  <Message info>
                    Supporting documents are the documents received from the
                    supplier in relation to the payment amount you are
                    requesting.
                    <br></br>
                    Ex. Quotation form from Supplier/Vendor, Contract/Proposal,
                    Sales Invoice, etc.
                  </Message>
                ),
              },
              setAttachmentInput({
                label: "Upload Supporting Documents",
                id: "supporting_documents",
                limit: 10,
                handleFormUpdate: handleChangeDocumentsAttachment,
                message:
                  "You can upload up to 10 PDF, PNG, and JPG file of maximum 10MB each.",
                errors: errors?.supporting_documents,
                formValue: formInput?.supporting_documents
                  ? formInput.supporting_documents
                  : null,
              }),
            ]}
          />
        </AccordionPanel>
      ),
    },
  ];
  return (
    <>
      <WithTOC contents={contents} />
      <div id="cardbase-btm">
        <CardBase paddingSize="large">
          <ButtonGroup align="left" ml={3}>
            <Button appearance="primary" ml={3} onClick={handleSubmit}>
              Submit
            </Button>
            <Button appearance="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </ButtonGroup>
        </CardBase>
      </div>
    </>
  );
}

interface RequestFormContainerProps {
  handleRequest: (
    requestData: Request | EditedRequest
  ) => Promise<FetchResult | null>;
  existingRequest?: Request;
  mode: string;
}

interface FetchResult {
  request?: Request;
  errors?: RequestErrors;
}

interface EditedRequest {
  vendor_name?: string | null;
  vendor_address?: string | null;
  vendor_tin?: string | null;
  vendor_email?: string | null;
  vendor_contact_num?: string | null;
  vendor_certificate_of_reg?: string | null;
  payment_due_date?: string | null;
  payment_payable_to?: string | null;
  payment_mode?: string | null;
  purchase_category?: string | null;
  purchase_description?: string | null;
  purchase_amount?: number | null;
  new_vendor_attachment?: Attachment[] | null;
  new_supporting_documents?: Attachment[] | null;
  deleted_supporting_documents?: number[] | null;
}

function RequestFormContainer({
  handleRequest,
  existingRequest,
  mode,
}: RequestFormContainerProps) {
  const { user } = useAuthContext();

  const [formInput, setFormInput] = useState<Request>({
    vendor_name: null,
    vendor_address: null,
    vendor_tin: null,
    vendor_email: null,
    vendor_contact_num: null,
    vendor_certificate_of_reg: "applicable",
    payment_due_date: new Date().toString(),
    payment_payable_to: null,
    payment_mode: "bank_transfer",
    purchase_category: "company_events",
    purchase_description: null,
    purchase_amount: null,
    vendor_attachment: null,
    supporting_documents: null,
  });

  const [editedInput, setEditedInput] = useState<EditedRequest>({});

  const [errors, setErrors] = useState<RequestErrors | null>(null);

  useEffect(() => {
    if (existingRequest) setFormInput(existingRequest);
  }, [existingRequest]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("test");
    setFormInput((prevInputs) => ({
      ...prevInputs,
      [e.target.name]: e.target.value,
    }));

    if (existingRequest) {
      setEditedInput((prevInputs) => ({
        ...prevInputs,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleChangeTin = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.match(/^\d*$/)) {
      setFormInput((prevInputs) => ({
        ...prevInputs,
        [e.target.name]: e.target.value,
      }));
    }

    if (existingRequest) {
      if (e.target.value.match(/^\d*$/)) {
        setEditedInput((prevInputs) => ({
          ...prevInputs,
          [e.target.name]: e.target.value,
        }));
      }
    }
  };

  const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.match(/^\d*\.?\d*$/)) {
      setFormInput((prevInputs) => ({
        ...prevInputs,
        [e.target.name]: e.target.value,
      }));
    }
    if (existingRequest) {
      if (e.target.value.match(/^\d*\.?\d*$/)) {
        setEditedInput((prevInputs) => ({
          ...prevInputs,
          [e.target.name]: e.target.value,
        }));
      }
    }
  };

  const handleChangeDate = (date: string | undefined) => {
    if (date) {
      setFormInput((prevInputs) => ({
        ...prevInputs,
        payment_due_date: date,
      }));
    }

    if (date && existingRequest) {
      setEditedInput((prevInputs) => ({
        ...prevInputs,
        payment_due_date: date,
      }));
    }
  };

  const handleChangeDropdown = (category: string) => {
    setFormInput((prevInputs) => ({
      ...prevInputs,
      purchase_category: category,
    }));

    if (existingRequest) {
      setEditedInput((prevInputs) => ({
        ...prevInputs,
        purchase_category: category,
      }));
    }
  };

  const handleChangeVendorAttachment = (
    attachment: Attachment[],
    newAttachment: Attachment[], 
    ids: number[]
  ) => {
    setFormInput((prevInputs) => ({
      ...prevInputs,
      vendor_attachment: attachment,
    }));

    if (existingRequest) {
      setEditedInput((prevInputs) => ({
        ...prevInputs,
        new_vendor_attachment: newAttachment ? newAttachment : null,
        deleted_vendor_attachment: ids,
      }));
    }
  };

  const handleChangeDocumentsAttachment = (
    attachments: Attachment[],
    newAttachments: Attachment[],
    ids: number[]
  ) => {
    setFormInput((prevInputs) => ({
      ...prevInputs,
      supporting_documents: attachments,
    }));

    if (existingRequest) {
      setEditedInput((prevInputs) => ({
        ...prevInputs,
        new_supporting_documents: newAttachments,
        deleted_supporting_documents: ids,
      }));
    }
    console.log(formInput);
  };

  const handleSubmit = async () => {
    if (!user) return;

    const requestData = existingRequest ? editedInput : formInput;

    console.log(editedInput);
    console.log(requestData);

    const result = await handleRequest(requestData);

    if (result && result.errors) {
      handleErrors(result.errors);
    }

    if (result && !result.errors) {
      redirectSuccess();
    }
  };

  const handleErrors = (errors: RequestErrors) => {
    setErrors(errors);
  };

  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/");
  };

  const redirectSuccess = () => {
    if (mode == "new") {
      navigate("/", {
        state: {
          hasNewRequest: true,
        },
      });
    }

    if (mode == "edit") {
      navigate("/", {
        state: {
          hasEditedRequest: true,
        },
      });
    }
  };

  return (
    <>
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

      <RequestForm
        formInput={formInput}
        existingRequest={existingRequest}
        handleChange={handleChange}
        handleChangeTin={handleChangeTin}
        handleChangeAmount={handleChangeAmount}
        handleChangeDate={handleChangeDate}
        handleChangeDropdown={handleChangeDropdown}
        handleChangeVendorAttachment={handleChangeVendorAttachment}
        handleChangeDocumentsAttachment={handleChangeDocumentsAttachment}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
        errors={errors}
      />
    </>
  );
}

export default RequestFormContainer;
