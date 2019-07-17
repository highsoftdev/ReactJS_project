import {Component} from "react";
import {connect} from "react-redux";
import {SetPassword} from "../actions/actions";
import {FormField} from "./formField";
import config from "../../config";
let feBaseURL = config.FE_BASE_URL;
export class ResetPassword extends Component{
  constructor(){
    super();

    this.state = {
      resetPassword : {
        status: false,
        message: ""
      },
      validate : false,
      setPassword : {
        values: {
          password: "",
          c_password: ""
        },
        validations: {
          password: {
            required: false
          },
          c_password: {
            required: ""
          }
        }
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount(){
    let id = this.props.location.search.split('=')[1];
    window.uuid = id;
  }

  componentWillReceiveProps(newProps){
    if(newProps.resetPassword.status){
      window.location.href = feBaseURL+"/app";
    }
    this.setState({resetPassword: newProps.resetPassword});
  }

  validate(fields){
    let isValid = true;
    Object.keys(fields).map(item => {
      Object.keys(fields[item]).map(valid => {
        if(!fields[item][valid])
          isValid = false;
      });
    });
    return isValid;
  }

  handleChange(target, err){
    let form = this.state.setPassword;
    form.values[target.name] = target.value;
    form.validations[target.name] = err;
    this.setState({
      setPassword : form
    });
  }

  handleSubmit(e){
    e.preventDefault();
    this.setState({validate: true});
    let formFields = this.state.setPassword;
    if(this.validate(formFields.validations) && formFields.values.password == formFields.values.c_password){
      this.props.SetPassword({password: formFields.values.password});
    }
  }

  render(){
    let {setPassword, validate, resetPassword} = this.state;
    return (
      <div className="container bg-color">
        <nav className="navbar row navbar-default register-header"> <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand p-t-0"><img width="100px" src="./assets/images/logo1.png"/></a>
          </div>
        </div>
        </nav>
        <form className="form-signin m-t-100" onSubmit={this.handleSubmit} noValidate>
          {!resetPassword.status &&
          <div className="reset-password">
            <h2 className="form-signin-heading fs-25 m-t-0 m-b-20">Neues Kennwort festlegen</h2>
            <label htmlFor="inputPassword" className="sr-only">Neues Kennwort</label>
            <FormField
              type="password"
              name="password"
              placeholder="Neues Kennwort"
              className="form-control"
              value={setPassword.values.password}
              onChange={this.handleChange}
              validations={{required: true}}
            />
            {(!setPassword.validations.password.required && validate) &&
            <span className="error">Kennwort erforderlich.</span>}
            <label htmlFor="inputPassword" className="sr-only">Kennwort bestätigen</label>
            <FormField
              type="password"
              name="c_password"
              placeholder="Kennwort bestätigen"
              className="form-control"
              value={setPassword.values.c_password}
              onChange={this.handleChange}
              validations={{required: true}}
            />
            {(setPassword.validations.c_password.required && setPassword.values.c_password !== setPassword.values.password) &&
            <span className="error">Keine Übereinstimmung.</span>}
            {(!setPassword.validations.c_password.required && validate) &&
            <span className="error">Kennwort erforderlich.</span>}
            <button className="btn btn-lg btn-primary btn-block" type="submit">Übernehmen</button>
          </div>
          }

          {resetPassword.status &&
          <div className="text-center verify-container">
            <div className="verify-email">
              <img src="./assets/images/tick.png" width="80px" height="100px"/>
              <p className="m-b-0">{resetPassword.message}</p>
            </div>
          </div>
          }

        </form>
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  resetPassword : state.user.resetPassword
});

const mapDispatchToProps = (dispatch) => ({
  SetPassword(obj){
    dispatch(SetPassword(obj));
  }
});

export const resetPasswordContainer =
  connect   (mapStateToProps, mapDispatchToProps)(ResetPassword);
