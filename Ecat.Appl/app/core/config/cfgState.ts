import IEcStateProvider from 'core/provider/stateProvider'
import ICommon from "core/service/common"
import IDataCtx from "core/service/data/context"
import AdminStates from "admin/config/statesAdmin"
import StudentStates from "student/config/statesStudent"
import FacilitatorStates from "facilitator/config/statesFac"
import CourseAdminStates from "courseAdmin/config/statesCourseAdmin"
import DesignerStates from "designer/config/statesDesigner"
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

        const admin = new AdminStates(core.main);
        this.loadStates(Object.keys(admin), admin as any, 'admin');

        const student = new StudentStates(core.main);
        this.loadStates(Object.keys(student), student as any, 'student');

        const facilitator = new FacilitatorStates(core.main, core.dashboard);
        this.loadStates(Object.keys(facilitator), facilitator as any, 'facilitator');

        const courseAdmin = new CourseAdminStates(core.main, core.dashboard);
        this.loadStates(Object.keys(courseAdmin), courseAdmin as any, 'courseAdmin');

        const designer = new DesignerStates(core.main, core.dashboard);
        this.loadStates(Object.keys(designer), designer as any, 'designer');

        $urlProvider.otherwise(() => {
            const self = this;
            let urlRoute = '';
            const regEx = /\.(\w+)$/;

            function calculateUrl(state: angular.ui.IState): string {
                if (!state) {
                    return urlRoute;
                }
                urlRoute = state.url + urlRoute;
                
                const parentNameHasDot = regEx.exec(state.parent as string);
                let parentPropName: string;

                if (parentNameHasDot) {
                    parentPropName = parentNameHasDot[1];
                } else {
                    parentPropName = state.parent as string;
                }

                calculateUrl(self.statMgr.core[parentPropName]);
            }

            if (userStatic === null) {
               calculateUrl(this.statMgr.core.login);
                return urlRoute;
            }

            if (userStatic.person.registrationComplete) {
                calculateUrl(this.statMgr.core.dashboard);
                return urlRoute;

            }

            if (!userStatic.person.registrationComplete) {
                calculateUrl(this.statMgr.core.profile);
                return urlRoute;
            }

            calculateUrl(this.statMgr.core.dashboard);
            return urlRoute;
        });
    }

    private loadStates = (statesNames: Array<string>, statesToLoad: ecat.IEcStateObject, stateHolder: string): void => {
        statesNames.forEach((state) => {
            const stateToLoad = statesToLoad[state];
            if (angular.isObject(stateToLoad)) {
                this.$stateProvider.state(stateToLoad);
                if (!angular.isObject(this.statMgr[stateHolder])) {
                    this.statMgr[stateHolder] = {};
                }
                this.statMgr[stateHolder][state] = stateToLoad;
            }
          
        });
    }
}
    
    
