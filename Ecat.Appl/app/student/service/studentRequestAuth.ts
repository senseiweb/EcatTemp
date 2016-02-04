import ICommon from 'core/service/common'
import IDataCtx from "core/service/data/context"

export default class EcAuthenicator {
    static serviceId = 'data.student.authenicator';
    static $inject = ['$injector'];

    constructor(private $injector: angular.auto.IInjectorService) { }

    request = (rqCfg: angular.IRequestConfig): any => {
        const c = this.$injector.get(ICommon.serviceId) as ICommon;
        const dCtx = this.$injector.get(IDataCtx.serviceId) as IDataCtx;
        const crseMemId = dCtx.student.activeCourse ? dCtx.student.activeCourse.id : null;
        const requestUrl = rqCfg.url.toLowerCase().indexOf('/breeze/student/') > -1;

        if (!requestUrl) {
            return c.$q.when(rqCfg);
        }

        if (!crseMemId) {
            c.logger.logError('Detected a request to the student endpoint; however, no active course exists! Request Terminated!', rqCfg, 'Student Request Authenicator', false);
           return c.$q.reject('Access to resource forbidden without an active course selected');
        }

        rqCfg.headers['X-ECAT-PVT-AUTH'] = `${c.appVar.AuthHeaderType.CourseMember}: ${crseMemId}`;

        return c.$q.resolve(rqCfg);
    }
}