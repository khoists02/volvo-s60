import { combineReducers } from "redux";

const rootReducer = combineReducers({});

export type IRootState = ReturnType<typeof rootReducer>;
export default rootReducer;
