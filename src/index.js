import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.less';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import { checkLogin} from './actions/login'
const store = configureStore();
store.dispatch(checkLogin());
exports.store  = store;
const render = Component =>
    ReactDOM.render(
            <Provider store={store}>
                <Component />
            </Provider>
        ,
        document.getElementById('root')
    );
render(App)

registerServiceWorker();
