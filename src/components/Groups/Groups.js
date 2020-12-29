import React, { useEffect } from 'react';
import classes from './Groups.module.css';
import Group from './Group/Group';
import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom';
import * as actions from '../../store/actions/index';

const MAX_ATTEMPTS = 2;

const Groups = (props) => {
    const { OnLoadGroups, OnLoadResultsOnMount, userId } = props;

    useEffect(() => {
        OnLoadResultsOnMount(userId);
        OnLoadGroups();
    },[OnLoadGroups, OnLoadResultsOnMount]);

    let groupDetails;

    if (props.groupsList){
        groupDetails = props.groupsList.Items.map((grp,index) => {
            
            const filterResults = (props.userResults && props.userResults.length > 0) ? props.userResults.filter((f,index) => f.groupId === grp.GroupId) : null;
            const filterResultsLength = (filterResults) ? filterResults.length : 0;

            let groupsInfo; 
            
            if (filterResultsLength > 0 && filterResultsLength < MAX_ATTEMPTS)  //1 more attempt available
            {
            groupsInfo =  <Group 
                key={grp.GroupId}
                groupName={grp.GroupName} 
                countByGroup={props.isAuthenticated ? '('+ grp.QuestionsCount + ')' : null}
                groupSummary={grp.GroupSummary}
                attempts="1"  //show groups in green
                click={(grpName) => props.groupClicked(grp.GroupId)}/>    
            }
            else if (filterResultsLength >= MAX_ATTEMPTS) {  //all attempts exhausted
                groupsInfo =  <Group 
                key={grp.GroupId}
                groupName={grp.GroupName} 
                countByGroup={props.isAuthenticated ? '('+ grp.QuestionsCount + ')' : null}
                groupSummary={grp.GroupSummary}
                attempts="Max" //show groups in coral
                />    
            }
            else if (filterResultsLength === 0) {  //no attempts made
                groupsInfo =  <Group 
                key={grp.GroupId}
                groupName={grp.GroupName} 
                countByGroup={props.isAuthenticated ? '('+ grp.QuestionsCount + ')' : null}
                groupSummary={grp.GroupSummary}
                attempts="0" //show groups in darkslategrey
                click={(grpName) => props.groupClicked(grp.GroupId)}/>        
            }
            return groupsInfo;
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
        error : state.question.error,
        userId: state.auth.userId,
        userResults : state.result.results,
        //questionList : state.question.questionList,
        //groupId : state.question.selectedGroupId        
    };
};

const mapDispatchToProps = dispatch => {
    return {
        OnLoadGroups: () => dispatch(actions.loadGroups()),
        OnSetSelectedGroupId : (grpId) => dispatch(actions.setSelectedGroupId(grpId)),
        OnLoadResultsOnMount : (userId) => dispatch(actions.loadResults(userId))
    };
};

export default (connect(mapStateToProps, mapDispatchToProps) (withRouter(Groups)));  //withRouter is not requird but kept it to show the way we can use connect and withRouter :)