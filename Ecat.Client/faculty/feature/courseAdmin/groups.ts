import IDataCtx from 'core/service/data/context'
import ICommon from 'core/common/commonService'
import _swal from "sweetalert"
import * as _mp from 'core/common/mapStrings'

export default class EcCrseAdGrpList {
    static controllerId = 'app.faculty.crseAd.groups';
    static $inject = ['$uibModal', IDataCtx.serviceId, ICommon.serviceId];

    private activeView: CrseAdGrpsViews;
    private activeCourseId = 0;
    protected activeGroup: ecat.entity.IWorkGroup;
    private filters: IGrpCatFilter = {
        cat: { optionList: [], filterWith: [] },
        status: { optionList: [], filterWith: [] },
        name: { optionList: [], filterWith: [] }
    }
    protected grpCat = {
        bc1: _mp.MpGroupCategory.bc1,
        bc2: _mp.MpGroupCategory.bc2,
        bc3: _mp.MpGroupCategory.bc3,
        bc4: _mp.MpGroupCategory.bc4
    }
    protected groupMembers: Array<ecat.entity.IPerson>;
    protected sortOpt = {
        status: 'mpSpStatus',
        group: 'mpCategory'
    }
    protected activeSort: { opt: string, desc: boolean } = { opt: 'mpCategory', desc: false };
    protected view = {
        loading: CrseAdGrpsViews.Loading,
        list: CrseAdGrpsViews.List,
        enroll: CrseAdGrpsViews.Enrollments
    }
    protected workGroups: Array<ecat.entity.IWorkGroup>;

    constructor(private $uim: angular.ui.bootstrap.IModalService, private dCtx: IDataCtx, private c: ICommon) {
        this.activeCourseId = this.c.$stateParams.crseId;
        this.activate();
    }

    private activate(force?: boolean): void {
        const that = this;

        this.dCtx.lmsAdmin.fetchAllGroups(this.activeCourseId, force)
            .then(initResponse)
            .catch((reason) => console.log(reason));

        function initResponse(workGroups: Array<ecat.entity.IWorkGroup>) {
            that.unwrapGrpFilterables(workGroups);
            that.workGroups = workGroups;
            that.activeView = that.view.list;
        }
       
        //TODO: Need to take of error
        function initError(reason: string) {

        }
    }

    protected backToGroups(): void {
        this.activeGroup = null;
        this.activeView = this.view.list;
    }

    private filteredGrpCat = (item: ecat.entity.IWorkGroup) => {

        return this.filters.cat.filterWith.length === 0 || this.filters.cat.filterWith.some(e => item.mpCategory === e);
    }

    private filteredGrpFlight = (item: ecat.entity.IWorkGroup) => {

        return this.filters.name.filterWith.length === 0 || this.filters.name.filterWith.some(e => item.defaultName === e);
    }

    private filteredGrpStatus = (item: ecat.entity.IWorkGroup) => {

        return this.filters.status.filterWith.length === 0 || this.filters.status.filterWith.some(e => item.mpSpStatus === e);
    }

    protected getFacultyById(id: number): string {
        const faculty = this.dCtx.lmsAdmin.getFacultyById(id);
        if (!faculty) return 'Unknown';
        return `${faculty.lastName}, ${faculty.firstName}`;
    }

    protected goToGroup(workGroup: ecat.entity.IWorkGroup) {
        const that = this;
        this.dCtx.lmsAdmin.fetchAllGroupMembers(workGroup.workGroupId)
            .then(goToGroupReponse)
            .catch(goToGroupError);

        function goToGroupReponse(wgWithMembers: ecat.entity.IWorkGroup) {
            that.activeGroup = workGroup;
            that.groupMembers = wgWithMembers.groupMembers.map(gm => gm.studentProfile.person);
            that.activeView = that.view.enroll;
        }

        function goToGroupError(wgWithMembers: ecat.entity.IWorkGroup) {

        }
    }

    protected pollActiveGroupMembers(): void {
        const that = this;

        this.dCtx.lmsAdmin.pollActiveGroupMembers(this.activeGroup.workGroupId)
            .then(pollActiveGmResponse)
            .catch(pollActiveGmError);

        function pollActiveGmResponse(reconResult: ecat.entity.IGrpMemRecon): void {
            const alertSettings: SweetAlert.Settings = {
                title: 'Polling Complete!',
                text: '',
                type: _mp.MpSweetAlertType.success,
                html: true
            }

            if (!reconResult || (reconResult.numAdded === 0 && reconResult.numRemoved === 0)) {
                alertSettings.text = 'No Changes Detected';
            } else {
                that.groupMembers = reconResult.groupMembers.map(gm => gm.studentProfile.person);
                alertSettings.text = `The following memberships changes were made to workGroup: ${that.activeGroup.defaultName}<br/><br/><hr/>
                       Accounts Added ${reconResult.numAdded}<br/> Accounts Removed ${reconResult.numRemoved}`;
            }
            _swal(alertSettings);
        }

        //TODO: Need to add error handler
        function pollActiveGmError(): void {

        }
    }

