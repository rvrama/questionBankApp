import React, { Component } from 'react';
import Groups from '../Groups/Groups';
import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom';
import Modal from './../../components/UI/Modal/Modal';
import * as actions from '../../store/actions/index';


class Home extends Component {                    
     state = { showerror: false}

  CloseErrorModal = () => {
    this.setState({showerror:false});
  }

  OnGroupItemClicked = (grpId) => {
      if (this.props.isAuthenticated){
        this.props.OnSetSelectedGroupId(grpId);
        //set the group name selected in the store
        //for now pass in query param
        this.props.history.push('/question');
      }
      else{
        this.setState({showerror:true});
        }
      }

    render() {
    
      let output;

      if (this.state.showerror){
        output =  (<Modal show={this.state.showerror} modalClosed={this.CloseErrorModal}>
          Please Log in.
          </Modal>);
      }
      else{
        output = (<div>
                    <div>
                        <Groups isAuthenticated={this.props.isAuthenticated}
                                groupClicked={(grpId) => this.OnGroupItemClicked(grpId)}
                                  />
                    </div>
                </div>);
      }
    
    
    return (output);
    }
}
const mapStateToProps = state => {
    return {
      isAuthenticated: state.auth.token !== null
    };
  };
  
  
const mapDispatchToProps = dispatch => {
  return {
      OnSetSelectedGroupId : (grpId) => dispatch(actions.setSelectedGroupId(grpId))
  };
};

export default withRouter (connect(mapStateToProps, mapDispatchToProps) (Home));