import * as _mpe from 'core/common/mapEnum'
import * as _mp from 'core/common/mapStrings'
import _swal from "sweetalert"
import IDataCtx from 'core/service/data/context'
import ICommon from 'core/common/commonService'
import IUtility from 'core/service/data/utility'

interface IAssessPager {
    pageId: number;
    item: ecat.entity.ISpInventory;
}

export default class EcProviderSpToolAssessTaker {

    static controllerId = 'app.provider.sptools.assesser';
    static $inject = ['$rootScope','$uibModalInstance', IDataCtx.serviceId, ICommon.serviceId, 'assesseeId', 'viewOnly'];

    private activeInvent: ecat.entity.ISpInventory;
    private assessee: ecat.entity.IPerson;
    private assesseeGoByName: string;
    private assesseeName: string;
    
    private avatar: string;
    private currentPage: number;
    private previousPage = 1;
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
    private isStudent = true;
    private pagers: Array<IAssessPager> = [];
    private readyToSave = false;
    private role: string;

    constructor($rs: angular.IScope, private $mi: angular.ui.bootstrap.IModalServiceInstance, private dCtx: IDataCtx, private c: ICommon, private assesseeId: number, viewOnly: boolean) {
        this.isPublished = viewOnly;
        $rs.$on(c.coreCfg.coreApp.events.spInvntoryResponseChanged, ($event: angular.IAngularEvent) => {
            this.cancel($event);
        });
        this.activate();
    }    

    private activate(): void {
        this.role = this.dCtx.user.persona.mpInstituteRole;
        const myId = this.dCtx.user.persona.personId;
        this.isStudent = this.role === _mp.EcMapInstituteRole.student;

        if (this.isStudent) {
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
            this.instructions = this.isStudent ? instrument.studentInstructions : instrument.facultyInstructions;

            this.pagers = this.inventoryList.map(item => {
                const pager = {} as IAssessPager;
                pager.pageId = item.displayOrder;
                pager.item = item;
                return pager;
            }).sort(this.pagerSort);

            this.activeInvent = this.pagers[0].item;
        }

        this.assesseeName = `${this.assessee.firstName} ${this.assessee.lastName}`;
        this.avatar = this.assessee.avatarLocation || this.assessee.defaultAvatarLocation;
        this.assesseeGoByName = (this.assessee.goByName) ? `[${this.assessee.goByName}]` : null;
    }

    private acknowledge(): void {
        this.hasAcknowledge = true;
    }

    private cancel($event?: angular.IAngularEvent): void {
        console.log('scope destoryed');
        const hasChanges = this.inventoryList.some(item => item.responseForAssessee.entityAspect.entityState.isAddedModifiedOrDeleted());
        if (hasChanges) {
            const alertSetting: SweetAlert.Settings = {
                title: 'Caution, Unsaved Changes',
                text: 'You have made changes to this assessment that have not been saved, Are you sure you want to cancel them?',
                type: 'warning',
                closeOnCancel: true,
                closeOnConfirm: false,
                confirmButtonText: 'Yes, cancel changes.',
                cancelButtonText: 'No, don\'t cancel'
            };

            _swal(alertSetting, (confirmed?: boolean) => {
                if (confirmed) {
                    this.inventoryList.forEach(item => item.responseForAssessee.entityAspect.rejectChanges());
                    this.$mi.dismiss();
                    _swal('Gotta it...changes canceled.', 'sucess');
                }
            });
        } else {
            this.$mi.close('User canceled');
        }
    }

    private changePage(): void {
        const previousPager = this.pagers.filter(pager => pager.pageId === this.previousPage)[0];
        const currentPager = this.pagers.filter(pager => pager.pageId === this.currentPage)[0];

        this.activeInvent = currentPager.item;

        if (previousPager.item.responseForAssessee.mpItemResponse !== null) {
            //Hack: wow,this smells...
            const nodes = document.querySelectorAll('#sp-pager li > a') as NodeList;
            const links = Array.prototype.slice.call(nodes);
            const element = links.filter(e => e.text === this.previousPage.toString())[0];
            angular.element(element)
                .closest('li')
                .addClass('sp-complete');
            console.log(element);
        }

        this.previousPage = this.currentPage;
    }

    checkReadyToSave(): void {
        const allValidValues = this.inventoryList.every(item => item.responseForAssessee.mpItemResponse !== null);
        const hasChanges = this.inventoryList.some(item => item.responseForAssessee.entityAspect.entityState.isAddedModifiedOrDeleted());
        this.readyToSave = allValidValues && hasChanges;

        if (this.currentPage === this.pagers.length) {
            this.previousPage = this.currentPage;
            this.changePage();
        }
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

        const ctx = this.isStudent ? 'student' : 'faculty';

        const saveCtx = this.dCtx[ctx] as IUtility;
        const swalSettings: SweetAlert.Settings = {
            title: 'Oh no!, there was a problem updating this assessment. Try saving again, or cancel the current comment and attempt this again later.',
            type: 'warning',
            allowEscapeKey: true,
            confirmButtonText: 'Ok'
        }
        //TODO: need to write a finally method for canceling saveinprogress
        saveCtx.saveChanges()
            .then(() => {
                this.$mi.close();
            })
            .catch(() => {
                this.c.swal(swalSettings);
            });
    }


    private pagerSort(a: IAssessPager, b: IAssessPager) {
        if (a.pageId < b.pageId) return -1;
        if (a.pageId === b.pageId) return 0;
        if (a.pageId > b.pageId) return 1;
    }
}