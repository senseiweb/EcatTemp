import ICommon from "core/common/commonService"
import IDataCtx from "core/service/data/context"
import * as _mpe from "core/common/mapEnum"

export default class EcAuthenicator implements angular.IHttpInterceptor {
    static serviceId = 'data.core.authenicator';
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

    responseError = (rejection: any): any => {
        const c = this.$injector.get(ICommon.serviceId) as ICommon;
        if (rejection.status !== '401') return rejection;

        const dCtx = this.$injector.get(IDataCtx.serviceId) as IDataCtx;

        if (dCtx.user.token.validity() !== _mpe.TokenStatus.Expired) return rejection;

        c.logger.logError('Your security token has expired. Please reenter your credentials', rejection, 'Authenicator', true);
        c.$state.go(c.stateMgr.core.login.name, { mode: 'lock' });
        return rejection;
    }
}