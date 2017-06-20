/**
 * Created by Administrator on 2017/6/19.
 */
import {getHeader} from './../common/common.js';
import configJson from './../common/config.json';
import axios from 'axios';
export const FETCH_TEST_TYPE_SUCCESS = 'FETCH_TEST_TYPE_SUCCESS';
export const FETCH_PARTS_SUCCESS = 'FETCH_PARTS_SUCCESS';
export const FETCH_HARDWARE_VERSIONS_SUCCESS = 'FETCH_HARDWARE_VERSIONS_SUCCESS';
export function fetchAllTestType() {
    return dispatch => {
        axios({
            url: `${configJson.prefix}/test_types`,
            method: 'get',
            params: {
                return: 'all'
            },
            headers:getHeader()
        })
            .then(function (response) {
                dispatch({
                    type: FETCH_TEST_TYPE_SUCCESS,
                    test_type:response.data.data
                });
            })
            .catch(function (error) {
                console.log('获取出错',error)
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
            headers:getHeader()
        })
            .then(function (response) {
                dispatch({
                    type: FETCH_PARTS_SUCCESS,
                    parts:response.data.data
                });
            })
            .catch(function (error) {
                console.log('获取出错',error)
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
            headers:getHeader()
        })
            .then(function (response) {
                dispatch({
                    type: FETCH_HARDWARE_VERSIONS_SUCCESS,
                    hardware_versions:response.data.data
                });
            })
            .catch(function (error) {
                console.log('获取出错',error)
            });
    }
}