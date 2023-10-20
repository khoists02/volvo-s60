import React, { FC } from "react";

interface IErrorAlert {
  message: string;
}

export const ErrorAlert: FC<IErrorAlert> = ({ message }) => {
  return (
    <div className="alert alert-danger alert-icon-start alert-dismissible fade show">
      <span className="alert-icon bg-danger text-white">
        <i className="ph-light ph-sm-size ph-x-circle"></i>
      </span>
      <span className="fw-semibold">{message}</span>.
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="alert"
      ></button>
    </div>
  );
};
