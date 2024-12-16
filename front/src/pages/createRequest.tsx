import RequestFormContainer from "../components/request/requestForm";

interface CreateRequestProps {
  handleRequest: (
    requestData: Request | EditedRequest
  ) => Promise<FetchrequestData | null>;
  mode: string;
}

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

interface Attachment {
  name: string;
  url: string;
  file?: File;
}

interface FetchrequestData {
  request?: Request;
  errors?: RequestErrors;
}

function CreateRequest({ handleRequest, mode }: CreateRequestProps) {
  return <RequestFormContainer handleRequest={handleRequest} mode={mode} />;
}

function CreateRequestContainer() {
  const createRequest = async (requestData: Request | EditedRequest) => {
    const formData = new FormData();

    for (const [key, value] of Object.entries(requestData)) {
      if (key == "vendor_attachment") {
        console.log(key, value[0].file);
        formData.append(`request[${key}]`, value[0].file);
      } else if (key == "supporting_documents") {
        value.forEach((doc: Attachment) => {
          if (doc.file) formData.append(`request[${key}][]`, doc.file);
        });
      } else {
        formData.append(`request[${key}]`, value);
        console.log(formData);
      }
    }

    try {
      const response = await fetch(`http://localhost:3000/requests`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const requestData = await response.json();

      return requestData;
    } catch (error) {
      console.log(error);
    }
  };

  return <CreateRequest handleRequest={createRequest} mode="new" />;
}

export default CreateRequestContainer;
