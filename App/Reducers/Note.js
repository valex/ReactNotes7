import {
    UPDATE_NOTE_SUCCESS,
    RECEIVE_NOTES,
    SET_CAMERA_TYPE,
    CAMERA_PERM_RESULT,
    DELETE_NOTE_SUCCESS, CREATE_NOTE_SUCCESS, UPDATE_NOTE_IN_STORE, FETCH_POSITION_SUCCESS
} from '../Constants/actionTypes';
import { Camera } from 'expo';

const initialState = {
    hasCameraPermission: null,
    cameraType: Camera.Constants.Type.back,
    notes:{
        1:{
            title:"Note 1",
            body:"Body 1",
            id:1,
            imagePath:null,
            location: {
                coords:{
                    "latitude": 47.782078,
                    "longitude": 35.2121229,
                }
            }
        },
        2:{
            title:"Note 2",
            body:"Body 2",
            id:2,
            imagePath:null,
            location: {
                coords:{
                    "latitude": 47.782078,
                    "longitude": 35.2121229,
                }
            }
        }
    }};

export default function appReducers(state = initialState, action = {}) {

    // if (typeof state === 'undefined') {
    //
    // }

    let newNotes, newState, tmpNote;
    switch (action.type) {
        case SET_CAMERA_TYPE:
            return Object.assign({}, state, {
                cameraType: action.payload.type
            });
        case FETCH_POSITION_SUCCESS:
            return Object.assign({}, state, {
                position: action.payload.position
            });

        case CREATE_NOTE_SUCCESS:
            newNotes = Object.assign({}, state.notes);
            newNotes[action.payload.id] = {
                id : action.payload.id,
                title: '',
                body: '',
            };

            return Object.assign({}, state, {
                notes:newNotes
            });

        case UPDATE_NOTE_IN_STORE:
            newNotes = Object.assign({}, state.notes);

            tmpNote = Object.assign({}, newNotes[action.payload.id], {
                    title: action.payload.title,
                    body:action.payload.body
            });

            newNotes[action.payload.id] = tmpNote;

            return Object.assign({}, state, {
                notes:newNotes
            });

        case UPDATE_NOTE_SUCCESS:
            newNotes = Object.assign({}, state.notes);
            newNotes[action.payload.note.id] = action.payload.note;

            return Object.assign({}, state, {
                notes:newNotes
            });

        case DELETE_NOTE_SUCCESS:
            newNotes = Object.assign({}, state.notes);
            delete newNotes[action.payload.id];

            return Object.assign({}, state, {
                notes:newNotes
            });

        case RECEIVE_NOTES:
            newNotes = Object.assign({}, action.notes);

            return Object.assign({}, state, {
                notes:newNotes
            });

        case CAMERA_PERM_RESULT:
            return Object.assign({}, state, {
                hasCameraPermission: action.payload.result
            });
        default:
            return state
    }
}