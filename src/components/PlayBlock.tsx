import React, { FC, useEffect, useState } from "react";
import { useAppDispatch } from "../config/store";
import { getAllByTicker } from "../reducers/ducks/operators/playsOperator";
import { IRootState } from "../config/reducers";
import { useSelector } from "react-redux";
import { CreatePlayModal } from "./CreatePlayModal";
import { PlayResponse } from "../types/plays";
import axios from "axios";
import format from "date-fns/format";

interface IPlayBlock {
  ticker: string;
  edit?: boolean;
}

export const PlayBlock: FC<IPlayBlock> = ({ ticker, edit }) => {
  const dispatch = useAppDispatch();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [done, setDone] = useState(false);
  const { entities, loading } = useSelector(
    (state: IRootState) => state.playsReducer,
  );

  const [selected, setSelected] = useState<PlayResponse | null>(null);

  useEffect(() => {
    if (ticker) dispatch(getAllByTicker(ticker, done));
  }, [dispatch, ticker, done]);

  const handleConfirm = async (model: PlayResponse) => {
    try {
      const data: PlayResponse = {
        ...model,
        price: parseFloat(model.price?.toString() || "0"),
        inPrice: parseFloat(model.inPrice?.toString() || "0"),
        playedAt: !model.id
          ? format(new Date(), "dd-MM-yyyy HH:mm")
          : model.playedAt,
        ticker: ticker as string,
        total: 0,
        virtual: model.virtual,
        done: model.done,
      };
      if (!model.id) {
        await axios.post("/plays", data);
        setShowCreateModal(false);
        setDone(false);
      } else {
        await axios.put("/plays/" + data.id, data);
        setShowCreateModal(false);
      }
      dispatch(getAllByTicker(ticker as string, done));
      setSelected(null);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      setShowCreateModal(false);
      setSelected(null);
    }
  };

  const markItDone = async (model: PlayResponse) => {
    try {
      await axios.put("/plays/" + model.id, { ...model, done: true });
      setDone(true);
      dispatch(getAllByTicker(ticker as string, true));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return (
    <>
      {showCreateModal && (
        <CreatePlayModal
          ticker={ticker}
          selected={selected as PlayResponse}
          show={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setSelected(null);
          }}
          onConfirm={(model) => handleConfirm(model)}
        />
      )}
      <div className={`card ${edit ? "edit" : ""}`}>
        <div className="card-header d-flex  justify-content-between">
          <div className="d-flex align-items-center">
            <h5 className="title">Plays </h5>
            <div>
              <button
                className="btn btn-primary ml-2"
                onClick={() => dispatch(getAllByTicker(ticker as string, done))}
              >
                {loading && (
                  <i className="ph-light ph-spinner ph-xs-size spinner mr-2"></i>
                )}
                <span>Reload</span>
              </button>
            </div>
          </div>
          <div className="d-flex">
            <button
              className={`btn btn-${done ? "primary" : "light"} mr-1`}
              onClick={() => setDone(!done)}
            >
              {done ? "Done" : "Not Done"}
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                setShowCreateModal(true);
                setSelected(null);
              }}
            >
              Create play
            </button>
          </div>
        </div>

        <div className="card-body animated fadeInUp" style={{ height: 135 }}>
          {entities.map((x) => {
            return (
              <div
                className="d-flex justify-content-between align-items-center mb-1"
                key={x.id}
              >
                <div className="price">${x.price}</div>
                <div className="d-flex flex-center">
                  <span className="d-flex align-items-center badge badge-warning text-white mr-1">
                    <i className="ph-light ph-xxs-size ph-calendar mr-2"></i>
                    <span>{x.playedAt}</span>
                  </span>
                  {!x.done && (
                    <span
                      className="badge badge-success mr-1 cursor-pointer"
                      onClick={() => markItDone(x)}
                    >
                      Mark it done
                    </span>
                  )}

                  <i
                    className="ph-light ph-sm-size ph-note-pencil cursor-pointer"
                    onClick={() => {
                      setSelected(x);
                      setTimeout(() => {
                        setShowCreateModal(true);
                      }, 1);
                    }}
                  ></i>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
