import "isomorphic-fetch";
import {GET, POST, PUT} from "../utils/nioUtils";
import config from "../../config";
let baseURL = config.BK_URL;

function startLodaing (dispatch){
  dispatch({
    type: "LOAD",
    loading : true,
  });
}

function endLodaing (dispatch){
  dispatch({
    type: "LOAD",
    loading : false,
  });
}

export  const Login = (loginObject) => (dispatch) => {
  let url = baseURL+"login";
  startLodaing(dispatch);
  POST(url, loginObject).then(({body}) => {
    endLodaing(dispatch);
    if(body.code === 200){
      let data = body.data;
      let userObject = {
        uuid: data.uuid,
        email: data.email,
        password: data.password
      };
      window.userObject = userObject;
      let responseObject = {
        status : body.status,
        data : body.data,
        message: body.message
      };
      dispatch ({
        type: "LOGIN",
        payload: responseObject
      });
    }
    else{
      dispatch({
        type : "LOGIN",
        payload: {
          status:false,
          message: body.message
        }
      });
    }
  });
};

export  const SetPassword = (object) => (dispatch) => {
  let url = baseURL+"resetPassword";
  object.id = window.uuid;
  if(window.uuid){
    PUT(url, object).then(({body}) => {
      if(body.code === 200){
        let responseObject = {
          status : body.status,
          message : body.message
        };
        dispatch ({
          type: "RESET_PASSWORD",
          payload: responseObject
        });
      }
      else{
        dispatch({
          type : "RESET_PASSWORD",
          payload: {
            status:false,
            message : body.message
          }
        });
      }
    });
  }
  else{
    dispatch({
      type : "RESET_PASSWORD",
      payload: {
        status:false,
        message : "Invalid link of password reset."
      }
    });
  }

};

export  const Register = (registerObject) => (dispatch) => {
  let url = baseURL+"register";
  startLodaing(dispatch);
  PUT(url, registerObject).then(({body}) => {
    endLodaing(dispatch);
    if(body.code === 200){
      let responseObject = {
        status : body.status,
        data : body.data,
        message : body.message
      };
      dispatch ({
        type: "REGISTER",
        payload: responseObject
      });
    }
    else{
      dispatch({
        type : "REGISTER",
        payload: {
          status:false,
          message : body.message
        }
      });
    }
  });
};

export  const ForgetPassword = (registerObject) => (dispatch) => {
  let url = baseURL+"forgetPassword";
  POST(url, registerObject).then(({body}) => {
    if(body.code === 200){
      let responseObject = {
        status : body.status,
        message : body.message
      };
      dispatch ({
        type: "FORGET_PASSWORD",
        payload: responseObject
      });
    }
    else{
      dispatch({
        type : "FORGET_PASSWORD",
        payload: {
          status:false,
          message : body.message
        }
      });
    }
  });
};

export  const GetList = (id) => (dispatch) => {
  let url = baseURL+"getList/"+id;
  GET(url).then(({body}) => {
    if(body.code === 200){
      let responseObject = {
        status : body.status,
        data : body.data,
        message : body.message
      };
      dispatch ({
        type: "GET_LIST",
        payload: responseObject
      });
    }
    else{
      dispatch({
        type : "GET_LIST",
        payload: {
          status:false,
          data: [],
          message : body.message
        }
      });
    }
  });
};

export  const GET_DAIMLERS = () => (dispatch) => {
  let url = baseURL+"daimler";
  GET(url).then(({body}) => {
    if(body.code === 200){
      let responseObject = {
        status : body.status,
        data : body.data,
        message : body.message
      };
      dispatch ({
        type: "GET_DAIMLERS_LIST",
        payload: responseObject
      });
    }
    else{
      dispatch({
        type : "GET_DAIMLERS_LIST",
        payload: {
          status:false,
          data: [],
          message : body.message
        }
      });
    }
  });
};

export  const DeleteContact = (id) => (dispatch) => {
  let url = baseURL+"deleteContact/"+id;
  let obj = {
    userObject : JSON.parse(localStorage.getItem("userObject"))
  };
  POST(url, obj).then(({body}) => {
    if(body.code === 200){
      if(obj.userObject.isSuperAdminFlag){
        dispatch(GET_DAIMLERS());
      }
      let responseObject = {
        status : body.status,
        data: body.data,
        message : body.message
      };
      dispatch ({
        type: "GET_LIST",
        payload: responseObject
      });
    }
    else{
      dispatch({
        type : "GET_LIST",
        payload: {
          status:false,
          data: [],
          message : body.message
        }
      });
    }
  });
};

export  const GetContact = (id) => (dispatch) => {
  let url = baseURL+"contact/"+id;
  GET(url).then(({body}) => {
    if(body.code === 200){
      let responseObject = {
        status : body.status,
        data: body.data,
        message : body.message
      };
      dispatch ({
        type: "GET_CONTACT",
        payload: responseObject
      });
    }
    else{
      dispatch({
        type : "GET_CONTACT",
        payload: {
          status:false,
          data: [],
          message : body.message
        }
      });
    }
  });
};

export  const Add_Contact = (obj) => (dispatch) => {
  let url = baseURL+"contact";
  let object = {
    userObject : JSON.parse(localStorage.getItem("userObject")),
    contact: obj
  };
  startLodaing(dispatch);
  POST(url, object).then(({body}) => {
    endLodaing(dispatch);
    if(body.code === 200){
      //if(object.userObject.isSuperAdminFlag){
        dispatch(GET_DAIMLERS());
      //}
      let responseObject = {
        status : body.status,
        data: body.data,
        message : body.message
      };
      dispatch ({
        type: "GET_LIST",
        payload: responseObject
      });
    }
    else{
      dispatch({
        type : "GET_LIST",
        payload: {
          status:false,
          data: [],
          message : body.message
        }
      });
    }
  });
};

export  const Edit_Contact = (obj) => (dispatch) => {
  let url = baseURL+"editContact";
  let object = {
    userObject : JSON.parse(localStorage.getItem("userObject")),
    contact: obj
  };
  POST(url, object).then(({body}) => {
    if(body.code === 200){
      let responseObject = {
        status : body.status,
        data: body.data,
        message : body.message
      };
      dispatch ({
        type: "GET_LIST",
        payload: responseObject
      });
    }
    else{
      dispatch({
        type : "GET_LIST",
        payload: {
          status:false,
          data: [],
          message : body.message
        }
      });
    }
  });
};

export  const Edit_Daimler = (obj) => (dispatch) => {
  let url = baseURL+"daimler/edit";
  let object = {
    userObject : JSON.parse(localStorage.getItem("userObject")),
    daimler: obj
  };
  POST(url, object).then(({body}) => {
    if(body.code === 200){
      let responseObject = {
        status : body.status,
        data: body.data,
        message : body.message
      };
      dispatch ({
        type: "GET_DAIMLERS_LIST",
        payload: responseObject
      });
    }
    else{
      dispatch({
        type : "GET_DAIMLERS_LIST",
        payload: {
          status:false,
          data: [],
          message : body.message
        }
      });
    }
  });
};

export  const Verify = (obj) => (dispatch) => {
  let url = baseURL+"verify";
  let object = {
    contact: obj
  };
  POST(url, object).then(({body}) => {
    if(body.code === 200){
      let responseObject = {
        status : body.status,
        data: body.data,
        message : body.message
      };
      dispatch ({
        type: "VERIFY",
        payload: responseObject
      });
    }
    else{
      dispatch({
        type : "VERIFY",
        payload: {
          status:false,
          data: [],
          message : body.message
        }
      });
    }
  });
};
