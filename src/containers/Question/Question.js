import React, { Component } from 'react'
import classes from './Question.module.css';
import Choices from './../../components/Choices/Choices';
import PrevNextButton from '../../components/UI/PrevNextButton/PrevNextButton';
import SubmitButton from '../../components/UI/SubmitButton/SubmitButton';
import SummaryBar from '../../components/UI/SummaryBar/SummaryBar';
import Modal from '../../components/UI/Modal/Modal';
import Button from '../../components/UI/Button/Button';
import { connect } from 'react-redux';
import Spinner from './../../components/UI/Spinner/Spinner';
import QuestionRender from './../../components/RenderSupport/QuestionRender';
import QuestionContentRender from '../../components/RenderSupport/QuestionContentRender';
import Bound from './../../hoc/Bound';
import Timer from './../../components/Timer/Timer';

import * as actions from '../../store/actions/index';

class Question extends Component {
    state = {
        message : '',
        timelapse: false,
        closeTimer : false
    }



    QuestionPreviousHandler = () => {
        if (this.props.isAuthenticated) {

            this.props.OnSetPrevButtonClicked();
            if (this.props.questionId <= 1){
                this.setState({message :"You are in First question."});
            }
            else {
                let ctr = this.props.questionId - 1;
                this.setState({message :""});
                this.props.OnSetQuestionId(ctr);
            }
        }
        else {
            this.props.history.replace("/");
        }
    }

    QuestionNextHandler = () => {
        if (this.props.isAuthenticated) {

            if (!this.props.results.find(f => { return (f.id === this.props.questionId)}) )  //selection is not made already.  so no need to update the result array.
            {
                this.UpdateResults("0");
            }

            if (this.props.results[this.props.questionId]) {
                this.props.OnSetPrevButtonClicked();
            }
            else {
            //hack to clear the buttons
                document.getElementsByName( 'R' + this.props.questionId).forEach(f=> {f.checked = false});
                this.props.OnResetPrevButtonClicked();
            }

            if (this.props.questionId >= this.props.questionList.length){
                this.setState({message :"You are in Last question."});
            }
            else{
                let ctr = this.props.questionId + 1;
                this.setState({message :""});
                this.props.OnSetQuestionId(ctr);
          }
          
        }
        else {
            this.props.history.replace("/");
        }

    }


    CheckSelectedUtil = (selectedValues, currentSelection) => {
        let concatenatedSelection;
        let selectedArray = selectedValues.split(',');

        const isExistingSelectionIndex = selectedArray.findIndex((val) => val === currentSelection);

        if (isExistingSelectionIndex >= 0) {
            selectedArray = selectedArray.slice(0, isExistingSelectionIndex)
                            .concat(selectedArray.slice(isExistingSelectionIndex+1));
        }
        else {
            selectedArray.push(currentSelection);
        }
 
        concatenatedSelection = selectedArray.join(',');

        return concatenatedSelection;
        //used to check two arrays
        // const array2Sorted = selectedArray.slice().sort();
        // const isArrayEqual = answerArray.length === selectedArray.length && answerArray.slice().sort().every((value, index) => {
        // return (value === array2Sorted[index]);
        // });

        // return isArrayEqual;
    }
 
    OptionSelected = (event) => {
        this.UpdateResults(event.target.value);
        this.props.OnUpdateSelectedValue(event.target.value);
        
    }
        
    UpdateResults = (selectedValue) => {
        const selectedChoiceIndex = selectedValue;
        const choiceButtonType = this.props.questionList[this.props.questionId - 1].choiceType;

        let arr = [];

        if (this.props.results.length > 0){
            arr = [...this.props.results];
           const updateResultArrObj = arr.find(f => (f.id === this.props.questionId));
            if (updateResultArrObj){
                (choiceButtonType === "1") 
                    ? updateResultArrObj.selected = selectedChoiceIndex 
                    : (updateResultArrObj.selected === "" || !updateResultArrObj.selected) ?
                            updateResultArrObj.selected = selectedChoiceIndex
                            : updateResultArrObj.selected = this.CheckSelectedUtil(updateResultArrObj.selected,
                                                            selectedChoiceIndex);

                arr.splice(this.props.questionId - 1, 1, updateResultArrObj);
                this.props.OnUpdateResults(arr);
            }
            else{
                arr.push({id:this.props.questionId, 
                        answer:this.props.questionList[this.props.questionId - 1].answerChoiceId, 
                        selected : selectedChoiceIndex});
                this.props.OnAddResults(arr);
            }
        }
        else{
            arr.push({id:this.props.questionId, 
                answer:this.props.questionList[this.props.questionId - 1].answerChoiceId, 
                selected : selectedChoiceIndex});
            this.props.OnAddResults(arr);
        }

    }
  
