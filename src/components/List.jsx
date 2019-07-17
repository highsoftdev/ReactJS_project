import {Component} from "react";
import {connect} from "react-redux";
import {GetList,DeleteContact, Add_Contact, Edit_Contact, GET_DAIMLERS,Edit_Daimler} from "../actions/actions";
import {Contact} from "./modal/contacts";
import {Table} from "./TableComponent";
import {FormField} from "./formField";
import {AddContact} from "./addContact";
import {AddDaimler} from "./addDaimler";
import {UTILS} from "../utils/utilFunctions";
import config from "../../config";
let feBaseURL = config.FE_BASE_URL;
class ContactsListComponent extends Component{
  constructor(){
    super();

    this.state = {
      selected : "contacts",
      close: 0,
      list : {
        data : [],
        status : false,
        message : ""
      },
      action: true,
      search: "",
      filteredList: [],
      filteredDaimlers: [],
      instance : new Contact(),
      logedIn : {}
    };

    this.handleChange = this.handleChange.bind(this);
    this.searchFilter = this.searchFilter.bind(this);
    this.deleteContact = this.deleteContact.bind(this);
    this.closeClick = this.closeClick.bind(this);
    this.openClick = this.openClick.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  closeClick(count){
    this.setState({
      close: this.state.close+count,
      isopen: false
    });
  }

  openClick(){
    this.setState({
      isopen: true
    });
  }

 componentWillMount(){
   let userObject = JSON.parse(localStorage.getItem("userObject"));
   this.props.GetList(userObject.uuid);
   if(userObject.isSuperAdminFlag){
     this.props.GET_DAIMLERS();
   }
 }

 handleChange(target){
    this.setState({
      [target.name]: target.value
    });
    if(target.name=="search"){
      this.setState({
        [target.name]: target.value
      });
      this.searchFilter(null, target.value);
    }
 }

 setSelectedTab(tab){
    if(tab !== this.state.selected){
      let list = tab === "contacts" ? this.state.list.data : this.state.daimlers.data;
      this.state.search = "";
      $("#search").val("");
      this.setState({
        selected : tab,
        filteredList : list
      });
    }
 }

 searchFilter(e=null, searchdata){
  if(e)
    {
      e.preventDefault();
    }
    let state = this.state;
    console.log(searchdata);
    switch(state.selected){
      case "contacts":{
        let filtered = this.search(searchdata, state.list.data, state.instance.sequence());
        this.setState({
          filteredList : filtered
        });
        break;
      }
      case "daimlers":{
        let filtered = this.search(searchdata, state.daimlers.data, ['email']);
        this.setState({
          filteredDaimlers : filtered
        });
        break;
      }
    }
 }

  search(text, list , sequence){
    let filteredList = [];
    if(text!=""){
      for(let i = 0; i<list.length; i++){
        for(var item = 0; item < sequence.length ; item++){
          if(list[i][sequence[item]] && list[i][sequence[item]].toString().toLowerCase().indexOf(text.toLowerCase()) !== -1){
            filteredList.push(list[i]);
            break;
          }
        }
      }  
    }else{
      for(let i = 0; i<list.length; i++){
        for(var item = 0; item < sequence.length ; item++){
          if(list[i][sequence[item]]){
            filteredList.push(list[i]);
            break;
          }
        }
      }  
    }
    
    return filteredList;
  }

  shouldClick(obj){
    return !obj.loading && obj.data && obj.data.status
  }

  closeModal(){
    //$('.contact-modal').trigger('click');
    //$('.delete-modal').trigger('click');
    // this.setState({
    //   close: this.state.close+1,
    //   isopen: false
    // });
    this.closeClick(1);
    $('.contact-modal').modal('hide');
    $('.delete-modal').modal('hide');
  }

  componentWillReceiveProps(newProps){
    if(newProps.list && newProps.list.status){
      this.setState({
        list : newProps.list,
        daimlers : newProps.daimlers || {},
        filteredList : newProps.list.data,
        filteredDaimlers : newProps.daimlers ? newProps.daimlers.data : []
      });
    }
  }

  componentDidMount(){
    let logedIn = JSON.parse(localStorage.getItem("userObject"));
    
    this.setState({
      logedIn : logedIn
    });
  }

  deleteContact(id){
    this.props.DeleteContact(id);
  }

  render(){
    let {instance, action, filteredList, search, filteredDaimlers} = this.state;
    let headings = instance.headings();
    let sequence = instance.sequence();
    return (
      <div>
      <nav className="navbar navbar-default"> <div className="container-fluid">
        <div className="navbar-header">
          <button type="button" className="collapsed navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-2" aria-expanded="false"> <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span> <span className="icon-bar"></span>
          </button> <a href="#" className="navbar-brand p-t-0"><img width="100px" src="./assets/images/logo1.png"/></a>
        </div>
        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-2">
          <p className="navbar-text navbar-right" onClick={UTILS.logout}>
            <a href="#" className="navbar-link" href={feBaseURL+"/app"}>Ausloggen <i className="glyphicon glyphicon-log-out"></i></a>
          </p>
          <div className=" pull-right">
            <form className="navbar-form navbar-left" onSubmit={this.searchFilter} role="search">
              <div className="form-group">
                <FormField
                  type="text"
                  name="search"
                  id="search"
                  placeholder="Wonach?"
                  className="form-control"
                  value={search}
                  onChange={this.handleChange}
                />
              </div>
              <button type="submit" className="btn btn-default v-align-text-bottom" disabled>Suchen</button>
            </form>
          </div>

        </div>
      </div>
      </nav>
    <div className="m-t-100 col-xs-12 col-md-12">
      <div className="table-btns">
        <button className="btn btn-primary" data-target="#newContact" data-toggle="modal"  onClick={() => this.openClick()}>
          Neu
        </button>
      </div>
      {this.state.logedIn.isSuperAdminFlag &&
        <div>
      <ul className="nav nav-tabs">
        <li role="presentation" className="active" onClick={({selected = "contacts"}) => this.setSelectedTab(selected)} >
          <a data-toggle="tab" href=".contacts-list">Kontakten</a>
        </li>
        <li role="presentation" onClick={({selected = "daimlers"}) => this.setSelectedTab(selected)} >
          <a data-toggle="tab" href=".daimlers-list">Admins</a>
        </li>
      </ul>
          <div className="tab-content">
          <div className="contacts-list tab-pane fade in active">
            <Table list={filteredList} headings={headings}
                   sequence={sequence} actions={action}
                   delete={this.deleteContact} edit={this.props.Edit_Contact}
                   shouldClick={this.shouldClick(this.props)} />
          </div>
          <div className="daimlers-list tab-pane">
            <Table list={filteredDaimlers} headings={['Email']}
                   sequence={['email']} actions={action}
                   delete={this.deleteContact} edit={this.props.editDaimler}
                   shouldClick={this.shouldClick(this.props)} />
          </div>
        </div>
        </div>
      }
      {
        !this.state.logedIn.isSuperAdminFlag &&
        <Table list={filteredList} headings={headings}
               sequence={sequence} actions={action}
               delete={this.deleteContact} edit={this.props.Edit_Contact} />
      }

      </div>
    <div className="modal fade bs-example-modal-lg contact-modal" id="newContact"  tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-body no-padding no-margin">
            <button type="button" className="daimler-icon  close" data-dismiss="modal" aria-label="Close" onClick={() => this.closeClick(1)} >
              <i className="glyphicon glyphicon-remove"></i>
            </button>
            {
              this.state.selected === "contacts" ?
              <AddContact add={this.props.Add_Contact} edit={false} actionType={this.props.actionType} isOpen={this.state.isopen} closeCount={this.state.close} loading={this.props.loading} data={this.props.list} closeModal={this.closeModal} /> :
                <AddDaimler add={this.props.Add_Contact} edit={false} actionType={this.props.actionType} isOpen={this.state.isopen} closeCount={this.state.close} loading={this.props.loading} data={this.props.list} closeModal={this.closeModal} />
            }
          </div>
        </div>
      </div>
    </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  list : state.user.list,
  daimlers: state.user.daimlers,
  loading: state.user.loading,
  actionType: state.user.actionType
});

const mapDispatchToProps = (dispatch) => ({
  GetList(id){
    dispatch(GetList(id));
  },
  DeleteContact(id){
    dispatch(DeleteContact(id));
  },
  Add_Contact(obj){
    dispatch(Add_Contact(obj));
  },
  Edit_Contact(obj){
    dispatch(Edit_Contact(obj));
  },
  GET_DAIMLERS(){
    dispatch(GET_DAIMLERS());
  },
  editDaimler(obj){
    dispatch(Edit_Daimler(obj));
  }
});

export const listContainer =
  connect   (mapStateToProps, mapDispatchToProps)(ContactsListComponent);
