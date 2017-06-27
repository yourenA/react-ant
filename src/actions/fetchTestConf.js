/**
 * Created by Administrator on 2017/6/19.
 */
import {getHeader} from './../common/common.js';
import configJson from './../common/config.json';
import axios from 'axios';
export const FETCH_TEST_TYPE_SUCCESS = 'FETCH_TEST_TYPE_SUCCESS';
export const FETCH_PARTS_SUCCESS = 'FETCH_PARTS_SUCCESS';
export const FETCH_HARDWARE_VERSIONS_SUCCESS = 'FETCH_HARDWARE_VERSIONS_SUCCESS';
export const FETCH_SEGMENTS_SUCCESS = 'FETCH_SEGMENTS_SUCCESS';
export const FETCH_DRAW_SCRIPT_SUCCESS = 'FETCH_DRAW_SCRIPT_SUCCESS';
export const DEL_EDIT_RECORD = 'DEL_EDIT_RECORD';
export const SET_SCRIPT_LOADED_FALSE = 'DEL_EDIT_RECORD';

export function delEditRecord() {
    return dispatch => {
        dispatch({
            type: DEL_EDIT_RECORD,
        });
    }
}
export function setSciptLoadedFalse() {
    return dispatch => {
        dispatch({
            type: SET_SCRIPT_LOADED_FALSE,
        });
    }
}
export function fetchDrawScript(id, cb) {
    return dispatch => {
        axios({
            url: `${configJson.prefix}/test_scripts/${id}`,
            method: 'get',
            headers: getHeader()
        })
            .then(function (response) {
                dispatch({
                    type: FETCH_DRAW_SCRIPT_SUCCESS,
                    scriptJson: response.data.content,
                    editRecord: response.data
                });

                if (cb) cb()
            })
            .catch(function (error) {
                console.log('获取出错', error)
            });
    }
}

export function fetchAllTestType() {
    return dispatch => {
        axios({
            url: `${configJson.prefix}/test_types`,
            method: 'get',
            params: {
                return: 'all'
            },
            headers: getHeader()
        })
            .then(function (response) {
                dispatch({
                    type: FETCH_TEST_TYPE_SUCCESS,
                    test_type: response.data.data
                });
            })
            .catch(function (error) {
                console.log('获取出错', error)
            });
    }
}

export function fetchAllParts() {
    return dispatch => {
        axios({
            url: `${configJson.prefix}/parts`,
            method: 'get',
            params: {
                return: 'all'
            },
            headers: getHeader()
        })
            .then(function (response) {
                dispatch({
                    type: FETCH_PARTS_SUCCESS,
                    parts: response.data.data
                });
            })
            .catch(function (error) {
                console.log('获取出错', error)
            });
    }
}

export function fetchAllHardwareVersions() {
    return dispatch => {
        axios({
            url: `${configJson.prefix}/hardware_versions`,
            method: 'get',
            params: {
                return: 'all'
            },
            headers: getHeader()
        })
            .then(function (response) {
                dispatch({
                    type: FETCH_HARDWARE_VERSIONS_SUCCESS,
                    hardware_versions: response.data.data
                });
            })
            .catch(function (error) {
                console.log('获取出错', error)
            });
    }
}

export function fetchAllSegments() {
    return dispatch => {
        axios({
            url: `${configJson.prefix}/flow_diagrams`,
            method: 'get',
            params: {
                return: 'all'
            },
            headers: getHeader()
        })
            .then(function (response) {
                dispatch({
                    type: FETCH_SEGMENTS_SUCCESS,
                    segments: response.data.data
                });
            })
            .catch(function (error) {
                console.log('获取出错', error)
            });
    }
}