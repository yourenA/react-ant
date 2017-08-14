/**
 * Created by Administrator on 2017/7/24.
 */
import config from './config.json';

export default  {
    env:'development',
    prefix: config.prefix,
    wsPort:config.wsPort,
    wsPrefix:config.wsPrefix,
}