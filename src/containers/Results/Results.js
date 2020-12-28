import React, { Component } from 'react';
//import classes from './Results.module.css';
import * as actions from './../../store/actions/index';
import { connect } from 'react-redux';

class Results extends Component {

    componentDidMount() {
        this.props.OnLoadResultsOnMount(this.props.userId, this.props.groupId);
    }

    render() {
        console.log(this.props.userResults);
        console.log(this.props.questionList);
        console.log(this.props.isAuthenticated);
        console.log(this.props.userId);
        return (<div>Results</div>);
    }
}


const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null,
        userId: state.auth.userId,
        userResults : state.result.results,
        questionList : state.question.questionList,
        groupId : state.question.selectedGroupId        
    };
};

const mapDispatchToProps = dispatch => {
    return {
        //this method is not used now.. still keeping it :)
        OnLoadResultsOnMount : (userId, groupId) => dispatch(actions.loadResults(userId, groupId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (Results);