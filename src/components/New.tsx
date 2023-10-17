import React, { FC, useEffect, useState } from "react";
import { useAppDispatch } from "../config/store";
import { useSelector } from "react-redux";
import { IRootState } from "../config/reducers";
import { getNewsNoti } from "../reducers/ducks/operators/notificationOperator";

interface INew {
  ticker: string;
}

export const New: FC<INew> = ({ ticker }) => {
  const dispatch = useAppDispatch();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { loadingNews, news } = useSelector(
    (state: IRootState) => state.notiReducer,
  );
  useEffect(() => {
    dispatch(getNewsNoti(ticker as string));
  }, [dispatch, ticker]);
  return (
    <div className="card">
      <div className="card-header d-flex algin-items-center">
        <h5 className="title">News - {ticker}</h5>
        {loadingNews && (
          <i className="ph-light ph-spinner ph-sm-size spinner mr-2"></i>
        )}
      </div>

      <div className="card-body">
        {(news || []).map((n, index) => {
          return (
            <div key={n.link}>
              <a href={n.link} target="_blank" className="d-flex m-b-xxs">
                <span className="flex-1">{n.title}</span>

                {/* <span
                  className="ml-1 badge badge-secondary text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedIndex(index);
                  }}
                >
                  Show with iframe
                </span> */}

                <span className="ml-1 badge badge-secondary text-white">
                  {n.publisher}
                </span>
              </a>

              {selectedIndex === index && (
                <div className="w-100">
                  <iframe
                    className="w-100"
                    style={{ minHeight: 500, height: 500, overflowY: "auto" }}
                    src={n.link}
                    title={n.title}
                    allow="origin"
                    frameBorder="0"
                  ></iframe>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
