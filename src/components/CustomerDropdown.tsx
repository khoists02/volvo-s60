import React, { FC, useState } from "react";

export interface ICustomer {
  icon?: React.ReactElement;
  ticker: string;
  name: string;
}

export interface ICustomerDropdown {
  options: Array<ICustomer>;
  selected: ICustomer;
  onChange: (value: ICustomer) => void;
}

const CustomerDropdown: FC<ICustomerDropdown> = ({
  options,
  selected,
  onChange,
}) => {
  const [show, setShow] = useState(false);
  return (
    <div className="dropdown  w-sm-auto cursor-pointer">
      <span
        className="d-flex align-items-center text-body lh-1 dropdown-toggle py-sm-2"
        onClick={() => setShow(!show)}
      >
        {selected.icon}
        <div className="me-auto me-lg-1 ml-1">
          <div className="fs-sm text-muted mb-1">{selected.name}</div>
          <div className="fw-semibold">{selected.ticker}</div>
        </div>
      </span>

      <div
        className={`dropdown-menu dropdown-menu-lg-end w-100 w-lg-auto wmin-300 wmin-sm-350 pt-0 ${
          show ? "show" : ""
        }`}
      >
        {options.map((op) => {
          return (
            <span
              key={op.ticker}
              onClick={() => {
                onChange(op);
                setShow(false);
              }}
              className={`dropdown-item ${
                selected.ticker === op.ticker ? "active" : ""
              }  py-2`}
            >
              {op.icon}
              <div className="ml-1">
                <div className="fw-semibold">{op.name}</div>
                <div className="fs-sm text-muted">{op.ticker}</div>
              </div>
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default CustomerDropdown;
