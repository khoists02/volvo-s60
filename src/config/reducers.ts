import { combineReducers } from "redux";
import notiReducer from "../reducers/ducks/slices/notificationSlice";
import historyReducer from "../reducers/ducks/slices/historySlice";
import dailyReducer from "../reducers/ducks/slices/dailySlice";
import accountReducer from "../pages/settings/ducks/slice";
const rootReducer = combineReducers({
  accountReducer,
  dailyReducer,
  historyReducer,
  notiReducer,
});

export type IRootState = ReturnType<typeof rootReducer>;
export default rootReducer;
