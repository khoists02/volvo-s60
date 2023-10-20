import React, { FC } from "react";

interface IErrorAlert {
  message: string;
  onClose?: () => void;
}

export const ErrorAlert: FC<IErrorAlert> = ({ message, onClose }) => {
  return (
    <div className="alert alert-danger alert-icon-start alert-dismissible fade show">
      <div className="d-flex align-items-center">
        <i className="ph-light ph-sm-size ph-x-circle text-danger mr-2"></i>
        <span className="fw-semibold">{message}</span>.
      </div>

      <button
        onClick={() => {
          if (onClose) onClose();
        }}
        type="button"
        className="btn-close"
        data-bs-dismiss="alert"
      ></button>
    </div>
  );
};
