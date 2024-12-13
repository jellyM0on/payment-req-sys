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
  handleRequestUpdate: (request: Request) => void;
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
      confirmButtonLabel={status == "accepted" ? "Approve" : "Reject"}
      danger={status == "accepted" ? false : true}
      isOpen={isOpen}
      onRequestClose={handleClose}
      onConfirm={handleConfirm}
    >
      {status == "accepted" ? (
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
        {status == "accepted" ? "approved" : "rejected"}
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
    updateStatus("accepted");
  };

  const handleRejectConfirm = () => {
    updateStatus("rejected");
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
          body: JSON.stringify({ status: status }),
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
          status == "accepted" ? handleApprovalConfirm : handleRejectConfirm
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
