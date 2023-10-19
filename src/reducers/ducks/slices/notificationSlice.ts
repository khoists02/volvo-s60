/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBidAsk, INotification } from "../../../types/notification";
import { INew } from "../../../types/ticker";

const initialState = {
  entities: [] as INotification[],
  loading: false as boolean,
  loadingBidAsk: false as boolean,
  count: 0 as number,
  bidasks: [] as IBidAsk[],
  news: [] as INew[],
  loadingNews: false,
  cashflow: null as any,
  loadingCashflow: false,
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
    getCashFlowStart(state) {
      state.loadingCashflow = true;
    },
    getCashFlowSuccess(state, action) {
      state.cashflow = action.payload;
      state.loadingCashflow = false;
    },
    getCashFlowFail(state) {
      state.loadingCashflow = false;
    },
    getCountSuccess(state, action: PayloadAction<number>) {
      state.count = action.payload;
      state.loading = false;
    },
    getBidAskStart(state) {
      state.loadingBidAsk = true;
    },
    getBidAskSuccess(state, action: PayloadAction<IBidAsk[]>) {
      state.bidasks = action.payload;
      state.loadingBidAsk = false;
    },
    getBidAskFail(state) {
      state.loadingBidAsk = false;
    },
    getNewsStart(state) {
      state.loadingNews = true;
    },
    getNewsSuccess(state, action: PayloadAction<INew[]>) {
      state.news = action.payload;
      state.loadingNews = false;
    },
    getNewsFail(state) {
      state.loadingBidAsk = false;
    },
  },
});

export const NotificationActions = notificationSlice.actions;
export default notificationSlice.reducer;
