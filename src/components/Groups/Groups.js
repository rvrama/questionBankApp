import React, { useEffect } from 'react';
import classes from './Groups.module.css';
import Group from './Group/Group';
import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom';
import * as actions from '../../store/actions/index';

const Groups = (props) => {

    // componentDidMount() {
    //     this.props.OnLoadGroups();
    // }
    useEffect(() => {
        props.OnLoadGroups();
    },[]);


    // OnGroupItemClicked = (grpId) => {
    //     this.props.OnSetSelectedGroupId(grpId);
    //     //set the group name selected in the store
    //     //for now pass in query param
    //     this.props.history.push('/question');

    // }

        let groupDetails;

        if (props.groupsList){
            groupDetails = props.groupsList.Items.map((grp,index) => {
               return <Group 
                    key={grp.GroupId}
                    groupName={grp.GroupName} 
                    countByGroup={props.isAuthenticated ? '('+ grp.QuestionsCount + ')' : null}
                    groupSummary={grp.GroupSummary}
                    click={(grpName) => props.groupClicked(grp.GroupId)}/>    
            });
        }
        else{
            groupDetails =<div><h5>{props.error ? props.error.message : ''}</h5><span>. Group details not available. Check after some time!!!</span></div>
        }

        return (
            <div className={classes.Groups}>
                {groupDetails}
            </div>
        );
   }

const mapStateToProps = state => {
    return {
        groupsList: state.question.groupsList,
        error : state.question.error 
    };
};

const mapDispatchToProps = dispatch => {
    return {
        OnLoadGroups: () => dispatch(actions.loadGroups()),
        OnSetSelectedGroupId : (grpId) => dispatch(actions.setSelectedGroupId(grpId))
    };
};

export default (connect(mapStateToProps, mapDispatchToProps) (withRouter(Groups)));