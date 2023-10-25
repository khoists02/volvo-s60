import React, { FC, useState } from "react";
import { Modal } from "react-bootstrap";
import { IBidAsk } from "../types/notification";

interface IBidAskCreateModal {
  show: boolean;
  onClose: () => void;
  onConfirm: (model: IBidAsk) => void;
  ticker: string;
}

export const BidAskCreateModal: FC<IBidAskCreateModal> = ({
  show,
  onClose,
  onConfirm,
  ticker,
}) => {
  const [model, setModel] = useState<IBidAsk>({
    bid: 0,
    ask: 0,
    bidSize: 0,
    askSize: 0,
    ticker,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    setModel({ ...model, [name]: value });
  };
  return (
    <Modal show={show} size="lg">
      <Modal.Header>
        <h5>Create Bid Asks</h5>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-md-12 mb-1">
            <div className="from-group row">
              <div className="col-md-2 form-label">Bid</div>
              <div className="col-md-6">
                <input
                  name="bid"
                  type="number"
                  onChange={handleInputChange}
                  value={model.bid}
                  className="form-control"
                />
              </div>
            </div>
          </div>

          <div className="col-md-12 mb-1">
            <div className="from-group row">
              <div className="col-md-2 form-label">Bid Size</div>
              <div className="col-md-6">
                <input
                  type="number"
                  name="bidSize"
                  value={model.bidSize}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
            </div>
          </div>

          <div className="col-md-12 mb-1">
            <div className="from-group row">
              <div className="col-md-2 form-label">Ask</div>
              <div className="col-md-6">
                <input
                  type="number"
                  name="ask"
                  value={model.ask}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
            </div>
          </div>

          <div className="col-md-12 mb-1">
            <div className="from-group row">
              <div className="col-md-2 form-label">Ask Size</div>
              <div className="col-md-6">
                <input
                  type="number"
                  value={model.askSize}
                  onChange={handleInputChange}
                  name="askSize"
                  className="form-control"
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
          Create
        </button>
      </Modal.Footer>
    </Modal>
  );
};
