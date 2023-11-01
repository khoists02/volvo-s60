import React, { FC, useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../config/store";
import { getAllByTicker } from "../reducers/ducks/operators/playsOperator";
import { IRootState } from "../config/reducers";
import { useSelector } from "react-redux";
import { CreatePlayModal } from "./CreatePlayModal";
import { PlayResponse } from "../types/plays";
import axios from "axios";
import format from "date-fns/format";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";

interface IPlayBlock {
  ticker: string;
  edit?: boolean;
  currentPrice?: number;
}

export const PlayBlock: FC<IPlayBlock> = ({ ticker, edit, currentPrice }) => {
  const dispatch = useAppDispatch();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
        await axios.put("/plays/" + data.id, {
          ...data,
          doneAt: format(new Date(), "dd-MM-yyyy HH:mm:ss"),
          currentPrice: currentPrice,
        });
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

  const total = useCallback(
    (item: PlayResponse) => {
      if (!currentPrice || !item.inPrice) return 0;
      const per =
        ((currentPrice - item.inPrice) / currentPrice) * (item.cfd || 1);
      return per * 100;
    },
    [currentPrice],
  );

  const markItDone = async (model: PlayResponse) => {
    try {
      if (!model.price) return;
      const t = model.price + (total(model) / 100) * model.price;
      await axios.put("/plays/" + model.id, {
        ...model,
        done: true,
        total: t,
        doneAt: format(new Date(), "dd-MM-yyyy HH:mm:ss"),
        currentPrice: currentPrice,
      });
      setDone(true);
      dispatch(getAllByTicker(ticker as string, true));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const deletePlay = async (id: string) => {
    try {
      await axios.delete("/plays/" + id);
      setShowDeleteModal(false);
      dispatch(getAllByTicker(ticker as string, true));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      setShowDeleteModal(false);
    }
  };

  const lossNumber = useCallback(
    (item: PlayResponse, current?: number) => {
      if (
        !current ||
        current === 0 ||
        !item.inPrice ||
        !item.lossPrice ||
        !item.winPrice
      )
        return 0;
      const loss = item.lossPrice || 0;
      const win = item.winPrice || 0;
      if (current <= loss || current >= win) {
        // done
        markItDone(item);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    if (entities.length > 0) {
      const doneLs = entities.filter((x) => !x.done);
      doneLs.forEach((d) => {
        lossNumber(d, currentPrice);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPrice, entities]);

  return (
    <>
      {showDeleteModal && (
        <ConfirmDeleteModal
          show={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => {
            deletePlay(selected?.id as string);
          }}
        />
      )}
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
                  <i className="ph-light ph-spinner ph-sm-size spinner mr-2"></i>
                )}
                <span>Reload</span>
              </button>
            </div>
          </div>
          <div className="d-flex">
            <button
              className={`btn btn-${
                !done ? "primary" : "success"
              } mr-1 text-white`}
              onClick={() => setDone(!done)}
            >
              <i className={`ph-light ph-sm-size ph-funnel`}></i>
            </button>
            {!done && (
              <button
                className="btn btn-primary"
                onClick={() => {
                  setShowCreateModal(true);
                  setSelected(null);
                }}
              >
                Create
              </button>
            )}
          </div>
        </div>

        <div className="card-body animated fadeInUp" style={{ height: 135 }}>
          {entities.map((x) => {
            return (
              <div
                className="d-flex justify-content-between align-items-center mb-1"
                key={x.id}
              >
                <div className="d-flex">
                  <div className="price">${x.price}</div>
                  <div className="in-price ml-2">
                    <span>In: ${x.inPrice}</span>
                    {currentPrice && x.inPrice && (
                      <span
                        className={`mr-1 ml-1 text-${
                          total(x) > 0 ? "success" : "danger"
                        }`}
                      >
                        ({total(x) > 0 && "+"}
                        {(currentPrice - x.inPrice).toFixed(3)})
                      </span>
                    )}
                  </div>

                  {total(x) !== 0 && (
                    <span
                      className={`ml-1 text-${
                        total(x) > 0 ? "success" : "danger"
                      }`}
                    >
                      ({total(x) > 0 && "+"} {total(x).toFixed(3)})%
                    </span>
                  )}
                </div>

                <div className="d-flex flex-center">
                  {total(x) !== 0 && x.price && (
                    <span
                      className={`mr-1 text-${
                        total(x) > 0 ? "success" : "danger"
                      }`}
                    >
                      Total: {(x.price + (total(x) / 100) * x.price).toFixed(3)}
                    </span>
                  )}

                  <span className="badge badge-warning mr-1">
                    CFD X {x.cfd || 1}
                  </span>

                  <span className="d-flex align-items-center badge badge-warning text-white mr-1">
                    <i className="ph-light ph-xxs-size ph-calendar mr-2"></i>
                    <span>{done ? x.doneAt : x.playedAt}</span>
                  </span>
                  {!done && (
                    <span
                      className="badge badge-success mr-1 cursor-pointer"
                      onClick={() => markItDone(x)}
                    >
                      Mark it done
                    </span>
                  )}

                  {!done && (
                    <i
                      className="ph-light ph-sm-size ph-note-pencil cursor-pointer"
                      onClick={() => {
                        setSelected(x);
                        setTimeout(() => {
                          setShowCreateModal(true);
                        }, 1);
                      }}
                    ></i>
                  )}

                  {done && (
                    <i
                      className="ph-light ph-sm-size ph-trash cursor-pointer ml-1 text-danger"
                      onClick={() => {
                        setSelected(x);
                        setShowDeleteModal(true);
                      }}
                    ></i>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
