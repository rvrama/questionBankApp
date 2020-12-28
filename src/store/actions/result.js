import axios from 'axios';
import * as actionTypes from './actionType';

export const loadResults = (userId, groupId) => {
    return dispatch => {
        const queryParams = '?orderBy="userGroupId"&equalTo="' + userId + groupId + '"';
        axios.get("https://qbresults-479ad-default-rtdb.firebaseio.com/results.json"+ queryParams)
        .then(resp => {
            //dispatch(loadResultsSuccess(resp.data));
            console.log(resp);
            })
        .catch(err => {
            //dispatch(loadResultsFailed(err));
            console.log(err);
        }); 
    }
}

export const loadResultsFailed = (err) => {
    return {
        type: actionTypes.LOAD_RESULTS_FAILED,
        resultData : null,
        error : err
    }
}

export const loadResultsSuccess = (data) => {
    return {
        type:actionTypes.LOAD_RESULTS_SUCCESS,
        resultData : data
    }
}

export const storeResultsFailed = (err) => {
    return {
        type: actionTypes.STORE_RESULTS_FAILED,
        resultData : null,
        error : err
    }
}

export const storeResultsSuccess = (data) => {
    return {
        type:actionTypes.STORE_RESULTS_SUCCESS,
        resultData : data
    }
}

export const storeResults = (userId, groupId, attempts) => {
    return dispatch => {
//        dispatch(authStart());
        const resultData = {
            userGroupId: userId + groupId,
            results: attempts // should be an array containing attemptId, score, resultsArray
        };

        const url = "https://qbresults-479ad-default-rtdb.firebaseio.com/results.json";        
        axios.post(url, resultData)
            .then(response => {
                console.log(response);
                // const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
                // localStorage.setItem('token', response.data.idToken);
                // localStorage.setItem('expirationDate', expirationDate);
                // localStorage.setItem('userId', response.data.localId);
                   dispatch(storeResultsSuccess(response));
                // dispatch(checkAuthTimeout(response.data.expiresIn));
            })
            .catch(err => {
                //dispatch(authFail(err.response.data.error));
                console.log(err);
            });
    };
};

