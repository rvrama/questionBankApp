import React from 'react';
import classes from './Group.module.css';


const group = (props) => {

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
        <div className={classes.Group}>
            {grp}
        </div>
    );
}

export default group;