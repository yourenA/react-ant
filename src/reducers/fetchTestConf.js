import {SET_SCRIPT_LOADED_FALSE,DEL_EDIT_RECORD,FETCH_DRAW_SCRIPT_SUCCESS,FETCH_HARDWARE_VERSIONS_SUCCESS,FETCH_PRODUCTS_SUCCESS,
    FETCH_TEST_TYPE_SUCCESS,FETCH_SEGMENTS_SUCCESS,FETCH_BATCHES_SUCCESS,FETCH_PERMISSIONS_SUCCESS,FETCH_GROUP_SUCCESS,
    FETCH_MANUFACTURE_SUCCESS} from '../actions/fetchTestConf';

const initState = {
    scriptLoaded: false,
    scriptJson:'{}',
    editRecord:null,
    test_type: [],
    products:[],
    hardware_versions:[],
    segments:[],
    batches:[],
    permissions:[],
    groups:[],
    manufactures:[]
}

export default function (state = initState, action) {
    switch (action.type) {
        case SET_SCRIPT_LOADED_FALSE:
            return {
                ...state,
                scriptLoaded:false,
            };
        case DEL_EDIT_RECORD:
            return {
                ...state,
                scriptJson:'{}',
                editRecord:null,
            };
        case FETCH_DRAW_SCRIPT_SUCCESS:
            return {
                ...state,
                scriptLoaded: true,
                scriptJson:action.scriptJson,
                editRecord:action.editRecord
            };
        case FETCH_TEST_TYPE_SUCCESS:
            return {
                ...state,
                test_type: action.test_type
            };
        case FETCH_PRODUCTS_SUCCESS:
            return {
                ...state,
                products: action.products
            };
        case FETCH_HARDWARE_VERSIONS_SUCCESS:
            return {
                ...state,
                hardware_versions: action.hardware_versions
            };
        case FETCH_SEGMENTS_SUCCESS:
            return {
                ...state,
                segments: action.segments
            };
        case FETCH_BATCHES_SUCCESS:
            return {
                ...state,
                batches: action.batches
            };
        case FETCH_PERMISSIONS_SUCCESS:
            return {
                ...state,
                permissions: action.permissions
            };
        case FETCH_GROUP_SUCCESS:
            return {
                ...state,
                groups: action.groups
            };
        case FETCH_MANUFACTURE_SUCCESS:
            return{
                ...state,
                manufactures:action.manufactures
            };
        default:
            return state
    }
}