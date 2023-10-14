import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { INotification } from "../../../types/notification";

const initialState = {
  entities: [] as INotification[],
  loading: false as boolean,
  count: 0 as number,
};

const notificationSlice = createSlice({
  name: "notificationSlice",
  initialState,
  reducers: {
    getAllStart(state) {
      state.loading = true;
    },
    getAllSuccess(state, action: PayloadAction<INotification[]>) {
      state.entities = action.payload;
      state.loading = false;
    },
    getAllFail(state) {
      state.loading = false;
    },
    getCountSuccess(state, action: PayloadAction<number>) {
      state.count = action.payload;
      state.loading = false;
    },
  },
});

export const NotificationActions = notificationSlice.actions;
export default notificationSlice.reducer;
