import ICommon from 'core/service/common'
import IDataCtx from "core/service/data/context"

export default class EcAuthenicator {
    static serviceId = 'data.authenicator';
    static $inject = ['$injector'];

    constructor(private $injector: angular.auto.IInjectorService) { }

    request = (rqCfg: angular.IRequestConfig): any => {
        const c = this.$injector.get(ICommon.serviceId) as ICommon;
        const dCtx = this.$injector.get(IDataCtx.serviceId) as IDataCtx;

        const requestUrl = rqCfg.url.toLowerCase().indexOf('breeze') > -1;

        if (!requestUrl) {
            return c.$q.when(rqCfg);
        }

        const token = dCtx.user.token;
        const now = new Date();

        if (token && token.auth && token.expire > now) {
            rqCfg.headers.Authorization = `Bearer ${token.auth
                }`;

            return c.$q.when(rqCfg);
        }
        return c.$q.when(rqCfg);
    }
}