export class Contact{
  constructor(){
    this.uuid          =   "";
    this.company_name  =   "";
    this.contact_name  =   "";
    this.email         =   "";
    this.password      =   "";
    this.c_password    =   "";
    this.phone_office  =   "";
    this.phone_mobile  =   "";
    this.position      =   "";
    this.street        =   "";
    this.town          =   "";
    this.zip           =   "";
    this.field         =   "";
    this.department    =   "";
    this.fax           =   "";
    this.activeFlag    =   true;
  }

  sequence(){
    return [
      "company_name",
      "contact_name",
      "email",
      "phone_office",
      "phone_mobile",
      "position",
      "field",
      "department",
      "street",
      "town",
      "zip",
      "fax"
    ];
  }

  headings(){
    return [
      "Firmenname",
      "Kontaktperson",
      "Email",
      "Festnetznummer",
      "Mobilnummer",
      "Position",
      "Bereich",
      "Abteilung",
      "Strasse",
      "Stadt",
      "Postleitzahl",
      "Fax"
    ]
  }

  getValidations(){
    return {
      "company_name": {required: false},
      "contact_name": {required: false},
      "phone_office":{required: false},
      "password": {required: false},
      "c_password":{required: false},
      "phone_mobile":{required: false},
      "position":{},
      "field":{},
      "department":{},
      "street":{},
      "town":{},
      "zip":{},
      "fax":{}
    }
  }
  getAddValidations(){
    return {
      "company_name": {required: false},
      "contact_name": {required: false},
      "email" :{required:false, email: false},
      "phone_office":{required: false},
      "phone_mobile":{required: false},
      "position":{},
      "field":{},
      "department":{},
      "street":{},
      "town":{},
      "zip":{},
      "fax":{},
      "password":{required: false}
    }
  }
  getEditValidations(){
    return {
      "company_name": {required: false},
      "contact_name": {required: false},
      "email" :{},
      "phone_office":{required: false},
      "password":{required: true},
      "phone_mobile":{required: false},
      "position":{},
      "field":{},
      "department":{},
      "street":{},
      "town":{},
      "zip":{},
      "fax":{}
    }
  }
}