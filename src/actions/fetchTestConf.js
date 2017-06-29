/**
 * Created by Administrator on 2017/6/19.
 */
import {getHeader} from './../common/common.js';
import configJson from './../common/config.json';
import axios from 'axios';
export const FETCH_TEST_TYPE_SUCCESS = 'FETCH_TEST_TYPE_SUCCESS';
export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
export const FETCH_HARDWARE_VERSIONS_SUCCESS = 'FETCH_HARDWARE_VERSIONS_SUCCESS';
export const FETCH_SEGMENTS_SUCCESS = 'FETCH_SEGMENTS_SUCCESS';
export const FETCH_DRAW_SCRIPT_SUCCESS = 'FETCH_DRAW_SCRIPT_SUCCESS';
export const FETCH_BATCHES_SUCCESS = 'FETCH_BATCHES_SUCCESS';
export const FETCH_TEST_STAND_SUCCESS = 'FETCH_TEST_STAND_SUCCESS';
export const FETCH_PERMISSIONS_SUCCESS = 'FETCH_PERMISSIONS_SUCCESS';
export const FETCH_GROUP_SUCCESS = 'FETCH_GROUP_SUCCESS';
export const FETCH_MANUFACTURE_SUCCESS = 'FETCH_MANUFACTURE_SUCCESS';
export const DEL_EDIT_RECORD = 'DEL_EDIT_RECORD';
export const SET_SCRIPT_LOADED_FALSE = 'SET_SCRIPT_LOADED_FALSE';

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

export function fetchAllProducts() {
    return dispatch => {
        axios({
            url: `${configJson.prefix}/products`,
            method: 'get',
            params: {
                return: 'all'
            },
            headers: getHeader()
        })
            .then(function (response) {
                dispatch({
                    type: FETCH_PRODUCTS_SUCCESS,
                    products: response.data.data
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

export function fetchAllBatches() {
    return dispatch => {
        axios({
            url: `${configJson.prefix}/batches`,
            method: 'get',
            params: {
                return: 'all'
            },
            headers: getHeader()
        })
            .then(function (response) {
                dispatch({
                    type: FETCH_BATCHES_SUCCESS,
                    batches: response.data.data
                });
            })
            .catch(function (error) {
                console.log('获取出错', error)
            });
    }
}
export function fetchAllTestStand() {
    return dispatch => {
        axios({
            url: `${configJson.prefix}/test_stands`,
            method: 'get',
            params: {
                return: 'all'
            },
            headers: getHeader()
        })
            .then(function (response) {
                dispatch({
                    type: FETCH_TEST_STAND_SUCCESS,
                    test_stands: response.data.data
                });
            })
            .catch(function (error) {
                console.log('获取出错', error)
            });
    }
}

export function fetchAllPermissions() {
    return dispatch => {
        axios({
            url: `${configJson.prefix}/permissions`,
            method: 'get',
            headers: getHeader()
        })
            .then(function (response) {
                dispatch({
                    type: FETCH_PERMISSIONS_SUCCESS,
                    permissions: response.data.data
                });
            })
            .catch(function (error) {
                console.log('获取出错', error)
            });
    }
}

export function fetchAllGroup() {
    return dispatch => {
        axios({
            url: `${configJson.prefix}/roles`,
            method: 'get',
            params: {
                return: 'all'
            },
            headers: getHeader()
        })
            .then(function (response) {
                dispatch({
                    type: FETCH_GROUP_SUCCESS,
                    groups: response.data.data
                });
            })
            .catch(function (error) {
                console.log('获取出错', error)
            });
    }
}

export function fetchAllManufacture() {
    return dispatch => {
        axios({
            url: `${configJson.prefix}/companies`,
            method: 'get',
            params: {
                return: 'all'
            },
            headers: getHeader()
        })
            .then(function (response) {
                dispatch({
                    type: FETCH_MANUFACTURE_SUCCESS,
                    manufactures: response.data.data
                });
            })
            .catch(function (error) {
                console.log('获取出错', error)
            });
    }
}