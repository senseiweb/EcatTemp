import * as _mpe from 'core/common/mapEnum'
import * as _mp from 'core/common/mapStrings'
import IDataCtx from 'core/service/data/context'
import ICommon from 'core/common/commonService'

interface IAssessPager {
    itemId: number;
    displayId: number;
    isCompleted: boolean;
    isOpen: boolean;
    isActive: boolean;
}

export default class EcProviderSpToolAssessTaker {

    static controllerId = 'app.provider.sptools.assesser';
    static $inject = ['$uibModalInstance', IDataCtx.serviceId, ICommon.serviceId, 'assesseeId', 'viewOnly'];

    private activeInvent: ecat.entity.ISpInventory;
    private assessee: ecat.entity.IPerson;
    private assesseeGoByName: string;
    private assesseeName: string;
    private avatar: string;
    private enum = {
        he: _mpe.SpEffectLevel.HighlyEffective,
        e: _mpe.SpEffectLevel.Effective,
        ie: _mpe.SpEffectLevel.Ineffective,
        fre: _mpe.SpFreqLevel.Frequently,
        alw: _mpe.SpFreqLevel.Always
    }
    private groupName: string;
    private hasAcknowledge = false;
    private instructions: string;
    private inventoryList: Array<ecat.entity.ISpInventory> = [];
    private isNewAssess = false;
    private isPublished = false;
    private isPristine = false;
    private isSelf = false;
    private pagers: Array<IAssessPager> = [];
    private readyToSave = false;
    private role: string;

    constructor(private $mi: angular.ui.bootstrap.IModalServiceInstance, private dCtx: IDataCtx, private c: ICommon, private assesseeId: number, viewOnly: boolean) {
        this.isPublished = viewOnly;
        c.$rootScope.$on('$destory', () => {
            this.$mi.dismiss('closed by destory');
        });
        this.activate();
    }    

    private activate(): void {
        this.role = this.dCtx.user.persona.mpInstituteRole;
        const myId = this.dCtx.user.persona.personId;
        const isStudent = this.role === _mp.EcMapInstituteRole.student;

        if (isStudent) {
            this.inventoryList = this.dCtx.student.getSpInventory(this.assesseeId) as Array<ecat.entity.IStudSpInventory>;
        } else {
            this.inventoryList = this.dCtx.faculty.getFacSpInventory(this.assesseeId) as Array<ecat.entity.IFacSpInventory>;
        }

        const response = this.inventoryList[0].responseForAssessee;
        this.assessee = response.assessee.studentProfile.person;
        this.isSelf = this.assessee.personId === myId;
        this.groupName = response.workGroup.customName || response.workGroup.defaultName;
        this.isNewAssess = this.inventoryList.some(item => item.responseForAssessee.entityAspect.entityState === breeze.EntityState.Added);

        if (this.isNewAssess) {
            const instrument = this.inventoryList[0].instrument;
            this.instructions = isStudent ? instrument.studentInstructions : instrument.facultyInstructions;

            this.pagers = this.inventoryList.map(item => {
                const pager = {} as IAssessPager;
                pager.displayId = item.displayOrder;
                pager.isCompleted = item.responseForAssessee.mpItemResponse !== null;
                pager.isOpen = pager.isCompleted;
                pager.itemId = item.id;
                return pager;
            }).sort(this.pagerSort);
        }

        this.assesseeName = `${this.assessee.firstName} ${this.assessee.lastName}`;
        this.avatar = this.assessee.avatarLocation || this.assessee.defaultAvatarLocation;
        this.assesseeGoByName = (this.assessee.goByName) ? `[${this.assessee.goByName}]` : null;
       
    }

    private acknowledge(): void {
        this.hasAcknowledge = true;
        const firstItem = this.pagers[0];
        this.changeInventory(firstItem, 0, true);
    }

    private changeInventory(pager: IAssessPager, $index: number, skipCheck?: boolean): void {
        const previousIndex = $index === 0 ? $index : $index - 1;
        const previousPager = this.pagers[previousIndex];

        if (!skipCheck) {
            const previousItem = this.inventoryList.filter(item => item.id === previousPager.itemId)[0];
            previousPager.isCompleted = previousItem.responseForAssessee.mpItemResponse !== null;
            if (!previousPager.isCompleted) {
                return null;
            }
        }

        const inventoryItem = this.inventoryList.filter(item => item.id === pager.itemId)[0];
        this.activeInvent = inventoryItem;
    }

    private cancel(): void {
        
    }

    private checkDone(): void {
        const allValidValues = this.inventoryList.every(item => item.responseForAssessee.mpItemResponse !== null);
        const hasChanges = this.inventoryList.some(item => item.responseForAssessee.entityAspect.entityState.isAddedModifiedOrDeleted());

        this.isPristine = allValidValues && !hasChanges;
        this.readyToSave = allValidValues && hasChanges;
    }

    private checkResponse(item: ecat.entity.ISpInventory | any) {
        item.showBehavior = false;
    }

    private createInventList(): void {
        
    }

    private getFormattedResponse(item: ecat.entity.ISpInventory): string {

        switch (item.responseForAssessee.mpItemResponse) {
        case _mp.EcSpItemResponse.iea:
            return 'Always: Ineffective';
        case _mp.EcSpItemResponse.ieu:
            return 'Fequently: Ineffective';
        case _mp.EcSpItemResponse.ea:
            return 'Always: Effective';
        case _mp.EcSpItemResponse.eu:
            return 'Frequently: Effective';
        case _mp.EcSpItemResponse.heu:
            return 'Frequently: Highly Effective';
        case _mp.EcSpItemResponse.hea:
            return 'Always: Highly Effective';
        default:
            return 'Unknown';
        }
    }

    private save(): void {
        if (this.isPublished) {
            const swalPubSettings: SweetAlert.Settings = {
                title: 'How did you get here!',
                text: 'The workgroup status has been set to published, no changes are allowed!',
                type: 'error',
                allowEscapeKey: true,
                confirmButtonText: 'Ok'
            }
            return this.c.swal(swalPubSettings);
        }

    }

    private pagerSort(a: IAssessPager, b: IAssessPager) {
        if (a.displayId < b.displayId) return -1;
        if (a.displayId === b.displayId) return 0;
        if (a.displayId > b.displayId) return 1;
    }
}