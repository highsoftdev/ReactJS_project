import {Component} from "react";
import {FormField} from "./formField";

export class AddDaimler extends Component{
  constructor(){
    super();

    this.state = {
      validate: false,
      domains : ['daimler.com','graubner-gmbh.de'],
      daimler : {
        values: {
          email : "",
          password : "",
          isAdminFlag: false
        },
        validations: {
          email:{
            email: true,
            required: true
          },
          password: {
            required: true
          }
        }
      }
    };

    this.handleChange    =   this.handleChange.bind(this);
    this.handleSubmit    =   this.handleSubmit.bind(this);
    this.handleChecked   =   this.handleChecked.bind(this);
    this.setDefaultContact = this.setDefaultContact.bind(this);
  }

  setDefaultContact(){
    let daimler = {
      values: {
        email : "",
        password : "",
        isAdminFlag: false
      },
      validations: {
        email:{
          email: true,
          required: true
        },
        password: {
          required: true
        }
      }
    };
    this.setState({
      daimler: daimler,
      validate: false
    });
  }

  handleChange(target, err){
    let contact = this.state.daimler;
    contact.values[target.name] = target.value;
    contact.validations[target.name] = err;
    this.setState({
      daimler : contact
    });
  }

  componentWillUpdate(nextProps, nextState) {
    if(this.props.data && this.props.data.status && !this.props.loading  && this.props.actionType=="GET_LIST" && this.props.data.message == "Kontaktdaten wurden gespeichert."){
      console.log("render message:", this.props.data.message);
      this.props.closeModal();
    }
  }

  componentWillReceiveProps(newProps){

     if(newProps.isOpen == true && !this.props.isOpen){
      this.setDefaultContact();
    }else if(this.props.isOpen==true && newProps.isOpen == true){

    } 

    if(newProps.daimler && Object.keys(newProps.daimler).length > 0){
      let contact = this.state.daimler;
      contact.values = newProps.daimler;
      this.setState({
        daimler: contact
      });
    }
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
  validateEmailFormat(contact){
     let isValid = true;
     if(this.state.domains.indexOf(contact.values.email.split('@')[1]) == -1){
        isValid = false;
     }
     return isValid;
  }
  handleSubmit(e){
    e.preventDefault();
    this.setState({validate: true});
    let contact = this.state.daimler;
    if(this.validate(contact.validations) && this.validateEmailFormat(contact)){
      if(this.props.edit){
        this.props.editDaimler(contact.values);
        this.props.closeEditModal();
      }
      else{
        this.props.add(contact.values);
      }
    }
  }

  handleChecked(e){
    let target = e.target;
    let daimler = this.state.daimler;
    daimler.values.isAdminFlag = target.checked;
    this.setState({
      daimler: daimler
    });
  }

  render(){
    let {daimler, validate} = this.state;
    return(
        <form onSubmit={this.handleSubmit} noValidate>
            <div className="col-md-12 col-xs-12 signupForm bg-white">
              <h2 className="form-signin-heading fs-25 m-t-0 m-b-20">Administrator-Kennung</h2>
              {
                (this.props.data && !this.props.data.status && !this.props.loading && this.state.validate) &&
                <div className="text-center">
                  <p className="m-b-0 error">{this.props.data.message}</p>
                </div>
              }
              <div className="row">
              <div className="col-md-4">
                <FormField
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="form-control"
                  value={daimler.values.email}
                  onChange={this.handleChange}
                  validations={daimler.validations.email}
                  disabled = {this.props.edit}
                />
                {daimler.values.email.length > 0 && daimler.validations.email.required && this.state.domains.indexOf(daimler.values.email.split('@')[1]) == -1 &&
                <span className="error">Email Adresse muss daimler.com oder graubner-gmbh.de enthalten.</span>}
                {!daimler.validations.email.required && validate &&
                <span className="error">Email-Adresse ist ein Pflichtfeld.</span>}
              </div>
              <div className="col-md-4">
                <FormField
                  type="password"
                  name="password"
                  placeholder="Kennwort"
                  className="form-control"
                  value={daimler.values.password}
                  onChange={this.handleChange}
                  validations={daimler.validations.password}
                />
                {!daimler.validations.password.required && validate && !this.props.edit && 
                <span className="error">Kennwort erforderlich.</span>}
              </div>
              <div className="col-md-4">
                <div className="input-group">
                  <span className="input-group-addon">
                    <span className="checkbox">
                      <label>
                        <input type="checkbox" checked={daimler.values.isAdminFlag} onClick={this.handleChecked} />
                        <span className="input-checkbox"></span>
                      </label>
                    </span>
                  </span>
                  <input type="text" className="form-control" value="Admin" />
                </div>
              </div>
              </div>

              <button className="btn btn-primary pull-right" type="submit">Speichern</button>
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