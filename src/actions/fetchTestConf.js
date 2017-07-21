/**
 * Created by Administrator on 2017/6/19.
 */
import {getHeader} from './../common/common.js';
import configJson from './../common/config.json';
import axios from 'axios';
export const FETCH_TEST_TYPE_SUCCESS = 'FETCH_TEST_TYPE_SUCCESS';
export const DEL_TEST_TYPE_SUCCESS = 'DEL_TEST_TYPE_SUCCESS';
export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
export const FETCH_ALL_SCRIPT_SUCCESS = 'FETCH_ALL_SCRIPT_SUCCESS';
export const DEL_ALL_SCRIPT_SUCCESS = 'DEL_ALL_SCRIPT_SUCCESS';
export const FETCH_HARDWARE_VERSIONS_SUCCESS = 'FETCH_HARDWARE_VERSIONS_SUCCESS';
export const DEL_HARDWARE_VERSIONS_SUCCESS = 'DEL_HARDWARE_VERSIONS_SUCCESS';
export const FETCH_SEGMENTS_SUCCESS = 'FETCH_SEGMENTS_SUCCESS';
export const FETCH_DRAW_SCRIPT_SUCCESS = 'FETCH_DRAW_SCRIPT_SUCCESS';
export const FETCH_DRAW_SEGMENT_SUCCESS = 'FETCH_DRAW_SEGMENT_SUCCESS';
export const FETCH_BATCHES_SUCCESS = 'FETCH_BATCHES_SUCCESS';
export const FETCH_TEST_STAND_SUCCESS = 'FETCH_TEST_STAND_SUCCESS';
export const FETCH_PERMISSIONS_SUCCESS = 'FETCH_PERMISSIONS_SUCCESS';
export const FETCH_GROUP_SUCCESS = 'FETCH_GROUP_SUCCESS';
export const FETCH_MANUFACTURE_SUCCESS = 'FETCH_MANUFACTURE_SUCCESS';
export const DEL_EDIT_RECORD = 'DEL_EDIT_RECORD';
export const DEL_SEGMENT_EDIT_RECORD = 'DEL_SEGMENT_EDIT_RECORD';
export const SET_SCRIPT_LOADED_FALSE = 'SET_SCRIPT_LOADED_FALSE';
export const SET_SEGMENT_LOADED_FALSE = 'SET_SEGMENT_LOADED_FALSE';

export function delEditRecord() {
    return dispatch => {
        dispatch({
            type: DEL_EDIT_RECORD,
        });
    }
}
export function delSegmentEditRecord() {
    return dispatch => {
        dispatch({
            type: DEL_SEGMENT_EDIT_RECORD,
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
export function setSegmentLoadedFalse() {
    return dispatch => {
        dispatch({
            type: SET_SEGMENT_LOADED_FALSE,
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
export function fetchDrawSegment(id, cb) {
    return dispatch => {
        axios({
            url: `${configJson.prefix}/flow_diagrams/${id}`,
            method: 'get',
            headers: getHeader()
        })
            .then(function (response) {
                dispatch({
                    type: FETCH_DRAW_SEGMENT_SUCCESS,
                    segmentJson: response.data.content,
                    editSegmentRecord: response.data
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
export function delTestTypet() {
    return dispatch => {
        dispatch({
            type: DEL_TEST_TYPE_SUCCESS,
        });

    }
}
export function fetchAllScript(hardware_version_id, test_type_id) {
    return dispatch => {
        axios({
            url: `${configJson.prefix}/test_scripts`,
            method: 'get',
            params: {
                hardware_version_id: hardware_version_id || '',
                test_type_id: test_type_id || '',
                return: 'all'
            },
            headers: getHeader()
        })
            .then(function (response) {
                dispatch({
                    type: FETCH_ALL_SCRIPT_SUCCESS,
                    script: response.data.data,
                });

            })
            .catch(function (error) {
                console.log('获取出错', error)
            });
    }
}

export function delAllScript() {
    return dispatch => {
        dispatch({
            type: DEL_ALL_SCRIPT_SUCCESS,
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

export function fetchAllHardwareVersions(product_id) {
    return dispatch => {
        axios({
            url: `${configJson.prefix}/hardware_versions`,
            method: 'get',
            params: {
                product_id: product_id || '',
                return: 'all'
            },
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response)
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

export function delAllHardwareVersions() {
    return dispatch => {
        dispatch({
            type: DEL_HARDWARE_VERSIONS_SUCCESS,
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