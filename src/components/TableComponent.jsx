import {Component} from "react";
import {AddContact} from "./addContact";
import {AddDaimler} from "./addDaimler";

export class Table extends Component{
  constructor(){
    super();
    this.state = {
      headings : [],
      sequence : [],
      editObject: {},
      deleteObject: {}
    };

    this.deleteContact = this.deleteContact.bind(this);
    this.closeEditModal = this.closeEditModal.bind(this);
    this.closeDeleteModal = this.closeDeleteModal.bind(this);
  }

  componentWillReceiveProps(newProps){
    if(newProps.shouldClick){
      $('#deleteModalCloseButton').trigger('click');
    }
    let {headings, sequence } = newProps;
    if(newProps.actions){
      headings.push('Aktion');
      sequence.push('actions');
    }
    this.setState({
      headings : headings,
      sequence : sequence
    });
  }

  showEditModal(obj){
    obj.password="";
    this.setState({
      editObject : Object.assign({}, obj)
    });
  }

  deleteContact(){
    let userObject = JSON.parse(localStorage.getItem('userObject'));
    this.state.deleteObject && this.state.deleteObject.email !== userObject.email ?
    this.props.delete(this.state.deleteObject.uuid) : null;
    this.closeDeleteModal();

  }

  closeDeleteModal(){
    $('.delete-modal').modal('hide');
  }

  closeEditModal(){
    $('.contact-modal').modal('hide');
    $('.delete-modal').modal('hide');
  }

  showDeleteModal(obj){
    this.setState({
      deleteObject : obj
    });
  }

  setActionIcons(obj){
    return <td><i className="glyphicon glyphicon-edit m-r-5" data-toggle="modal" data-target=".edit-modal" title="Korrigieren" onClick={({item=obj}) =>this.showEditModal(item)}></i>
      <i className="glyphicon glyphicon-trash m-r-5" data-toggle="modal" data-target=".delete-modal" title="Löschen" onClick={({item=obj}) =>this.showDeleteModal(item)}></i>
    </td>
  }

  render(){
    let {list} = this.props;
    let {headings , sequence} = this.state;
    return (
      <div className="list-table table-responsive">
        <table className="table table-hover">
          <thead>
          <tr>
            {headings.map((head, index) =>
              <th key={index} className="daimler-table-header">{head}</th>
            )}
          </tr>
          </thead>
          <tbody>
          {list.map((obj) =>
            (<tr key={obj.uuid}>
              {sequence.map((item, i) => {
                return !obj[item] ?
                  item === "actions" ? this.setActionIcons(obj)
                    :<td key={i}>--</td> :
                  <td key={i}>{obj[item]}</td>
              })}
            </tr>)
          )}
          </tbody>
        </table>

        <div className="modal fade bs-example-modal-lg edit-modal contact-modal" id="editContact"  tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-body no-padding no-margin">
                <button type="button" className="daimler-icon  close" data-dismiss="modal" aria-label="Close" onClick={this.closeEditModal}>
                  <i className="glyphicon glyphicon-remove"></i>
                </button>
                {headings.length > 3 ?
                  <AddContact editContact={this.props.edit} contact={this.state.editObject} edit={true} closeEditModal={this.closeEditModal}/> :
                  <AddDaimler daimler={this.state.editObject} edit={true} editDaimler={this.props.edit} closeEditModal={this.closeEditModal}/>
                }
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade bs-example-modal-sm delete-modal" id="DeleteModal" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="daimler-icon close" id="deleteModalCloseButton" data-dismiss="modal" aria-label="Close" onClick={this.closeDeleteModal}>
                  <i className="glyphicon glyphicon-remove"></i>
                </button>
                <h4 className="modal-title" id="myModalLabel">Kontaktdaten löschen</h4>
              </div>
              <div className="modal-body">
              Möchten Sie diesen Kontakt wirklich löschen?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={this.deleteContact}>Ja</button>
              </div></div></div>
        </div>

        </div>
    );
  }
}
