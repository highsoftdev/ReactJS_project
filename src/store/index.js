import { createStore} from "redux";
import {applyMiddleware } from "redux";
import thunk from "redux-thunk";
import {appReducer} from "../reducers/reducers";
const consoleMessages = (store)=>(next)=>(action)=>{
  let result;
  console.groupCollapsed(`dispatching action => ${action.type}`);
  let state = store.getState();
  console.log(`1 state: ${JSON.stringify(state)}`);
  result = next(action);
  console.log(`2 state: ${JSON.stringify(state)}`);
  console.groupEnd();
  return result;
};

export const storeFactory =  (initialState={})=>{
  return applyMiddleware(thunk,consoleMessages)(createStore)(appReducer, initialState);
};
//
