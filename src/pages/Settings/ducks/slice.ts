import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ITickerAccount } from "../../../types/ticker";

const defaultValue: ITickerAccount = {
  ticker: "",
  balance: "0",
  current: "0",
  id: "",
  count: 0,
  priceIn: 0,
  priceOut: 0,
};

const initialState = {
  loading: false as boolean,
  account: defaultValue as ITickerAccount,
};

const accountSlice = createSlice({
  name: "accountSlice",
  initialState,
  reducers: {
    getAccountStart(state) {
      state.loading = true;
    },
    getAccountSuccess(state, action: PayloadAction<ITickerAccount>) {
      state.account = action.payload;
      state.loading = false;
    },
    getAccountFail(state) {
      state.loading = false;
    },
  },
});

export const AccountAction = accountSlice.actions;
export default accountSlice.reducer;
