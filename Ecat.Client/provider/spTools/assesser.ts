import * as _mpe from "core/common/mapEnum"

interface IAssessPager {
    itemId: number;
    displayId: number;
    isCompleted: number;
}

export default class EcProviderSpToolAssessTaker {

    static controllerId = 'app.provider.sptools.assesser';
    static $inject = [''];

    private activeInvent: ecat.entity.ISpInventory;
    private assessee: ecat.entity.IPerson;
    private assesseeName: string;
    private avatar: string;
    private enum = _mpe;
    private groupName: string;
    private hasAcknowledge = false;
    private instructions: string;
    private isNewAssess = false;
    private isSelf = false;
    private pagers: Array<IAssessPager> = [];
    private readyToSave = false;

    constructor() { }    

    private changeInventory(pager: IAssessPager) {
        
    }

    private cancel(): void {
        
    }

    private save(): void {
        
    }
}