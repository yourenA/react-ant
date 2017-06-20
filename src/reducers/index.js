import { combineReducers } from 'redux';
import { global } from './global';
import login from './login';
import fetchTestConf from './fetchTestConf';

//注册reducer，每个自定义的reducer都要来这里注册！！！不注册会报错。
const rootReducer = combineReducers({
  /* your reducers */
  global,
  login,
  fetchTestConf
});

export default rootReducer;
