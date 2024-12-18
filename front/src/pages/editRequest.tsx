import RequestFormContainer from "../components/request/requestForm";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";

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

interface Attachment {
  name: string;
  url: string;
  file?: File;
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

interface FetchResult {
  request?: Request;
  errors?: RequestErrors;
}

interface EditRequestProps {
  handleRequest: (requestData: Request | EditedRequest) => Promise<FetchResult>;
  existingRequest: Request | undefined;
  mode: string;
}

function EditRequest({
  handleRequest,
  existingRequest,
  mode,
}: EditRequestProps) {
  return (
    <RequestFormContainer
      handleRequest={handleRequest}
      existingRequest={existingRequest}
      mode={mode}
    />
  );
}

function EditRequestContainer() {
  const [request, setRequest] = useState<Request | null>(null);
  const { id } = useParams();

  const editRequest = async (requestData: Request | EditedRequest) => {
    console.log(requestData);

    const formData = new FormData();

    for (const [key, value] of Object.entries(requestData)) {
      if (key == "new_vendor_attachment") {
        if (!value[0]) continue;
        formData.append(`request[${key}]`, value[0].file);
      } else if (key == "new_supporting_documents") {
        value.forEach((doc: Attachment) => {
          if (doc.file) formData.append(`request[${key}][]`, doc.file);
        });
      } else if (key == "deleted_supporting_documents") {
        formData.append(`request[${key}][]`, value);
      } else {
        formData.append(`request[${key}]`, value);
        console.log(formData);
      }
    }

    try {
      const response = await fetch(`http://localhost:3000/requests/${id}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      const result = await response.json();

      return result;
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();

  const redirectError = () => {
    navigate("/404");
  };

  const getRequest = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/requests/edit/${id}`,
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
        setRequest({
          vendor_name: result.request.vendor_name,
          vendor_address: result.request.vendor_address,
          vendor_tin: result.request.vendor_tin,
          vendor_email: result.request.vendor_email,
          vendor_contact_num: result.request.vendor_contact_num,
          vendor_certificate_of_reg: result.request.vendor_certificate_of_reg,
          payment_due_date: result.request.payment_due_date,
          payment_payable_to: result.request.payment_payable_to,
          payment_mode: result.request.payment_mode,
          purchase_category: result.request.purchase_category,
          purchase_description: result.request.purchase_description,
          purchase_amount: result.request.purchase_amount,
          vendor_attachment: result.request.vendor_attachment,
          supporting_documents: result.request.supporting_documents,
        });
      } else {
        redirectError(); 
      }
    } catch (error) {
      console.log(error);
      redirectError(); 
    }
  };

  useEffect(() => {
    getRequest();
  }, []);

  return (
    <EditRequest
      handleRequest={editRequest}
      existingRequest={request ? request : undefined}
      mode="edit"
    />
  );
}

export default EditRequestContainer;
