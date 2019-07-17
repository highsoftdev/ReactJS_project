import {Component} from "react";
import {Contact} from "./modal/contacts";
import {FormField} from "./formField";
import {ValidationChecker} from "../utils/validations";

export class AddContact extends Component{
  constructor(){
    super();

    this.state = {
      validate: false,
      domain : null,
      contact : {
        values: new Contact(),
        validations: new Contact().getAddValidations()
      }
    };
    this.handleChange    =   this.handleChange.bind(this);
    this.handleSubmit    =   this.handleSubmit.bind(this);
    this.setDefaultContact = this.setDefaultContact.bind(this);
  }

  componentWillMount(){
    let userObject = JSON.parse(localStorage.getItem("userObject"));
    if(!userObject.isAdminFlag && !userObject.isSuperAdminFlag) {
      this.setState({
        domain: userObject.email.split('@')[1]
      });
    }
  }

  isSuperAdmin(){
    let userObject = JSON.parse(localStorage.getItem('userObject'));
    return (userObject.isAdminFlag || userObject.isSuperAdminFlag) ? true : false;
  }

  handleChange(target, err){
    let contact = this.state.contact;
    contact.values[target.name] = target.value;
    contact.validations[target.name] = err;
    this.setState({
      contact : contact
    });
  }

  setDefaultContact(){

    let contact = {
      values: new Contact(),
      validations: this.props.edit? new Contact().getEditValidations() : new Contact().getAddValidations()
    }

    this.setState({
      contact: contact,
      validate: false
    });
  }

  
  emailCheck(email){
    let regex = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return regex.test(email);
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

  checkFieldValidations(contact){
    let isValid = true;

    Object.keys(contact.validations).map(item => { 
      if(item.indexOf('phone')==-1 && contact.validations[item].required!=null && !contact.validations[item].required && ((contact.values[item]!=null && contact.values[item].length == 0) || contact.values[item]==null)){
        isValid = false;
      }
    });
    if((contact.values['phone_office'] == null || contact.values['phone_office'].length==0) && (contact.values['phone_mobile'] == null || contact.values['phone_mobile'].length==0)){      
        isValid = false;
    }
    return isValid;
  }
  
  handleSubmit(e){
    e.preventDefault();
    this.setState({validate: true});
    let contact = this.state.contact;
    console.log("click");
    if((this.isSuperAdmin() || (this.state.domain && contact.values.email.indexOf(this.state.domain) > 0)) && ((this.validate(contact.validations)) || (this.checkFieldValidations(contact) && this.props.edit))){
      if(this.props.edit){
        this.props.editContact(contact.values);
        this.props.closeEditModal();
        console.log("super edit");
      }
      else{
        console.log("super add");
        this.props.add(contact.values);
      }
    }
  }

   componentWillUpdate(nextProps, nextState) {
      console.log(this.props.data?this.props.data.message:"no msg");
    if(!this.props.edit && this.props.isOpen && this.props.data && this.props.data.status && !this.props.loading  && this.props.actionType=="GET_LIST" && this.props.data.message == "Kontaktdaten wurden gespeichert."){
      this.props.closeModal();
    }
    else if(this.props.edit){

    }
  }

  componentWillReceiveProps(newProps){
    if(newProps.isOpen == true && !this.props.isOpen && !this.props.edit){
      this.setDefaultContact();
    }
    if(newProps.contact && Object.keys(newProps.contact).length > 0){
      let contact = this.state.contact;
      contact.values = newProps.contact || this.state.contact.values;
      contact.validations = this.props.edit? new Contact().getEditValidations() : new Contact().getAddValidations()
      this.setState({
        contact: contact
      });
    }
  }
  
  render(){
    let {contact, validate, domain} = this.state;
    // if(this.props.data && this.props.data.status && !this.props.loading  && this.props.actionType=="GET_LIST" && this.props.data.message == "Kontaktdaten wurden gespeichert."){
    //   console.log("render message:", this.props.data.message);
    //   //this.setDefaultContact();
    //   this.props.closeModal();
    // }
    return(
        <form onSubmit={this.handleSubmit} noValidate>
            <div className="col-md-12 col-xs-12 signupForm bg-white">
              <h2 className="form-signin-heading fs-25 m-t-0 m-b-20">Kontaktdaten</h2>
              {
                (!this.props.edit && this.props.data && !this.props.data.status && !this.props.loading && this.state.validate) &&
                <div className="text-center">
                  <p className="m-b-0 error">{this.props.data.message}</p>
                </div>
              }
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
                {!contact.validations.contact_name.required && validate && !this.props.edit && 
                <span className="error">Kontaktperson erforderlich.</span>}
                {!contact.validations.contact_name.required && !contact.values.contact_name && this.props.edit && 
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
                {!contact.validations.company_name.required && validate && !this.props.edit && 
                <span className="error">Firmenname erforderlich.</span>}
                {!contact.validations.company_name.required && !contact.values.company_name && this.props.edit && 
                <span className="error">Firmenname erforderlich.</span>}
              </div>
              <div className="col-md-3">
                <FormField
                  type="text"
                  name="phone_mobile"
                  placeholder="Handynummer"
                  className="form-control"
                  value={contact.values.phone_mobile}
                  onChange={this.handleChange}
                  validations={contact.validations.phone_mobile}
                />
                {validate && !this.props.edit && !contact.values.phone_mobile && !contact.values.phone_office &&  
                <span className="error">Handy- oder Festnetznummer wird erwartet.</span>}
                {!contact.values.phone_mobile && !contact.values.phone_office && this.props.edit && 
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
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="form-control"
                  value={contact.values.email}
                  onChange={this.handleChange}
                  validations={contact.validations.email}
                  disabled = {this.props.edit}
                />
                {contact.values.email.length>0 && domain && contact.values.email.indexOf('@'+domain) === -1 && !this.props.edit   && 
                <span className="error">Email-Address soll {domain} enthalten.</span>}
                {contact.values.email.length>0 && !this.emailCheck(contact.values.email) && !this.props.edit  && 
                <span className="error">Falscher Email-Format.</span>}
                {!contact.validations.email.required && validate && !this.props.edit && 
                <span className="error">Email-Addresse erforderlich.</span>}
              </div>
              <div className="col-md-3">
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
              <div className="col-md-3">
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
              <div className="col-md-3">
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
              {
                //this.isSuperAdmin() ? 
                true == true ?
                <div className="row">
                <div className="col-md-3"></div>
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
                  {!contact.validations.password.required && validate && !this.props.edit && 
                  <span className="error">Kennwort erforderlich.</span>}
                </div>
                <div className="col-md-3"></div>
              </div>
                : null
              }
              

              <button className="btn btn-primary pull-right" type="submit">Änderungen speichern</button>
              
              {
                this.props.loading && 
                <div className="text-center">
                  <i class=" fa fa-spinner fa-spin"></i>
                </div>
              }
              
            </div>
        </form>
    );
  }
}