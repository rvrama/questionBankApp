import React, { Component } from 'react';
import Groups from '../Groups/Groups';
import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom';
class Home extends Component {                    


    render() {
    return (
        <div>
              <div>
                   <Groups isAuthenticated={this.props.isAuthenticated}
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
  
export default withRouter (connect(mapStateToProps, null) (Home));