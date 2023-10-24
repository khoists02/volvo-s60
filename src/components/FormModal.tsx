import React, { FC } from "react";
import { Modal } from "react-bootstrap";

interface IFormModal {
  size: "sm" | "lg" | "xl";
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  okButton: string;
  cancelButton: string;
  title: string;
  children: React.ReactElement;
  disabledConfirmBtn?: boolean;
}

export const FormModal: FC<IFormModal> = ({
  size,
  show,
  onClose,
  okButton,
  cancelButton,
  onConfirm,
  title,
  children,
  disabledConfirmBtn = false,
}) => {
  return (
    <Modal show={show} size={size} centered>
      <Modal.Header>
        <h5>{title}</h5>
      </Modal.Header>
      <Modal.Body>
        <div>{children}</div>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-end">
        <button className="btn btn-light" onClick={onClose}>
          {cancelButton}
        </button>
        <button
          disabled={disabledConfirmBtn}
          className="btn btn-primary ml-2"
          onClick={onConfirm}
        >
          {okButton}
        </button>
      </Modal.Footer>
    </Modal>
  );
};
