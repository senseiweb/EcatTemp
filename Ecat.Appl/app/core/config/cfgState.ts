﻿import IEcStateProvider from 'core/provider/stateProvider'
import AdminStates from "admin/config/statesAdmin"
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

        this.loadStates(Object.keys(CoreStates.prototype), new CoreStates() as any, 'core');
        this.loadStates(Object.keys(AdminStates.prototype), new AdminStates() as any, 'admin');

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

    private loadStates = (statesNames: Array<string>, statesToLoad: ecat.IEcStateObject , stateHolder: string): void => {
        statesNames.forEach((state) => {
            if (angular.isObject(statesToLoad[state])) {
                this.$stateProvider.state(statesToLoad[state]);
                if (!angular.isObject(this.statMgr[stateHolder])) {
                    this.statMgr[stateHolder] = {};
                }
                this.statMgr[stateHolder][state] = statesToLoad[state];
            }
          
        });
    }
}
    
    
