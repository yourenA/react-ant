/**
 * Created by Administrator on 2017/7/24.
 */
import config from './config.json';

export default  {
        env:'production',
        prefix: config.prefix_prod,
        wsPort:config.wsPort_prod,
        wsPrefix:config.wsPrefix_prod,
}