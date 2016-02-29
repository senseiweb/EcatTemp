import _core from "core/states/core"
import _student from "core/states/student"
import _faculty from "core/states/faculty"
import _stateMgr from "core/config/cfgProviders"
import {IStateMgr} from "core/config/cfgProviders";

export default class EcStateConfiguration {

    static $inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider', `${_stateMgr.stateConfigProvider.id}Provider`, 'userStatic'];
    appLoaded = false;
    statesToConfigure = [_core, _student, _faculty];

    constructor($lp: angular.ILocationProvider, private $sp: angular.ui.IStateProvider, $up: angular.ui.IUrlRouterProvider, private sm: IStateMgr, userStatic: ecat.entity.ILoginToken) {
        
        $lp.html5Mode(true);
        $up.otherwise(() => {
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

                calculateUrl(self.sm.core[parentPropName]);
            }

            if (userStatic === null) {
                calculateUrl(this.sm.core.login);
                return urlRoute;
            }

            if (userStatic.person.registrationComplete) {
                calculateUrl(this.sm.core.dashboard);
                return urlRoute;

            }

            if (!userStatic.person.registrationComplete) {
                calculateUrl(this.sm.core.profile);
                return urlRoute;
            }

            calculateUrl(this.sm.core.dashboard);
            return urlRoute;
        });
        $up.when('/app/main/faculty/workgroup', () => this.sm.faculty.wgList.name);
        $up.when('/app/redirect/error', () => {
            const stateErrorRedirect = localStorage.getItem('ECAT:APPERR:REDIRECT');
            if (stateErrorRedirect) {
                return '/';
            }
            return null;
        });
        this.appLoaded = true;
        this.load();
    }

    load = (): void => this.statesToConfigure.forEach(appStateClass => {
        let parentName = '';
        var stateClass: any = new appStateClass();
        var stateNames = Object.keys(stateClass);

        stateNames.forEach(stateName => {
            const stateToLoad = stateClass[stateName];

            if (angular.isObject(stateToLoad)) {
                this.$sp.state(stateToLoad);
                if (parentName) {
                    this.sm[parentName][stateName] = stateToLoad;
                } else {
                    parentName = stateClass.parentName;
                    this.sm[parentName] = {};
                    this.sm[parentName][stateName] = stateToLoad;
                }
            }

        });
    });
}