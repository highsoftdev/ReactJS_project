import {Component} from "react";
import {connect} from "react-redux";
import {FormField} from "./formField";
import {Contact} from "./modal/contacts";
import {GetContact, Verify, SetPassword} from "../actions/actions";
import {ResetPassword} from "./resetPasswordComponent";
import config from "../../config";
let feBaseURL = config.FE_BASE_URL;
class DataSetComponent extends Component{
  constructor(){
    super();
    this.state = {
      contact : {
        values: new Contact(),
        validations: new Contact().getValidations()
      },
      validate: false,
      isDaimler: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount(){
    let id = this.props.location.search.split('=')[1];
    this.props.GetContact(id);
  }

  componentWillReceiveProps(newProps){
    let isDaimler = true;
    if(newProps.verify && newProps.verify.status){
      localStorage.setItem("userObject",JSON.stringify(newProps.verify.data));
      window.location.href = feBaseURL+"/list";
    }
    if(newProps.resetPassword && newProps.resetPassword.status){
      window.location.href =  feBaseURL+"/list";
    }
    if(newProps.contact.status){
      localStorage.setItem("userObject",JSON.stringify(newProps.contact.data));
      isDaimler = Object.keys(newProps.contact.data).length < 7;
      let contact = this.state.contact;
      contact.values = newProps.contact.data
      this.setState({
        contact: contact,
        isDaimler: isDaimler
      });
    }
  }

  handleChange(target, err){
    let contact = this.state.contact;
    contact.values[target.name] = target.value;
    contact.validations[target.name] = err;
    this.setState({
      contact : contact
    });
  }

  validate(fields){
    let isValid = true;
    let phoneValid = false;
    Object.keys(fields).map(item => {
      Object.keys(fields[item]).map(valid => {
        if(item.indexOf('phone') !== -1 && fields[item][valid]){
          phoneValid = true;
        }
        else if(item.indexOf('phone') == -1 && !fields[item][valid]){
          isValid = false;
        }
      });
    });
    return isValid && phoneValid;
  }

  handleSubmit(e){
    e.preventDefault();
    this.setState({validate: true});
    let contact = this.state.contact;
    if(this.validate(contact.validations) && contact.values.password == contact.values.c_password){
      if((contact.values['phone_office'] == null || contact.values['phone_office'].length==0) && (contact.values['phone_mobile'] == null || contact.values['phone_mobile'].length==0)){      
        return;
      }
      this.props.Verify(contact.values);
    }
  }

  render(){
    let {contact, isDaimler, validate} = this.state;
    if(isDaimler){
      return <ResetPassword location={this.props.location} SetPassword={this.props.SetPassword}/>
    }
    else{
    return (
      <div className="container bg-color">
        <nav className="navbar row navbar-default register-header"> <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand p-t-0"><img width="100px" src="./assets/images/logo1.png"/></a>
          </div>
        </div>
        </nav>
        <form className="m-b-30 m-t-100" onSubmit={this.handleSubmit}>
          <div>
            <div className="col-md-10 col-xs-10 col-md-offset-1 col-xs-offset-1 signupForm bg-white">
              <h2 className="form-signin-heading fs-25 m-t-0 m-b-20">Bitte füllen Sie das Anmeldeformular aus</h2>
              <div className="row">
              <div className="col-md-3">
                <FormField
                  type="text"
                  name="contact_name"
                  placeholder="Kontaktperson"
                  className="form-control"
                  value={contact.values.contact_name}
                  onChange={this.handleChange}
                  validations={contact.validations.contact_name}
                />
                {!contact.validations.contact_name.required && validate &&
                <span className="error">Kontaktperson erforderlich.</span>}

              </div>
              <div className="col-md-3">
                <FormField
                  type="text"
                  name="company_name"
                  placeholder="Firmenname"
                  className="form-control"
                  value={contact.values.company_name}
                  onChange={this.handleChange}
                  validations={contact.validations.company_name}
                />
                {!contact.validations.company_name.required && validate &&
                <span className="error">Firmenname erforderlich.</span>}
              </div>
              <div className="col-md-3">
                <FormField
                  type="text"
                  name="phone_mobile"
                  placeholder="Mobilnummer"
                  className="form-control"
                  value={contact.values.phone_mobile}
                  onChange={this.handleChange}
                  validations={contact.validations.phone_mobile}
                />
                {validate && !contact.values.phone_mobile && !contact.values.phone_office &&  
                <span className="error">Handy- oder Festnetznummer wird erwartet.</span>}
              </div>
              <div className="col-md-3">
                <FormField
                  type="text"
                  name="phone_office"
                  placeholder="Festnetznummer"
                  className="form-control"
                  value={contact.values.phone_office}
                  onChange={this.handleChange}
                  validations={contact.validations.phone_office}
                />
              </div>
              </div>
              <div className="row">
              <div className="col-md-3">
                <FormField
                  type="text"
                  name="street"
                  placeholder="Strasse"
                  className="form-control"
                  value={contact.values.street}
                  onChange={this.handleChange}
                  validations={contact.validations.street}
                />
              </div>
              <div className="col-md-3">
                <FormField
                  type="text"
                  name="town"
                  placeholder="Stadt"
                  className="form-control"
                  value={contact.values.town}
                  onChange={this.handleChange}
                  validations={contact.validations.town}
                />
              </div>
              <div className="col-md-3">
                <FormField
                  type="text"
                  name="zip"
                  placeholder="Postleitzahl"
                  className="form-control"
                  value={contact.values.zip}
                  onChange={this.handleChange}
                  validations={contact.validations.zip}
                />
              </div>
              <div className="col-md-3">
                <FormField
                  type="text"
                  name="fax"
                  placeholder="Fax"
                  className="form-control"
                  value={contact.values.fax}
                  onChange={this.handleChange}
                  validations={contact.validations.fax}
                />
              </div>
              </div>
              <div className="row">
              <div className="col-md-4">
                <FormField
                  type="text"
                  name="department"
                  placeholder="Abteilung"
                  className="form-control"
                  value={contact.values.department}
                  onChange={this.handleChange}
                  validations={contact.validations.department}
                />
              </div>
              <div className="col-md-4">
                <FormField
                  type="text"
                  name="field"
                  placeholder="Bereich"
                  className="form-control"
                  value={contact.values.field}
                  onChange={this.handleChange}
                  validations={contact.validations.field}
                />
              </div>
              <div className="col-md-4">
                <FormField
                  type="text"
                  name="position"
                  placeholder="Position"
                  className="form-control"
                  value={contact.values.position}
                  onChange={this.handleChange}
                  validations={contact.validations.position}
                />
              </div>
              </div>
              <div className="row">
              <div className="col-md-6">
                <FormField
                  type="password"
                  name="password"
                  placeholder="Kennwort"
                  className="form-control"
                  value={contact.values.password}
                  onChange={this.handleChange}
                  validations={contact.validations.password}
                />
                {!contact.validations.password.required && validate &&
                <span className="error">Kennwort erforderlich.</span>}
              </div>
              <div className="col-md-6">
                <FormField
                  type="password"
                  name="c_password"
                  placeholder="Bestätigen Sie das Kennwort"
                  className="form-control"
                  value={contact.values.c_password}
                  onChange={this.handleChange}
                  validations={contact.validations.c_password}
                />
                {contact.validations.c_password.required && contact.values.password !== contact.values.c_password &&
                <span className="error">Keine Übereinstimmung.</span>}
                {!contact.validations.c_password.required && validate &&
                <span className="error">Kennwort erforderlich.</span>}
              </div>
              </div>

              <button className="btn btn-primary pull-right" type="submit">Änderungen speichern</button>
            </div>
          </div>
        </form>
      </div>
    );
    }
  }
}


const mapStateToProps = (state) => ({
  contact: state.user.contact,
  verify : state.user.verify,
  resetPassword : state.user.resetPassword
});

const mapDispatchToProps = (dispatch) => ({
  GetContact(id){
    dispatch(GetContact(id));
  },
  Verify(obj){
    dispatch(Verify(obj));
  },
  SetPassword(obj){
    dispatch(SetPassword(obj));
  }
});

export const dataSetContainer =
  connect   (mapStateToProps, mapDispatchToProps)(DataSetComponent);
