import {Component} from "react";
import {connect} from "react-redux";
import {Login, Register, ForgetPassword} from "../actions/actions";
import {FormField} from "./formField";
import config from "../../config";
let feBaseURL = config.FE_BASE_URL;
export class AppComponent extends Component {
  constructor() {
    super();
    this.state = this.setDefaultState();

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setDefaultState = this.setDefaultState.bind(this);
    this.forgetPassword = this.forgetPassword.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);

  }
  handleCheckboxChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      ['rememberme']: value
    });
  }
  setDefaultState(currentForm){
    let state = (!this.state || (this.state && this.state.form !== currentForm)) &&
      {
      form : currentForm || "login",
      validate: false,
      forgetPassword: false,
      response : "",
            rememberme: false,

      login: {
        values: {
          email: "",
          password: ""
        },
        validations: {
          email: {
            email : false,
            required: false
          },
          password: {
            required : false
          }
        }
      },
      register: {
        values: {
          email: ""
        },
        validations: {
          email: {
            email : false,
            required: false
          }
        }
      }
    };
    if(!this.state){
      return state;
    }
      this.setState(state);
  }

  componentWillMount(){
    if(localStorage.getItem("rememberdObject")!=undefined && localStorage.getItem("rememberdObject")!=null){
      let userObject = JSON.parse(localStorage.getItem("rememberdObject"));
       localStorage.setItem("userObject",JSON.stringify(userObject));
       window.location.href = feBaseURL+"/list";
    }
  }

  componentWillReceiveProps(newProps){
    let response = "";
    if(newProps.register.status){
      response = "Überprüfen Sie Ihre Emails um Ihre Anmeldung zu bestätigen.";
    }
    else if(newProps.forgetPassword.status){
      response = "Überprüfen Sie Ihre Emails um Ihren Passwort zurück zu setzen";
    }
    else if(newProps.login.status){
      if(this.state.rememberme == true){
        localStorage.setItem("rememberdObject",JSON.stringify(newProps.login.data));
      }
      localStorage.setItem("userObject",JSON.stringify(newProps.login.data));
      window.location.href = feBaseURL+"/list";
    }
    this.setState({response});
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

  handleSubmit(e){
    e.preventDefault();
    this.setState({validate: true});
    let formFields = this.state[this.state.form];
    if(this.validate(formFields.validations)){
      switch (this.state.form){
        case "login":{
          this.props.loginAction(formFields.values);
          break;
        }
        case "register": {
          this.props.registerAction(formFields.values);
          break;
        }
      }
    }
  }

  forgetPassword(e){
    e.preventDefault();
    let validations = this.state.login.validations.email;
    let valid = true;
    this.setState({
      forgetPassword : true
    });
    Object.keys(validations).map(item => {
      if(!validations[item]){
        valid = false;
      };
    });
    if(valid){
      let obj = {
        email : this.state.login.values.email
      };
      this.props.forgetPasswordAction(obj);
    }

  }

  handleChange(target, err){
    let form = this.state[this.state.form];
    form.values[target.name] = target.value;
    form.validations[target.name] = err;
    this.setState({
      [target.name] : target.value
    });
  }

  render() {
    let {validate,login, register, form, forgetPassword, response} = this.state;
    let props = this.props;
    return (
      <div className="container bg-color">
        <form className="form-signin" onSubmit={this.handleSubmit} noValidate>
          {
            !props.login.status && !props.register.status && !props.forgetPassword.status &&
              <ul className="nav nav-tabs">
                <li role="presentation" className="active" onClick={({currentForm = "login"}) => this.setDefaultState(currentForm)}>
                  <a data-toggle="tab" href=".login">Einloggen</a>
                </li>
                <li role="presentation" onClick={({currentForm = "register"}) => this.setDefaultState(currentForm)}>
                  <a data-toggle="tab" href=".register">Registrieren</a>
                </li>
              </ul>
          }

          {
            !props.login.status && !props.register.status && !props.forgetPassword.status &&
            <div className="tab-content m-t-20">
              <div className="tab-pane fade in active login">
                <h2 className="form-signin-heading fs-25 m-t-0 m-b-20">Bitte melden Sie sich an</h2>
                <label htmlFor="inputEmail" className="sr-only">Email</label>
                <FormField
                  type="email"
                  name="email"
                  id="inputEmail"
                  placeholder="Email"
                  className="form-control"
                  value={login.values.email}
                  onChange={this.handleChange}
                  validations={{email: true,required: true}}
                />
                {(login.validations.email.required && !login.validations.email.email) &&
                <span className="error">Ungültige Email-Adresse</span>}
                {(!login.validations.email.required && ( validate || forgetPassword)) &&
                <span className="error">Email-Adresse erforderlich.</span>}

                <label htmlFor="inputPassword" className="sr-only">Kennwort</label>
                <FormField
                  type="password"
                  name="password"
                  id="inputPassword"
                  placeholder="Kennwort"
                  className="form-control"
                  value={login.values.password}
                  onChange={this.handleChange}
                  validations={{required: true}}
                />
                {(!login.validations.password.required && validate) &&
                <span className="error">Kennwort erforderlich</span>}
                <div className="checkbox">
                  <label>
                    <input type="checkbox" checked={this.state.rememberme} onChange={this.handleCheckboxChange}/>
                    <span className="input-checkbox"></span> Auf diesem Gerät merken
                  </label>
                </div>
                <button className="btn btn-lg btn-primary btn-block" type="submit">Einloggen</button>
                <div className="forgot-pass" onClick={this.forgetPassword}>
                  <a href="#">Kennwort vergessen?</a>
                </div>

              </div>
              {
                this.props.loading && form === "login" &&
                <div className="text-center">
                  <i class=" fa fa-spinner fa-spin"></i>
                </div>
              }
              {
                form === "login" &&
                <div className="error-msg"><span className="error">{props.login.message || props.forgetPassword.message}</span></div>
              }
              <div className="tab-pane fade register">
                <h2 className="form-signin-heading fs-25 m-t-0 m-b-20">Registrieren</h2>
                <label htmlFor="registerInputEmail" className="sr-only">Email</label>
                <FormField
                  type="email"
                  name="email"
                  id="registerInputEmail"
                  placeholder="Email"
                  className="form-control"
                  value={register.values.email}
                  onChange={this.handleChange}
                  validations={{email: true,required: true}}
                />
                {(register.validations.email.required && !register.validations.email.email) &&
                <span className="error">Ungültige Email-Adresse</span>}
                {(!register.validations.email.required && ( validate || forgetPassword)) &&
                <span className="error">Email-Adresse erforderlich.</span>}
                <button className="btn btn-lg btn-primary btn-block m-t-30" type="submit">Registrieren</button>
              </div>
              {
                this.props.loading && form === "register" &&
                <div className="text-center">
                  <i class=" fa fa-spinner fa-spin"></i>
                </div>
              }
              {
                form === "register" &&
                <div className="error-msg"><span className="error">{props.register.message}</span></div>
              }
              </div>
          }

          {
            (props.register.status || props.forgetPassword.status || props.login.status) &&
            <div className="text-center verify-container">
              <div className="verify-email">
                <img src="./assets/images/tick.png" width="80px" height="100px"/>
                <p className="m-b-0">{response}</p>
                <h2 className="form-signin-heading fs-25 m-t-0 m-b-20">
                  <a href={feBaseURL+"/app"}>Einloggen</a>
                </h2>
              </div>
            </div>
          }
        </form>
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  loading: state.user.loading,
  login : state.user.login || {},
  register: state.user.register || {},
  forgetPassword: state.user.forgetPassword || {},
  actionType: state.user.actionType
});

const mapDispatchToProps = (dispatch) => ({
    loginAction(loginObject) {
        dispatch(Login(loginObject));
      },
    registerAction(registerObject){
      dispatch(Register(registerObject));
    },
    forgetPasswordAction(obj){
      dispatch(ForgetPassword(obj));
    }
});

export const appContainer =
  connect   (mapStateToProps, mapDispatchToProps)(AppComponent);
