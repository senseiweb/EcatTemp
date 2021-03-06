﻿import IEmFactory from "core/service/data/emfactory"
import IUserData from 'core/service/data/user'
import IStaticData from "core/service/data/static"
import IStudentData from "student/service/studCtx"
import IFaculty from "faculty/service/facCtx"
import IFacAdmin from "faculty/service/lmsAdminCtx"
import IDesignerData from "designer/service/designCtx"
import _common from "core/common/commonService"
import * as _mp from "core/common/mapStrings"

export default class EcDataContext {
    static serviceId = 'data.context';
    static $inject = ['$rootScope', _common.serviceId, IEmFactory.serviceId];

    loadedManagers: Array<{ module: string, mgr: breeze.EntityManager }> = [];
    
    static: IStaticData;
    private repoNames = [
        'static',
        this.fixUpResourceName(_mp.MpApiResource.user),
        this.fixUpResourceName(_mp.MpApiResource.sa),
        this.fixUpResourceName(_mp.MpApiResource.student),
        this.fixUpResourceName(_mp.MpApiResource.facAdmin),
        this.fixUpResourceName(_mp.MpApiResource.designer),
        this.fixUpResourceName(_mp.MpApiResource.faculty)
    ];

    sysAdmin: any;
    student: IStudentData;
    user: IUserData;
    faculty: IFaculty;
    lmsAdmin: IFacAdmin;
    designer: IDesignerData;

    constructor($rs: angular.IRootScopeService, private c: _common, emfactory: IEmFactory) {
        this.repoNames.forEach((name: string) => {
            Object.defineProperty(this, name, {
                configurable: true,
                get() {
                    const repo = emfactory.getRepo(name);
                    Object.defineProperty(this, name, {
                        value: repo,
                        configurable: false,
                        enumerable: true
                    });
                    return repo;
                }
            });
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
        });
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
        this.user.isLoggedIn = false;
    }

}