    NavButtonClickHandler = (id) => {
        if (this.props.isAuthenticated) {
            this.props.OnSetPrevButtonClicked();
            this.props.OnSetQuestionId(id);
        }
        else {
            this.props.history.replace("/");
        }
    }

    SubmitButtonClickHandler = () => {
        this.setState({closeTimer:true});
        const [, score] = this.setResultMessage(this.props.results, this.props.questionList.length);

        //store the results in the backend
        this.props.OnStoreResultsOnSubmit(this.props.userId, 
                                        this.props.selectedGroupId, 
                                        this.props.results,
                                        this.props.timeSpent,
                                        score);
        this.props.OnShowResults();
    }
    
    componentDidMount () {
        this.setState({timelapse:false});
        this.setState({closeTimer:true});
        this.props.OnResetResultsOnLoad();
        this.props.OnSetQuestionId(1); //to reset the ctr to 1 so that the Questions will appear from begining if user choose Question Nav from Results page or anywhere.
        this.props.OnLoadQuestions(this.props.selectedGroupId);        
    }

    setResultMessage = (result, questionsCount) => {

        const res = result;
        const objIsCorrect = res.filter(f => (f.answer === f.selected));
        const score = ((objIsCorrect.length/questionsCount)*100).toFixed(1);

        return [objIsCorrect, score]; 
    }

    cancelShowResultHandler = () => {
        this.props.OnCancelShowResults();
    }

    cancelTimerHandler= () => {
        this.setState({timelapse:false});
        this.setState({closeTimer:true});
        this.props.history.push("/");
    }
  
    ShowResultViewHandler = () => {
        this.props.OnCancelShowResults();
        this.props.history.replace("/result");
    }

    TimerRanOver = () => {
        this.setState({timelapse:true});
        this.setState({closeTimer:true});
    }

