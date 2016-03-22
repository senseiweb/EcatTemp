﻿import ICoreStates from "core/states/core"
import IStudStates from "core/states/student"
import IFacultyStates from "core/states/faculty"

export interface IStateMgr extends angular.IServiceProvider {
    $get(): IStateMgr;
    core: ICoreStates,
    student: IStudStates,
    faculty: IFacultyStates,
}

export default class EcCfgProviders {
    static appCfgProvider ={
        id: 'appCfg',
        provider: (): ecat.IModuleAppCfg => {
            const appCfgs = {
                coreApp: null,
                $get: () => appCfgs
            }
            return appCfgs;
        }
    }

    static stateConfigProvider = {
        id: 'stateMgr',
        provider: (): IStateMgr => {
            const stateMgrProvider = {
                core: null,
                student: null,
                faculty: null,
                $get: () => stateMgrProvider
            };
            return stateMgrProvider;
        }
    }

    constructor() { }
}
