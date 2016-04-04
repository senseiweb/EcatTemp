import ICoreStates from "core/states/core"
import IStudStates from "core/states/student"
import IDesignerStates from "core/states/designer"
import IFacultyStates from "core/states/faculty"

export interface IStateMgr extends angular.IServiceProvider {
    $get(): IStateMgr;
    core: ICoreStates;
    student: IStudStates;
    faculty: IFacultyStates;
    designer: IDesignerStates;
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
                designer: null,
                $get: () => stateMgrProvider
            };
            return stateMgrProvider;
        }
    }

    constructor() { }
}
