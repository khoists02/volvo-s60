import React, { FC } from "react";
import { Modal } from "react-bootstrap";

interface IConfirmDeleteModal {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmDeleteModal: FC<IConfirmDeleteModal> = ({
  show,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal show={show} size="sm">
      <Modal.Header>
        <h5>Delete</h5>
      </Modal.Header>
      <Modal.Body>
        <div>Are you sure you want to delete this item ?</div>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-end">
        <button className="btn btn-light" onClick={onClose}>
          Cancel
        </button>
        <button className="btn btn-danger ml-2" onClick={onConfirm}>
          Delete
        </button>
      </Modal.Footer>
    </Modal>
  );
};
