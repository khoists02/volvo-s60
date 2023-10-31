import React, { FC, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { PlayResponse } from "../types/plays";

interface ICreatePlayModal {
  show: boolean;
  onClose: () => void;
  onConfirm: (model: PlayResponse) => void;
  ticker: string;
  selected?: PlayResponse | null;
}

export const CreatePlayModal: FC<ICreatePlayModal> = ({
  show,
  onClose,
  onConfirm,
  ticker,
  selected,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [model, setModel] = useState<PlayResponse>({
    total: 0,
    ticker: ticker,
    price: 0,
    inPrice: 0,
    winPrice: 0,
    lossPrice: 0,
    cfd: 1,
    playedAt: "",
    virtual: false,
    done: false,
  });

  useEffect(() => {
    if (selected) setModel(selected);
  }, [selected]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    const checked = e.target.checked;
    if (name === "virtual") {
      setModel({ ...model, virtual: checked });
    } else {
      setModel({ ...model, [name]: value });
    }
  };
  return (
    <Modal show={show} size="lg">
      <Modal.Header>
        <h5>{!model.id ? "Create" : "Update"} Plays</h5>
      </Modal.Header>
      <Modal.Body>
        <div className="card">
          <div className="card-body">
            <div className="from-group mb-2 row align-items-center">
              <label className="col-md-3 label">Price</label>
              <div className="col-md-5">
                <input
                  type="number"
                  min={0}
                  value={model.price}
                  onChange={handleInputChange}
                  name="price"
                  className="form-control"
                />
              </div>
            </div>

            <div className="from-group mb-2 row align-items-center">
              <label className="col-md-3 label">In Price</label>
              <div className="col-md-5">
                <input
                  type="number"
                  min={0}
                  value={model.inPrice}
                  onChange={handleInputChange}
                  name="inPrice"
                  className="form-control"
                />
              </div>
            </div>

            <div className="from-group mb-2 row align-items-center">
              <label className="col-md-3 label">Loss Price</label>
              <div className="col-md-5">
                <input
                  type="number"
                  min={0}
                  value={model.lossPrice}
                  onChange={handleInputChange}
                  name="lossPrice"
                  className="form-control"
                />
              </div>
            </div>

            <div className="from-group mb-2 row align-items-center">
              <label className="col-md-3 label">Win Price</label>
              <div className="col-md-5">
                <input
                  type="number"
                  min={0}
                  value={model.winPrice}
                  onChange={handleInputChange}
                  name="winPrice"
                  className="form-control"
                />
              </div>
            </div>

            <div className="from-group mb-2 row align-items-center">
              <label className="col-md-3 label">Cfd X</label>
              <div className="col-md-5">
                <input
                  type="number"
                  min={0}
                  value={model.cfd}
                  onChange={handleInputChange}
                  name="cfd"
                  readOnly={model.id !== ""}
                  disabled={model.id !== ""}
                  className="form-control"
                />
              </div>
            </div>

            <div className="from-group mb-2 row align-items-center">
              <label className="col-md-3 label">Virtual</label>
              <div className="col-md-5">
                <input
                  type="checkbox"
                  checked={model.virtual}
                  onChange={handleInputChange}
                  name="virtual"
                />
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-end">
        <button className="btn btn-light" onClick={onClose}>
          Cancel
        </button>
        <button
          className="btn btn-primary ml-2"
          onClick={() => onConfirm(model)}
        >
          {!model.id ? "Create" : "Update"}
        </button>
      </Modal.Footer>
    </Modal>
  );
};
