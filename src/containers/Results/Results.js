import React, { Component } from 'react';
import classes from './Results.module.css';
import * as actions from './../../store/actions/index';
import { connect } from 'react-redux';
import Bound from './../../hoc/Bound';
import QuestionResult from '../QuesionResult/QuestionResult';
import Button from './../../components/UI/Button/Button';

class Results extends Component {
    state = {
        showResults:false,
        result:null,
        questionList:null
    }

    componentDidMount() {
        this.props.OnLoadResultsOnMount(this.props.userId);
    }

    ShowResults(groupId, id) {
        this.props.OnLoadQuestions(groupId);
        this.setState(prevState => { 
                        return {
                                showResults : !prevState.showResults
                                }; 
                            });
        const choosenResult = this.props.userResults.filter(f => (f.groupId === groupId && f.id === id))
        this.setState({result:choosenResult[0].results});
    }

    render() {
        console.log(this.props.userResults);
        console.log(this.props.userId);
        console.log(this.state.result);
        console.log(this.props.questionList);
        
        let resultsToShow;
        if (this.props.userResults){
            resultsToShow = this.props.userResults.map(res => {
                                    return (
                                        <Bound>
                                        <div>{res.userId}</div>
                                        <div>{res.id}</div>
                                        <div>{res.groupId}</div>
                                        <div>
                                              <Button 
                                              btnType={this.state.showResults ? 'Danger' : 'Success'}
                                              clicked={() => this.ShowResults(res.groupId, res.id)}>
                                                  {this.state.showResults ? 'Hide Results' : 'Show Results'}</Button>

                                        </div>
                                        </Bound>
                                    );
                                 })

        }

        let resultOutput;
        if (this.state.showResults){
            resultOutput = <QuestionResult
                                results={this.state.result}
                                questionList={this.props.questionList}
                                /> 
        }


        return (<div className={classes.Results}>
                    {resultsToShow}
                    {resultOutput}
                </div>);
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
        OnLoadResultsOnMount : (userId) => dispatch(actions.loadResults(userId)),
        OnLoadQuestions : (grpId) => dispatch(actions.loadQuestions(grpId)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (Results);