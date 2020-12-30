import * as actionTypes from './actionType';


export const setTimeSpent = (ms) => {
    return {
        type: actionTypes.SET_TIME_SPENT,
        timeInMs : ms
    }
}

