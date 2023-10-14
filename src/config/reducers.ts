import { combineReducers } from "redux";
import notiReducer from "../reducers/ducks/slices/notificationSlice";
const rootReducer = combineReducers({
  notiReducer,
});

export type IRootState = ReturnType<typeof rootReducer>;
export default rootReducer;
