import axios from "axios";
import { AppThunk } from "../../../config/store";
import { NotificationActions } from "../slices/notificationSlice";
import { HistoryAction } from "../slices/historySlice";
import { DailyActions } from "../slices/dailySlice";
import { ITickerInfo } from "../../../types/ticker";
import { IHistoryResponse } from "../../../components/StockHistory";

export const getAllNoti = (): AppThunk => async (dispatch) => {
  try {
    dispatch(NotificationActions.getAllStart());
    const response = await axios.get("/notifications");
    dispatch(NotificationActions.getAllSuccess(response.data.content));
  } catch (error) {
    dispatch(NotificationActions.getAllFail());
  }
};

export const getBidAskNoti =
  (ticker: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(NotificationActions.getBidAskStart());
      const response = await axios.get("/bidasks", {
        params: { ticker },
      });
      dispatch(NotificationActions.getBidAskSuccess(response.data.content));
    } catch (error) {
      dispatch(NotificationActions.getBidAskFail());
    }
  };

export const getNewsNoti =
  (ticker: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(NotificationActions.getNewsStart());
      const response = await axios.get("/recommendations", {
        params: { ticker },
      });
      dispatch(NotificationActions.getNewsSuccess(response.data));
    } catch (error) {
      dispatch(NotificationActions.getNewsFail());
    }
  };

export const getCashFlow =
  (ticker: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(NotificationActions.getCashFlowStart());
      const response = await axios.get("/cashflow", {
        params: { ticker, freq: "quarterly" },
      });
      dispatch(NotificationActions.getCashFlowSuccess(response.data));
    } catch (error) {
      dispatch(NotificationActions.getCashFlowFail());
    }
  };

export const getCountNoti = (): AppThunk => async (dispatch) => {
  try {
    dispatch(NotificationActions.getAllStart());
    const response = await axios.get("/notifications/count");
    dispatch(NotificationActions.getCountSuccess(response.data.count));
  } catch (error) {
    dispatch(NotificationActions.getAllFail());
  }
};

export const getFavorites = (): AppThunk => async (dispatch) => {
  try {
    dispatch(HistoryAction.getAllStart());
    const response = await axios.get("/favorites", {
      params: { ticker: "BLND" },
    });
    dispatch(HistoryAction.getAllSuccess(response.data.content));
  } catch (error) {
    dispatch(HistoryAction.getAllFail());
  }
};

export const getFavoritesTimer = (): AppThunk => async (dispatch) => {
  try {
    dispatch(HistoryAction.getAllStart());
    const response = await axios.get("/favorites", {
      params: { ticker: "BLND" },
    });
    dispatch(HistoryAction.getAllTimer(response.data.content));
  } catch (error) {
    dispatch(HistoryAction.getAllFail());
  }
};

export const getTickerInfo =
  (ticker: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(DailyActions.getTickerStart());
      const response = await axios.get("/info", {
        params: { ticker },
      });
      dispatch(DailyActions.getTickerSuccess(response.data as ITickerInfo));
    } catch (error) {
      dispatch(DailyActions.getTickerFail());
    }
  };

export const getDailyDataByTicker =
  (ticker: string, start: string, end: string, interval: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(DailyActions.getDailyDataStart());
      const res = await axios.get("/daily", {
        params: {
          ticker: ticker,
          start,
          end,
          interval,
        },
      });
      if (res.data) {
        const dailyRs: IHistoryResponse[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        res.data.forEach((r: any) => {
          dailyRs.push({
            open: r.Open,
            date: new Date().getMilliseconds(),
            close: r.Close,
            low: r.Low,
            high: r.High,
            ticker: ticker,
            volume: 0,
            adjclose: 0,
          });
        });

        dispatch(
          DailyActions.getDailyDataSuccess(
            dailyRs.reverse().map((x, index) => {
              const t = (index + 1) * 15;
              return { ...x, timeline: t.toString() };
            }),
          ),
        );
      }
    } catch (error) {
      dispatch(DailyActions.getDailyDataFail());
    }
  };
