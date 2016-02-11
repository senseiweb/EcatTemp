import IEcStateProvider from 'core/provider/stateProvider'
import ICommon from "core/service/common"
import IDataCtx from "core/service/data/context"
import AdminStates from "admin/config/statesAdmin"
import StudentStates from "student/config/statesStudent"
import FacilitatorStates from "facilitator/config/statesFac"
import CourseAdminStates from "courseAdmin/config/statesCourseAdmin"
import CoreStates from "core/config/statesCore"
import * as AppVar from "appVars"

export default class EcCoreStateConfig {
    static $inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider', `${IEcStateProvider.providerId}Provider`, 'userStatic'];
    private $state: angular.ui.IStateService;
    constructor($locProvider: angular.ILocationProvider,
        private $stateProvider: angular.ui.IStateProvider,
        $urlProvider: angular.ui.IUrlRouterProvider,
        private statMgr: IEcStateProvider,
        userStatic?: ecat.entity.ILoginToken) {

        $locProvider.html5Mode(true);

        const core = new CoreStates();
        this.loadStates(Object.keys(core), core as any, 'core');

        const admin = new AdminStates(core.main, core.dashboard);
        this.loadStates(Object.keys(admin), admin as any, 'admin');

        const student = new StudentStates(core.main, core.dashboard);
        this.loadStates(Object.keys(student), student as any, 'student');

        const facilitator = new FacilitatorStates(core.main, core.dashboard);
        this.loadStates(Object.keys(facilitator), facilitator as any, 'facilitator');

        const courseAdmin = new CourseAdminStates(core.main, core.dashboard);
        this.loadStates(Object.keys(courseAdmin), courseAdmin as any, 'courseAdmin');

        $urlProvider.otherwise(() => {
            const self = this;
            const regEx = /\.(\w+)$/;

            function calculateUrl(state: angular.ui.IState) {
                let urlRoute = '';

                do {
                    urlRoute = state.url + urlRoute;

                    const parentMatch = regEx.exec(state.parent as string);
                    let parentId: string; 

                    if (parentMatch) {
                        parentId = parentMatch[0].substring(1);
                    } else {
                        parentId = state.parent as string;
                    }

                    state = self.statMgr.core[parentId as string];
                } while (state !== undefined && state !== null)

                return urlRoute;
            }

            if (userStatic === null) {

                return calculateUrl(this.statMgr.core.login);
            }

            if (userStatic.person.isRegistrationComplete) {
                return calculateUrl(this.statMgr.core.dashboard);
            }

            if (!userStatic.person.isRegistrationComplete) {
                return calculateUrl(this.statMgr.core.profile);
            }

            return calculateUrl(this.statMgr.core.dashboard);
        });
    }

    private loadStates = (statesNames: Array<string>, statesToLoad: ecat.IEcStateObject, stateHolder: string): void => {
        statesNames.forEach((state) => {
            const stateToLoad = statesToLoad[state];
            if (angular.isObject(stateToLoad)) {
            //    if (stateToLoad.name.indexOf('redirect') < 0) {
            //        const checkTokenResolve = { tokenValid: [IDataCtx.serviceId,ICommon.serviceId,(dCtx: IDataCtx, c: ICommon) => c.checkValidToken()]}
            //        stateToLoad.resolve = angular.extend({}, checkTokenResolve, stateToLoad.resolve);
            //    }
                this.$stateProvider.state(stateToLoad);
                if (!angular.isObject(this.statMgr[stateHolder])) {
                    this.statMgr[stateHolder] = {};
                }
                this.statMgr[stateHolder][state] = stateToLoad;
            }
          
        });
    }
}
    
    
