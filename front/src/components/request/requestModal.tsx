import {
  FloatingMessageBlock,
  MessageDialogConfirm,
  Text,
} from "@freee_jp/vibes";

import { useState } from "react";

interface RequestModalProps {
  handleClose: () => void;
  handleConfirm: () => void;
  isOpen: boolean;
  vendorName: string;
  id: number;
  status: string | null;
}

interface RequestApprovalModalContainerProps {
  handleRequestUpdate: (request: Request | EditedRequest) => void;
  handleClose: () => void;
  handleChangeEditable: () => void;
  isOpen: boolean;
  vendorName: string;
  id: number;
  approvalId: number | null;
  status: string | null;
}

interface Request {
  id: number;
  user_id: number;
  current_stage: string;
  vendor_name: string;
  vendor_address: string;
  vendor_tin: string;
  vendor_email: string;
  vendor_contact_num: string;
  vendor_certificate_of_reg: string;
  vendor_attachment: number;
  payment_due_date: string | null;
  payment_payable_to: string;
  payment_mode: string;
  purchase_category: string;
  purchase_description: string;
  purchase_amount: number;
  created_at: string;
  approvals: Approval[];
  overall_status: string;
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
  id?: number;
}

interface Approval {
  id: number;
  stage: string;
  status: string;
  decided_at: string;
}

interface RequestMsgProps {
  id: number;
  status: string | null;
}

function RequestModal({
  handleClose,
  handleConfirm,
  isOpen,
  id,
  vendorName,
  status,
}: RequestModalProps) {
  return (
    <MessageDialogConfirm
      id={"test"}
      title="Confirm Approval"
      closeButtonLabel="Cancel"
      confirmButtonLabel={status == "Accepted" ? "Approve" : "Reject"}
      danger={status == "Accepted" ? false : true}
      isOpen={isOpen}
      onRequestClose={handleClose}
      onConfirm={handleConfirm}
    >
      {status == "Accepted" ? (
        <Text>
          You are about to approve Request No. {id} for {vendorName}.
        </Text>
      ) : (
        <Text>
          You are about to reject Request No. {id} for {vendorName}.
        </Text>
      )}
    </MessageDialogConfirm>
  );
}

function RequestMsg({ id, status }: RequestMsgProps) {
  return (
    <FloatingMessageBlock success>
      <Text>
        Payment Request No. {id} has been{" "}
        {status == "Accepted" ? "Approved" : "Rejected"}
      </Text>
    </FloatingMessageBlock>
  );
}

function RequestModalContainer({
  isOpen,
  vendorName,
  id,
  approvalId,
  handleClose,
  handleRequestUpdate,
  handleChangeEditable,
  status,
}: RequestApprovalModalContainerProps) {
  const [isUpdated, setIsUpdated] = useState(false);

  const handleApprovalConfirm = () => {
    updateStatus("Accepted");
  };

  const handleRejectConfirm = () => {
    updateStatus("Rejected");
  };

  console.log(status);
  const updateStatus = async (status: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/requests/${id}/approvals/${approvalId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status: status.toLowerCase() }),
        }
      );

      const result = await response.json();

      console.log(result);

      if (response.ok) {
        handleClose();
        handleRequestUpdate(result);
        handleChangeEditable();
        setIsUpdated(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isUpdated ? <RequestMsg id={id} status={status} /> : <> </>}

      <RequestModal
        handleClose={handleClose}
        handleConfirm={
          status == "Accepted" ? handleApprovalConfirm : handleRejectConfirm
        }
        isOpen={isOpen}
        vendorName={vendorName}
        id={id}
        status={status}
      />
    </>
  );
}

export default RequestModalContainer;
