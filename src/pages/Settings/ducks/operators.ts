import axios from "axios";
import { AppThunk } from "../../../config/store";
import { AccountAction } from "./slice";

export const getAccount =
  (ticker: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(AccountAction.getAccountStart());
      const response = await axios.get("/account", { params: { ticker } });
      dispatch(AccountAction.getAccountSuccess(response.data));
    } catch (error) {
      dispatch(AccountAction.getAccountFail());
    }
  };
