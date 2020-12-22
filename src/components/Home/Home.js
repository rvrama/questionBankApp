import React, { Component } from 'react';
import Groups from '../Groups/Groups';
import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom';
import * as actions from '../../store/actions/index';


class Home extends Component {                    

  OnGroupItemClicked = (grpId) => {
    this.props.OnSetSelectedGroupId(grpId);
    //set the group name selected in the store
    //for now pass in query param
    this.props.history.push('/question');
    }

    render() {
    return (
        <div>
              <div>
                   <Groups isAuthenticated={this.props.isAuthenticated}
                           groupClicked={(grpId) => this.OnGroupItemClicked(grpId)}
                            />
              </div>
          </div>
            );
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