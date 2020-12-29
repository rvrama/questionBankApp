import React from 'react';
import classes from './Group.module.css';


const group = (props) => {

    let cssClassName;
    let labelAttempts;

    switch(props.attempts)
    {
        case "0" : 
                cssClassName = classes.NotAttempted;
                labelAttempts=<span className={classes.NoLabelAttempts}>0 TRIES</span> 
                break;
        case "1" : 
                cssClassName = classes.AttemptedOnce; 
                labelAttempts=<span className={classes.OnceLabelAttempts}>1 TRY</span>
                break;
        case "Max" : 
                cssClassName = classes.MaxAttempted; 
                labelAttempts=<span className={classes.MaxLabelAttempts}>MAX TRIED</span>
                break;
        default : cssClassName = '';  //should not reach here
    }

    let grp;
    if (props.countByGroup) {
        grp = (<div>
                    <div onClick={props.click} className={classes.GroupName}>
                        {props.groupName} {props.countByGroup}
                    </div>
                    <div className={classes.GroupSummary}>{props.groupSummary}</div>
                </div>);
    }
    else {
        grp = (<div>
                    <div className={classes.GroupName}>{props.groupName}</div>
                    <div className={classes.GroupSummary}>{props.groupSummary}</div>
                </div>);
    }

    
    return (
        <div className={cssClassName}>
            {labelAttempts}
            {grp}
        </div>
    );
}

export default group;