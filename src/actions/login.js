/**
 * Created by Administrator on 2017/3/8.
 */
import {message} from 'antd';
import messageJson from './../common/message.json';
import {removeLoginStorage, getHeader} from './../common/common.js';
import configJson from 'configJson' ;
import axios from 'axios';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const ACTIVE_FAIL = 'ACTIVE_FAIL';
export const SIGNOUT_SUCCESS = 'SIGNOUT_SUCCESS';
export const SIGNOUT_FAIL = 'SIGNOUT_FAIL';

export function checkLogin() {
    return dispatch => {
        const username = localStorage.getItem('username') || sessionStorage.getItem('username');
        const token = localStorage.getItem('usertoken') || sessionStorage.getItem('usertoken');
        const permissions = localStorage.getItem('permissions') || sessionStorage.getItem('permissions');
        if (username && token) {
            dispatch({
                type: LOGIN_SUCCESS,
                username: username,
                token: token,
                permissions: JSON.parse(permissions)
            });
            return true
        } else {
            return false
        }
    }
}
export function login(user, from, history) {
    return dispatch => {
        axios.post(`${configJson.prefix}/login`, {
            username: user.username,
            password: user.password
        })
            .then(function (response) {
                console.log(response);
                localStorage.setItem('userData', JSON.stringify(response.data));
                localStorage.setItem('username', user.username);
                localStorage.setItem('userrole', response.data.role_name);
                localStorage.setItem('usertoken', response.data.token);
                localStorage.setItem('permissions', JSON.stringify(response.data.permissions.data));
                message.success(messageJson['sign in success']);
                dispatch({
                    type: LOGIN_SUCCESS,
                    username: user.username,
                    token: response.data.token,
                    permissions: response.data.permissions.data
                });
                window.location.replace('/')
            })
            .catch(function (error) {
                if (error.toString() === 'Error: Network Error') {
                    message.error(messageJson['network error'], 3);
                    return false
                }
                else if (error.response.status === 403) {
                    message.error(messageJson['sign in fail']);
                } else {
                    message.error(messageJson['unknown error']);
                }
            });
    }
}

export function signout() {
    console.log("执行退出");
    return dispatch => {
        axios({
            url: `${configJson.prefix}/logout`,
            method: 'post',
            headers: getHeader()
        })
            .then(function (response) {
                removeLoginStorage();
                message.success(messageJson['sign out success']);
                dispatch({
                    type: SIGNOUT_SUCCESS,
                });
                window.location.replace('/login')
            })
            .catch(function (error) {
                removeLoginStorage();
                message.error(`${error.response.data.message},请重新登陆`);
                dispatch({
                    type: SIGNOUT_FAIL,
                });
                window.location.replace('/login')
            });
    }
}

