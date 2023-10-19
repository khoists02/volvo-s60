import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ITickerInfo } from "../../../types/ticker";
import { IHistoryResponse } from "../../../components/StockHistory";

const initialState = {
  ticker: undefined as unknown as ITickerInfo,
  loading: false as boolean,
  dailyData: [] as IHistoryResponse[],
  dailyLoading: false,
};

const dailySlice = createSlice({
  name: "dailySlice",
  initialState,
  reducers: {
    getTickerStart(state) {
      state.loading = true;
    },
    getTickerSuccess(state, action: PayloadAction<ITickerInfo>) {
      state.ticker = action.payload;
      state.loading = false;
    },
    getTickerFail(state) {
      state.loading = false;
    },
    getDailyDataStart(state) {
      state.dailyLoading = true;
      state.dailyData = [];
    },
    getDailyDataSuccess(state, action: PayloadAction<IHistoryResponse[]>) {
      state.dailyLoading = false;
      state.dailyData = action.payload;
    },
    getDailyDataFail(state) {
      state.dailyLoading = false;
    },
    clear(state) {
      state.dailyData = [];
    },
  },
});

export const DailyActions = dailySlice.actions;
export default dailySlice.reducer;
