import { combineReducers } from "redux";
import notiReducer from "../reducers/ducks/slices/notificationSlice";
import playsReducer from "../reducers/ducks/slices/playsSlice";
import historyReducer from "../reducers/ducks/slices/historySlice";
import dailyReducer from "../reducers/ducks/slices/dailySlice";
import accountReducer from "../pages/settings/ducks/slice";
const rootReducer = combineReducers({
  accountReducer,
  dailyReducer,
  historyReducer,
  notiReducer,
  playsReducer,
});

export type IRootState = ReturnType<typeof rootReducer>;
export default rootReducer;
