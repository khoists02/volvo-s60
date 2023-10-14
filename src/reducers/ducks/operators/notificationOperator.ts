import axios from "axios";
import { AppThunk } from "../../../config/store";
import { NotificationActions } from "../slices/notificationSlice";
import { HistoryAction } from "../slices/historySlice";

export const getAllNoti = (): AppThunk => async (dispatch) => {
  try {
    dispatch(NotificationActions.getAllStart());
    const response = await axios.get("/notifications");
    dispatch(NotificationActions.getAllSuccess(response.data.content));
  } catch (error) {
    dispatch(NotificationActions.getAllFail());
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