    render() {

        let errorMsg;

        if (this.props.isAuthenticated) { //loggedIn

            if (!this.state.timelapse) {
                let showButtons;
                if (this.props.showResult){
                    const res = [...this.props.results];

                    const [objIsCorrect, score] = this.setResultMessage(res, (this.props.questionList) ? this.props.questionList.length : 0);

                    const message = "You have " + objIsCorrect.length + " correct answer(s).  You have "
                                    + "scored " + score + "% ";

                    return (
                        <Modal show={this.props.showResult} modalClosed={this.cancelShowResultHandler}>
                            <h1 style={{backgroundColor:'coral'}}>Results</h1>
                            <h3>{message}</h3>
                            <h4>Do you want to see the details?</h4>
                            <Button btnType="Success" clicked={this.ShowResultViewHandler}>Show Result</Button>
                        </Modal>
                    );
                }
                else
                {
                    let options = '';
                    let question = <Spinner />;
                    let summary = "";

                    if (this.props.results.length >0){
                        
                        summary = this.props.results.map(o => {
                            const q = "Q" + o.id;
                            return (
                            <SummaryBar 
                            key={o.id} 
                            quesLink={q} 
                            click={() => this.NavButtonClickHandler(o.id)}/>
                            );
                        })
                    }   
                    else{
                        summary = <SummaryBar  
                            quesLink="Attempted question(s) will appear here."/>;
                    }

                    if (this.props.questionList){        
                        const currentQuestion = this.props.questionList[this.props.questionId - 1];
                        question = 
                        (
                            <QuestionRender
                                key={this.props.questionId} 
                                message={this.state.message} 
                                questionId={this.props.questionId} 
                                questionTxt={currentQuestion.questionTxt} />
                        );

                        let pSelected = null;
            
                        if (this.props.isPrevButtonClicked && this.props.results[this.props.questionId - 1]) {
                            pSelected = this.props.results[this.props.questionId - 1].selected;
                        }

                        options = (<div className={classes.Choices}>
                                    <Choices
                                        key={this.props.questionId}
                                        answerChoiceId={currentQuestion.answerChoiceId}
                                        OptionSelected= {(event) => this.OptionSelected(event)}
                                        optionsList = {currentQuestion.choices.split(',')}
                                        choiceType = {currentQuestion.choiceType}
                                        prevSelectedData = {pSelected}
                                        questionId = {this.props.questionId}
                                    />
                                    </div>); 
                    

                        showButtons = (<PrevNextButton prevButtonClick={this.QuestionPreviousHandler} 
                            nextButtonClick={() => this.QuestionNextHandler()}
                            />);
                
                        if (this.props.questionId >= this.props.questionList.length){
                            showButtons = <SubmitButton 
                                            click={() => this.SubmitButtonClickHandler()}>Submit</SubmitButton>
                        }
                    }
                    else  { //if questionList is empty
                        errorMsg = <div className={classes.ErrorMsg}>Questions Loading failed...  Please check if you have proper access or contact the administrator.</div>;
                    }
                    return (
                        <Bound>
                        <Timer availableTime={(this.props.questionList) ? this.props.questionList.length*60000 : 60000} 
                                onTimeOut={this.TimerRanOver}
                                closeTimer={this.state.closeTimer}/>
                        <QuestionContentRender 
                            summary={summary}
                            errorMsg={errorMsg}
                            question={question}
                            options={options}
                            showButtons={showButtons}/>
                        </Bound>
                    );
                }   
            }
            else {
                return (<Modal show={this.state.timelapse} modalClosed={this.cancelTimerHandler}>
                    <h2> Exhausted your time limit!!!.  Your test is not submitted.</h2>
                </Modal>);
            }
        }
      
    }
}           
 
const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        token: state.auth.token,
        userId: state.auth.userId,
        authRedirectPath: state.auth.authRedirectPath,

        questionError : state.question.error,       
        questionId :state.question.questionId,
        selected: state.question.selected,// Not used
        showResult : state.question.showResult,
        results : state.question.results,//
        questionList : state.question.questionList,//
        isPrevButtonClicked : state.question.isPrevButtonClicked,
        selectedGroupId : state.question.selectedGroupId,

        attempts : state.result.attempts,   
        
        timeSpent : state.timer.timeInMilliSeconds        
    };
};

const mapDispatchToProps = dispatch => {
    return {
        //this method is not used now.. still keeping it :)
        OnUpdateSelectedValue : (selectedValue) => dispatch(actions.updateSelectedValue(selectedValue)),

        OnUpdateResults : (result) => dispatch(actions.updateResults(result)),
        OnAddResults : (result) => dispatch(actions.addResults(result)),
        OnLoadQuestions : (grpId) => dispatch(actions.loadQuestions(grpId)),
        OnShowResults : () => dispatch(actions.showResults()),
        OnCancelShowResults : () => dispatch(actions.cancelShowResults()),
        OnSetQuestionId : (id) => dispatch(actions.setQuestionId(id)),
        OnSetPrevButtonClicked : () => dispatch(actions.setPrevButtonClickFlag()),
        OnResetPrevButtonClicked : () => dispatch(actions.resetPrevButtonClickFlag()),
        OnResetResultsOnLoad : () => dispatch(actions.resetResultsOnLoad()),
        OnStoreResultsOnSubmit : (userId, groupId, attempts, timeSpent, score) => dispatch(actions.storeResults(userId, groupId, attempts, timeSpent, score))

    }
}

export default connect(mapStateToProps, mapDispatchToProps) (Question);

/* TODO
2. set key error in questionresult.
2. Add mustSelectCount to validate the number of selection by user & selected should be an array
4. Add grouping/change the API & do cleanup
5. simplify the question.js code by moving code to component
8. Show result page -- store it in db and return it.
*/