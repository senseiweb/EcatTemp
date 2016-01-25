import IEcStateProvider from 'core/provider/stateProvider'
import AdminStates from "core/config/states/admin"
import CoreStates from "core/config/states/core"
import * as AppVar from "appVars"
import {SysErrorType as sysErrors} from 'appVars'

export default class EcCoreStateConfig {
    static $inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider', `${IEcStateProvider.providerId}Provider`, 'userStatic'];
    private $state: angular.ui.IStateService;
    private coreStates: CoreStates;
    private adminStates: AdminStates;

    constructor($locProvider: angular.ILocationProvider,
        $stateProvider: angular.ui.IStateProvider,
        $urlProvider: angular.ui.IUrlRouterProvider,
        statMgr: IEcStateProvider,
        userStatic?: ecat.entity.ILoginToken) {

        this.coreStates = new CoreStates();
        this.adminStates = new AdminStates();

        $locProvider.html5Mode(true);
        
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

                    state = self.coreStates[parentId as string];
                } while (state !== undefined && state !== null)

                return urlRoute;
            }

            if (userStatic === null) {

                return calculateUrl(this.coreStates.login);
            }

            if (userStatic.person.isRegistrationComplete) {
                return calculateUrl(this.coreStates.dashboard);
            }

            if (!userStatic.person.isRegistrationComplete) {
                return calculateUrl(this.coreStates.profile);
            }

            return calculateUrl(this.coreStates.dashboard);
        });

        const core = {};
        const coreStateList = Object.keys(CoreStates.prototype);

        coreStateList.forEach((coreStateKey) => {
            if (typeof this.coreStates[coreStateKey] !== 'object') {
                return null;
            }
            core[coreStateKey] = this.coreStates[coreStateKey];
            $stateProvider.state(this.coreStates[coreStateKey]);

        });

        statMgr.core = core as CoreStates;

        const admin = {};
        const adminStateList = Object.keys(AdminStates.prototype);

        adminStateList.forEach((adminStateKey) => {
            if (typeof this.adminStates[adminStateKey] !== 'object') {
                return null;
            }
            admin[adminStateKey] = this.adminStates[adminStateKey];
            $stateProvider.state(this.adminStates[adminStateKey]);
        });

        statMgr.admin = admin as AdminStates;
    }
}
    
    
