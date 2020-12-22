import React, {Component} from 'react';
import classes from './QuestionResult.module.css'
import {connect} from 'react-redux';

class QuestionResult extends Component{

    setResultMessage = (result, questionsCount) => {
        const res = result;
        const objisCorrect = res.filter(f => (f.answer === f.selected));
     //   const objselected = res.filter(f => (f.selected !== "0"));
        const message = "You have " + objisCorrect.length 
                        + " correct answer(s).  You have "
                        + "scored " + ((objisCorrect.length/questionsCount)*100).toFixed(1) + "% ";
        return message; 
    }

    render(){

    if (this.props.isAuthenticated){
        let ctr = 0;
        let questionList = '';
        let options = '';
        let questions = this.props.questionList;
        let result = this.props.results;

        if (questions){
            questionList = questions.map((f,qIndex) => {
            
            const choiceType = f.choiceType;
            const optionsList = f.choices.split(',');
        
                    options = optionsList.map((o,index) => {
                    
                    let choices = '';

                    if (choiceType === '1'){
                        if ((index+1) === Number(f.answerChoiceId)){
                            if (result[qIndex] && ((index+1) === Number(result[qIndex].selected))){
                                choices =  (
                                    <div className = {classes.Answer}>
                                        <input type="radio" 
                                        key = {'R' + qIndex + index} 
                                        defaultChecked/>
                                        {o}
                                        </div>
                                        );
                            }
                            else {
                                choices =  (
                                    <div className = {classes.Answer}>
                                        <input type="radio" 
                                        key = {'R' + qIndex + index} 
                                       />
                                        {o}
                                        </div>
                                        );
                            }
                        
                        }
                    else {
                        if ( result[qIndex] && ((index+1) === Number(result[qIndex].selected))){
                            choices =  (
                                <div className={classes.WrongAnswer}>
                                    <input type="radio" key = {'R'+ qIndex + index} defaultChecked/>{o}
                                    </div>
                            );
                        }
                        else {
                            choices =  (
                                <div className={classes.Choices}>
                                    <input type="radio" key = {'R' + qIndex + index}/>{o}
                                    </div>
                            );
                        }
                            
                    }
                    }
                    else if (choiceType === '2'){

                        const rowId = Number(index) + 1;

                        if (f.answerChoiceId.includes(rowId)){
                            if (result[qIndex] && result[qIndex].selected.includes(rowId)) {
                                choices =  (
                                    <div className = {classes.Answer}>
                                    <input type="checkbox" key = {'C'+ qIndex + index} defaultChecked/>{o}
                                    </div>
                                        );
                                }
                            else {
                                choices =  (
                                    <div className = {classes.Answer}>
                                    <input type="checkbox" key = {'C' + qIndex + index}/>{o}
                                    </div>
                                        );
                                }
                            }
                            else {
                                if (result[qIndex] && result[qIndex].selected.includes(rowId)) {
                                    choices =  (
                                        <div className = {classes.WrongAnswer}>
                                        <input type="checkbox" key = {'C' + qIndex + index} defaultChecked/>{o
                                        }</div>
                                        );
                                    }
                                else {
                                    choices =  (
                                        <div className = {classes.Choices}>
                                        <input type="checkbox" key = {'C' + qIndex + index}/>{o
                                        }</div>
                                        );

                                    }
                            }
                    }
                    return choices;
                     });
        
                ctr = ctr + 1;

                return (
                <div className={classes.Qtnscreen}>
                <div>
                    <span className={classes.QtnTxt}>{ctr}. {f.questionTxt}</span>
                </div>
                &nbsp;
                <div style={{color:'black'}}>Choices are :</div>
                    <div>
                    {options}
                    </div>
                </div>
                );
            
            })        
        } 
        
        const message = this.setResultMessage(result, (questions) ? questions.length : 0);

        return (
            <div className={classes.Displaybar}>
               <h1 className={classes.Msg}>{message}</h1>
                {questionList}
            </div>   
       );
    }
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null,
        results : state.question.results,//
        questionList : state.question.questionList,//
    };
};


export default connect(mapStateToProps, null) (QuestionResult);