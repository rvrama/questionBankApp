import React, { Component } from 'react';
import classes from './Results.module.css';
import * as actions from './../../store/actions/index';
import { connect } from 'react-redux';
import Result from './../../components/Result/Result';

class Results extends Component {
    state = {
        showResults:false,
        result:null,
        questionList:null,
        groupMixId:0
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
        this.setState({groupMixId: groupId+id});
    }

    render() {
        console.log(this.props.userResults);
        console.log(this.props.userId);
        console.log(this.state.result);
        console.log(this.props.questionList);
        
        let resultsToShow;
       // let groupInfo;

        if (this.props.userResults){
            
                resultsToShow = this.props.userResults.map(res => {
                
                

                return (
                    <Result 
                        key={res.id}
                        showClicked={() => this.ShowResults(res.groupId, res.id)}
                         groupId={res.groupId}
                         id={res.id}
                         userId={res.userId}
                         showResults={this.state.showResults}
                          result={this.state.result}
                          questionList={this.props.questionList}
                          selectedGroupIdCombination={this.state.groupMixId}/>
                 )
                   });

        }
        return (<div className={classes.Results}>
                    {resultsToShow}
                </div>);
    }
}


const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null,
        userId: state.auth.userId,
        userResults : state.result.results,
        questionList : state.question.questionList,
        groupsList: state.question.groupsList    
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