    protected pollGroupCategory(category: string): void {
        const that = this;

        this.dCtx.lmsAdmin.pollGroupCatMembers(this.activeCourseId, category)
            .then(pollActiveGmResponse)
            .catch(pollActiveGmError);

        function pollActiveGmResponse(reconResult: Array<ecat.entity.IGrpMemRecon>): void {
            const alertSettings: SweetAlert.Settings = {
                title: 'Polling Complete!',
                text: 'Here are the results <br/><br/><hr/>',
                type: _mp.MpSweetAlertType.success,
                html: true
            }

            if (!reconResult || reconResult.length !== 0) {
                reconResult.forEach(rr => {
                    alertSettings.text += `${rr.workGroupName}  Added: ${rr.numAdded} Removed: ${rr.numRemoved}<br/>`;
                });

            } else {
                alertSettings.text = 'No Changes Detected';
            }

            _swal(alertSettings);
            if (that.activeGroup.workGroupId) that.groupMembers = that.dCtx.lmsAdmin.getGroupMembers(that.activeGroup.workGroupId);
        }

        //TODO: Need to add error handler
        function pollActiveGmError(): void {

        }
    }

    protected pollLmsGroups(): void {
        const that = this;

        this.dCtx.lmsAdmin.pollGroups(this.activeCourseId)
            .then(pollLmsGroupResponse)
            .catch(pollLmsGroupError);

        function pollLmsGroupResponse(reconResult: ecat.entity.IGrpRecon): void {
            const alertSettings: SweetAlert.Settings = {
                title: 'Polling Complete!',
                text: `Here are the results <br/><br/><hr/>
                       WorkGroups Created: ${reconResult.numAdded} <br/> Accounts Added ${reconResult.numRemoved}`,
                type: _mp.MpSweetAlertType.success,
                html: true
            }

            if (reconResult.numAdded === 0 && reconResult.numRemoved === 0) {
                alertSettings.text = 'No Changes Detected';
            }
            _swal(alertSettings);
            that.workGroups = that.dCtx.lmsAdmin.getAllWorkGroups(that.activeCourseId);
        }
        //TODO: need to write error handler
        function pollLmsGroupError(reason: ecat.IQueryError): void {
            
        }
    }

    protected syncBbGrades(wgCategory: string): void {
        const that = this;

        this.dCtx.lmsAdmin.syncGrades(this.activeCourseId, wgCategory)
            .then(syncGradesResponse)
            .catch(syncGradesError);

        function syncGradesResponse(response: Array<ecat.entity.ISaveGradesResp>): void {
            var alertSettings: SweetAlert.Settings = {
                title: wgCategory + ' Sync Complete!',
                text: response.length + ' grades were successfully uploaded to Blackboard for ' + wgCategory,
                type: _mp.MpSweetAlertType.success,
                html: true
            }

            if (response === null || response[0].result === 'failed') {
                alertSettings.text = response[1].result;
                alertSettings.title = 'Sync Failed!';
                alertSettings.type = _mp.MpSweetAlertType.err;
            }
            _swal(alertSettings);
        }
        //TODO: need to write error handler
        function syncGradesError(reason: ecat.IQueryError): void {

        }
    }

    protected sortList(sortOpt: string): void {
        if (this.activeSort.opt === sortOpt) {
            this.activeSort.desc = !this.activeSort.desc;
            return;
        }

        this.activeSort.opt = sortOpt;
        this.activeSort.desc = true;
    }

    private unwrapGrpFilterables(groups: Array<ecat.entity.IWorkGroup>): void {
        const grpCat = {};
        const grpName = {};
        const grpStatus = {};

        groups.forEach((g, i, array) => {
            grpCat[g.mpCategory] = null;
            grpName[g.groupNumber] = null;
            grpStatus[g.mpSpStatus] = null;
        });

        const uniqueCatKeys = Object.keys(grpCat).sort();
        const uniqueNameKeys = Object.keys(grpName)
            .sort((a: any, b: any) => a - b)
            .map(grpNum => `Flight ${grpNum}`);

        const uniqueStatusKeys = Object.keys(grpStatus).sort();

        this.filters.cat.optionList = uniqueCatKeys.map(key => {
            const count = groups.filter(g => g.mpCategory === key).length;
            return {
                key: key,
                count: count
            }
        });

        this.filters.name.optionList = uniqueNameKeys.map(key => {
            const count = groups.filter(g => g.defaultName === key).length;
            return {
                key: key,
                count: count
            }
        });

        this.filters.status.optionList = uniqueStatusKeys.map(key => {
            const count = groups.filter(g => g.mpCategory === key).length;
            return {
                key: key,
                count: count
            }
        });
    }
}

const enum CrseAdGrpsViews {
    Loading,
    List,
    Enrollments
}


interface IGrpFilter {
    filterWith?: Array<string>;
    optionList?: Array<{ key: string, count: number }>;
}

interface IGrpCatFilter {
    cat: IGrpFilter;
    status: IGrpFilter;
    name: IGrpFilter;
}
