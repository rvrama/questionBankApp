import React from 'react';
import classes from './Result.module.css';
import QuestionResult from './../../containers/QuesionResult/QuestionResult';
import Button from './../UI/Button/Button';

const result = (props) => {

    let resultOutput;

    if ((props.showResults && props.selectedGroupIdCombination === props.groupId+props.id)){
        resultOutput = <QuestionResult
                            key={Math.random()}
                            results={props.result}
                            questionList={props.questionList}
                            /> 
    }
    else{
            resultOutput='';
    }

    return (
    <div className={classes.Result}>
    <div>User ID : {props.userId}</div>
    <div>Attempt Id : {props.id}</div>
    <div>Group Id : {props.groupId}</div>
    <div>
          <Button 
          btnType={(props.showResults && props.selectedGroupIdCombination === props.groupId+props.id) ? 'Danger' : 'Success'}
          clicked={props.showClicked}>
              {(props.showResults && props.selectedGroupIdCombination === props.groupId+props.id) ? 'Hide Results' : 'Show Results'}</Button>
            {resultOutput}
    </div>
    </div>
    );
}

export default result;