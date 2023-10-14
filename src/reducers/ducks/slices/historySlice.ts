import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ITickerInfo } from "../../../types/ticker";

const initialState = {
  entities: [] as ITickerInfo[],
  loading: false as boolean,
  entitiesTimer: [] as ITickerInfo[],
};

const historySlice = createSlice({
  name: "historySlice",
  initialState,
  reducers: {
    getAllStart(state) {
      state.loading = true;
    },
    getAllSuccess(state, action: PayloadAction<ITickerInfo[]>) {
      state.entities = action.payload;
      state.loading = false;
    },
    getAllFail(state) {
      state.loading = false;
    },
    getAllTimer(state, action: PayloadAction<ITickerInfo[]>) {
      state.entitiesTimer = action.payload;
      state.loading = false;
    },
    clear(state) {
      state.entitiesTimer = [];
    },
  },
});

export const HistoryAction = historySlice.actions;
export default historySlice.reducer;
