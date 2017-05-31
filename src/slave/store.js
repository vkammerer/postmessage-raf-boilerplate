import { combineReducers, createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
// import { createWorkerMiddleware } from "@vkammerer/redux-postmessage-raf";
import { createWorkerMiddleware } from "../../../redux-postmessage-raf";
import { common } from "../common/reducers/common";
import { slave } from "./reducers/slave";

const reducers = combineReducers({
  common,
  slave
});

// MIDDLEWARES
const messagerMiddleware = createWorkerMiddleware({ dispatchAfterPong: true });

const logger = createLogger({
  collapsed: true
});

export const store = createStore(
  reducers,
  // applyMiddleware(messagerMiddleware, cycleMiddleware)
  applyMiddleware(messagerMiddleware, logger)
);
