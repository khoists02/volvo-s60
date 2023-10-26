import React, { FC, useState } from "react";
import { Modal } from "react-bootstrap";
import { PlayResponse } from "../types/plays";

interface ICreatePlayModal {
  show: boolean;
  onClose: () => void;
  onConfirm: (model: PlayResponse) => void;
  ticker: string;
}

export const CreatePlayModal: FC<ICreatePlayModal> = ({
  show,
  onClose,
  onConfirm,
  ticker,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [model, setModel] = useState<PlayResponse>({
    total: 0,
    ticker: ticker,
    price: 0,
    inPrice: 0,
    playedAt: "",
    virtual: false,
    done: false,
  });

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const name = e.target.name;
  //   const value = e.target.value;

  //   setModel({ ...model, [name]: value });
  // };
  return (
    <Modal show={show} size="lg">
      <Modal.Header>
        <h5>Create Plays</h5>
      </Modal.Header>
      <Modal.Body></Modal.Body>
      <Modal.Footer className="d-flex justify-content-end">
        <button className="btn btn-light" onClick={onClose}>
          Cancel
        </button>
        <button
          className="btn btn-primary ml-2"
          onClick={() => onConfirm(model)}
        >
          Create
        </button>
      </Modal.Footer>
    </Modal>
  );
};
