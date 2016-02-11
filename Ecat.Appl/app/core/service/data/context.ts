﻿import IEntityFactory from 'core/service/data/emFactory'
import IUserData from 'core/service/data/user'
import ILocal from 'core/service/data/local'
import ISysAdminData from "admin/service/adminData"
import IStudentData from "student/service/studentData"
import ICourseAdminData from "courseAdmin/service/courseAdminData"
import ICommon from "core/service/common"
import IMock from "core/service/data/mock"
import * as AppVars from "appVars"

export default class EcDataContext {
    static serviceId = 'data.context';
    static $inject = ['$rootScope', ICommon.serviceId,IEntityFactory.serviceId];

    private loadedManagers: Array<{module: string, mgr: breeze.EntityManager}> = [];
    local: ILocal;
    private repoNames = ['local',
        this.fixUpResourceName(AppVars.EcMapApiResource.mock),
        this.fixUpResourceName(AppVars.EcMapApiResource.user),
        this.fixUpResourceName(AppVars.EcMapApiResource.sa),
        this.fixUpResourceName(AppVars.EcMapApiResource.student),
        this.fixUpResourceName(AppVars.EcMapApiResource.courseAdmin)
    ];
    sysAdmin: ISysAdminData;
    student: IStudentData;
    user: IUserData;
    mock: IMock;
    courseAdmin: ICourseAdminData;

    constructor($rs: angular.IRootScopeService, private c: ICommon, emFactory: IEntityFactory) {
        this.repoNames.forEach((name: string) => {
            Object.defineProperty(this, name, {
                configurable: true,
                get() {
                    const repo = emFactory.getRepo(name);
                    Object.defineProperty(this, name, {
                        value: repo,
                        configurable: false,
                        enumerable: true
                    });
                    return repo;
                }
            });
        });

        $rs.$on(c.coreCfg.coreEvents.addManager, (event: angular.IAngularEvent, data: Array<any>) => {
            this.loadedManagers.push({ module: data[0].data.module, mgr: data[0].data.mgr });
            event.preventDefault();
        });
    }

    private clearManagers(): void {
        this.loadedManagers.forEach((holder) => {
            holder.mgr.clear();
        });
    }
    
    private fixUpResourceName(name: string): string {
        const firstChar = name.substr(0, 1).toLowerCase();
        return firstChar + name.substr(1);
    }

    unsavedChanges(): Array<{ name: string, hasChanges: boolean }> {
        const changesStatus: Array<{ name: string, hasChanges: boolean }> = [];
        this.loadedManagers.forEach((holder) => {
            changesStatus.push({ name: holder.module, hasChanges: holder.mgr.hasChanges() });
            }
        );
        return changesStatus.filter(status => status.hasChanges);
    }

    logoutUser(): void {
        this.clearManagers();
        this.user.persona = null;
        this.user.token.auth = null;
        this.user.token.warning = null;
        this.user.token.expire = null;
        this.user.token.userEmail = null;
        this.user.token.password = null;
        this.user.userStatic = null;
        localStorage.removeItem('ECAT:TOKEN');
        sessionStorage.removeItem('ECAT:TOKEN');
        this.user.isLoggedIn = false
        this.user.userApiResources.userToken.resource.isLoaded = false;
    }

}


