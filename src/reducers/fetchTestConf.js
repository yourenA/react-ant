import {SET_SCRIPT_LOADED_FALSE,SET_SEGMENT_LOADED_FALSE,DEL_EDIT_RECORD,DEL_SEGMENT_EDIT_RECORD,FETCH_DRAW_SCRIPT_SUCCESS,
    DEL_ALL_SCRIPT_SUCCESS,DEL_TEST_TYPE_SUCCESS,DEL_HARDWARE_VERSIONS_SUCCESS,
    FETCH_DRAW_SEGMENT_SUCCESS,FETCH_HARDWARE_VERSIONS_SUCCESS,FETCH_PRODUCTS_SUCCESS,
    FETCH_TEST_TYPE_SUCCESS,FETCH_SEGMENTS_SUCCESS,FETCH_BATCHES_SUCCESS,FETCH_PERMISSIONS_SUCCESS,FETCH_GROUP_SUCCESS,
    FETCH_MANUFACTURE_SUCCESS,FETCH_TEST_STAND_SUCCESS,FETCH_ALL_SCRIPT_SUCCESS} from '../actions/fetchTestConf';

const initState = {
    scriptLoaded: false,
    segmentLoaded: false,
    scriptJson:'{}',
    segmentJson:'{}',
    editRecord:null,
    editSegmentRecord:null,
    test_type: [],
    script: [],
    products:[],
    hardware_versions:[],
    segments:[],
    batches:[],
    permissions:[],
    groups:[],
    manufactures:[],
    test_stands:[]
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
        case SET_SEGMENT_LOADED_FALSE:
            return {
                ...state,
                segmentLoaded:false,
            };
        case DEL_SEGMENT_EDIT_RECORD:
            return {
                ...state,
                segmentJson:'{}',
                editSegmentRecord:null,
            };
        case FETCH_DRAW_SEGMENT_SUCCESS:
            return {
                ...state,
                segmentLoaded: true,
                segmentJson:action.segmentJson,
                editSegmentRecord:action.editSegmentRecord
            };
        case FETCH_TEST_TYPE_SUCCESS:
            return {
                ...state,
                test_type: action.test_type
            };
        case DEL_TEST_TYPE_SUCCESS:
            return {
                ...state,
                test_type: []
            };
        case FETCH_ALL_SCRIPT_SUCCESS:
            return {
                ...state,
                script: action.script
            };
        case DEL_ALL_SCRIPT_SUCCESS:
            return {
                ...state,
                script: []
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
        case DEL_HARDWARE_VERSIONS_SUCCESS:
            return {
                ...state,
                hardware_versions: []
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
        case FETCH_TEST_STAND_SUCCESS:
            return {
                ...state,
                test_stands: action.test_stands
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