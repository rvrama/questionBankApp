import React from 'react';
import classes from './PrevNextButton.module.css';

const prevNextButton = (props) => {
    return (
    <div className={classes.Placeholder}>
        <button className={classes.Btn} onClick={props.prevButtonClick}>Previous</button>
        <button className={classes.Btn} onClick={props.nextButtonClick}>Next</button>
    </div>);
}

export default prevNextButton;
