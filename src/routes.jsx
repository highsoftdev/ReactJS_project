import React from "react";
import {appContainer as AppContainer} from "./components/app";
import {dataSetContainer} from "./components/dataSet";
import {resetPasswordContainer as ResetPasswordContainer} from "./components/resetPasswordComponent";
import {listContainer as ListContainer} from "./components/List";
import {Route,BrowserRouter as Router} from "react-router-dom";
import config from "../config";
let feBaseURL = config.FE_BASE_URL;
export const routes = () => (

  <Router>
    <div>      
      <Route path={feBaseURL+"/app"} exact component={AppContainer}  />
      <Route path={feBaseURL+"/resetPassword"} exact component={ResetPasswordContainer} />
      <Route path={feBaseURL+"/verify"} exact component={dataSetContainer}/>
      <Route path={feBaseURL+"/list"} exact component={ListContainer} />
    </div>
  </Router>
);
