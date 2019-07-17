import {combineReducers} from "redux";

export const user = (state={}, action) => {
  switch(action.type){
    case "LOGIN":{
      return Object.assign({},state,{login:action.payload}, {actionType : "LOGIN"});
    }
    case "REGISTER":{
      return Object.assign({},state,{register:action.payload}, {actionType : "REGISTER"});
    }
    case "FORGET_PASSWORD":{
      return Object.assign({},state,{forgetPassword:action.payload}, {actionType : "FORGET_PASSWORD"});
    }
    case "GET_LIST":{
      return Object.assign({},state,{list:action.payload}, {actionType : "GET_LIST"});
    }
    case "GET_DAIMLERS_LIST":{
      return Object.assign({}, state, {daimlers: action.payload}, {actionType : "GET_DAIMLERS_LIST"});
    }
    case "RESET_PASSWORD":{
      return Object.assign({}, state, {resetPassword: action.payload}, {actionType : "RESET_PASSWORD"});
    }
    case "GET_CONTACT": {
      return Object.assign({}, state, {contact: action.payload}, {actionType : "GET_CONTACT"});
    }
    case "VERIFY": {
      return Object.assign({}, state, {verify: action.payload}, {actionType : "VERIFY"});
    }
    case "LOAD":{
      return Object.assign({}, state, {loading : action.loading}, {actionType : "LOAD"});
    }
    default:{
      return state;
    }
  }
};

export const appReducer=combineReducers({
  user,
  state: (state = {}) => state
});