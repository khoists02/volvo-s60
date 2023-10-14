import axios from "axios";
import { AppThunk } from "../../../config/store";
import { NotificationActions } from "../slices/notificationSlice";

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
