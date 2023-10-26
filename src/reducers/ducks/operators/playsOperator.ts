import axios from "axios";
import { AppThunk } from "../../../config/store";
import { PlaysAction } from "../slices/playsSlice";

export const getAllByTicker =
  (ticker: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(PlaysAction.getAllStart());
      const response = await axios.get("/plays", { params: { ticker } });
      dispatch(PlaysAction.getAllSuccess(response.data.content));
    } catch (error) {
      dispatch(PlaysAction.getAllFail());
    }
  };
