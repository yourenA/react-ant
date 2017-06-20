import {FETCH_HARDWARE_VERSIONS_SUCCESS,FETCH_PARTS_SUCCESS,FETCH_TEST_TYPE_SUCCESS} from '../actions/fetchTestConf';

const initState = {
    test_type: [],
    parts:[],
    hardware_versions:[]
}

export default function (state = initState, action) {
    switch (action.type) {
        case FETCH_TEST_TYPE_SUCCESS:
            return {
                ...state,
                test_type: action.test_type
            };
        case FETCH_PARTS_SUCCESS:
            return {
                ...state,
                parts: action.parts
            };
        case FETCH_HARDWARE_VERSIONS_SUCCESS:
            return {
                ...state,
                hardware_versions: action.hardware_versions
            };
        default:
            return state
    }
}