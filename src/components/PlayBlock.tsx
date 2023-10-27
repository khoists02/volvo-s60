import React, { FC, useEffect, useState } from "react";
import { useAppDispatch } from "../config/store";
import { getAllByTicker } from "../reducers/ducks/operators/playsOperator";
import { IRootState } from "../config/reducers";
import { useSelector } from "react-redux";
import { CreatePlayModal } from "./CreatePlayModal";

interface IPlayBlock {
  ticker: string;
}

export const PlayBlock: FC<IPlayBlock> = ({ ticker }) => {
  const dispatch = useAppDispatch();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { entities, loading } = useSelector(
    (state: IRootState) => state.playsReducer,
  );

  // eslint-disable-next-line no-console
  console.log({ entities });

  useEffect(() => {
    if (ticker) dispatch(getAllByTicker(ticker));
  }, [dispatch, ticker]);
  return (
    <>
      {showCreateModal && (
        <CreatePlayModal
          ticker={ticker}
          show={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onConfirm={() => setShowCreateModal(false)}
        />
      )}
      <div className="card">
        <div className="card-header d-flex  justify-content-between">
          <div className="d-flex align-items-center">
            <h5 className="title">Plays </h5>
            <div>
              <button
                className="btn btn-primary ml-2"
                onClick={() => dispatch(getAllByTicker(ticker as string))}
              >
                {loading && (
                  <i className="ph-light ph-spinner ph-xs-size spinner mr-2"></i>
                )}
                <span>Reload</span>
              </button>
            </div>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            Create play
          </button>
        </div>

        <div className="card-body"></div>
      </div>
    </>
  );
};
