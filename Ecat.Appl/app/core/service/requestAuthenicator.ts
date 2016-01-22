import ICommon from 'core/service/common'
import IDataCtx from 'core/service/data/context'


export default class EcAuthenicator {
    static serviceId = 'data.authenicator';
    static $inject = ['$injector'];

    constructor(private $injector: angular.auto.IInjectorService) { }

    request = (rqCfg: angular.IRequestConfig): any => {
        const dataCtx = this.$injector.get(IDataCtx.serivceId) as IDataCtx;
        const common = this.$injector.get(ICommon.serviceId) as ICommon;

        const requestUrl = rqCfg.url.toLowerCase().indexOf('breeze') > -1;

        if (!requestUrl) {
            return common.$q.when(rqCfg);
        }

        const token = dataCtx.user.token;
        const now = new Date();

        if (token && token.auth && token.expire > now) {
            rqCfg.headers.Authorization = `Bearer ${token.auth
                }`;

            return common.$q.when(rqCfg);
        }
        return common.$q.when(rqCfg);
    }
}