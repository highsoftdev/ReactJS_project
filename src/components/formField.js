import {Component} from "react";
import {validations as Validations} from "../utils/validations";

export class FormField extends Component{
  constructor(){
    super();

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e){
    let target = e.target;
    let value = target.value;
    let validations = this.props.validations;
    let err = {};
    validations &&
    Object.keys(validations).map(item => {
      err[item] = Validations[item](value)
    });
    this.props.onChange(target, err);
  }

  render(){
    let props = this.props;
    return(
      <input
        type={props.type || "text"}
        name={props.name || "name"}
        className={props.className}
        id={props.id}
        placeholder={props.placeholder}
        value={props.value || ""}
        onChange={this.handleChange}
        disabled = {props.disabled || ""}
      />
    )
  }
}