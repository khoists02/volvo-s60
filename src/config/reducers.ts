import { combineReducers } from "redux";
import notiReducer from "../reducers/ducks/slices/notificationSlice";
import historyReducer from "../reducers/ducks/slices/historySlice";
const rootReducer = combineReducers({
  historyReducer,
  notiReducer,
});

export type IRootState = ReturnType<typeof rootReducer>;
export default rootReducer;
