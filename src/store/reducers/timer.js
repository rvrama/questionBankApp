import * as actionTypes from '../actions/actionType';
import { updateObject } from '../../shared/utility';

const initialState = {
    timeInMilliSeconds : 0
}

const setTimeSpent = (state, action) => {
    return updateObject(state, 
                { timeInMilliSeconds: action.timeInMs });
}


const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.SET_TIME_SPENT: return setTimeSpent(state, action);
        default:
            return state;
    }
};

export default reducer;