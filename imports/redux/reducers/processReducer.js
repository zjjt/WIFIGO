import * as actions from '../actions/processActions';

const initialState={
    client:null,
    processCompleted:"",
    canBrowse:false,
    modiformCanSubmit:false
};

export default function processReducer(state=initialState,action){

    switch(action.type){
        case actions.RESET:
            return{
                ...state,
                client:null,
                processCompleted:"",
                canBrowse:false,
                modiformCanSubmit:false
            };
        case actions.FINDUPROCESSN:
            return{
                ...state,
                processCompleted:"NON",
                canBrowse:true
            };
        case actions.FINDUPROCESSO:
            return{
                ...state,
                client:null,
                processCompleted:"OUI",
                canBrowse:true
            };
        case actions.SUBMITALLOWED:
            return{
                ...state,
                modiformCanSubmit:true
            };
        case actions.SUBMITNOTALLOWED:
            return{
                ...state,
                modiformCanSubmit:false
            };
        case actions.CLIENTINFO:
            return{
                ...state,
                client:action.client
            }
        default:
            return state;

    }

}