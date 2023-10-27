import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PlayResponse } from "../../../types/plays";

const initialState = {
  entities: [] as PlayResponse[],
  loading: false as boolean,
  edit: false,
};

const playsSlice = createSlice({
  name: "playsSlice",
  initialState,
  reducers: {
    getAllStart(state) {
      state.loading = true;
    },
    getAllSuccess(state, action: PayloadAction<PlayResponse[]>) {
      state.entities = action.payload;
      state.loading = false;
    },
    getAllFail(state) {
      state.loading = false;
    },
    toggle(state) {
      state.edit = !state.edit;
    },
  },
});

export const PlaysAction = playsSlice.actions;
export default playsSlice.reducer;
