import IDataCtx from 'core/service/data/context'
import ICommon from 'core/common/commonService'
import * as _mp from 'core/common/mapStrings'
import ISpTools from "provider/spTools/sptool"
import _swal from "sweetalert"

interface IWgFilter {
    filterWith?: Array<string>;
    optionList?: Array<{key: string, count: number}>;
}

interface IWgCatFilter {
    cat: IWgFilter;
    status: IWgFilter;
    name: IWgFilter;
}

interface ICrseStudExtended extends ecat.entity.ICrseStudInGroup {
    check: {
        isSelfDone: boolean,
        sp: {
            isDone: boolean;
            count: string;
        },
        strat: {
            isDone: boolean;
            count: string;
        }
    }
}

export default class EcFacultyWgList {
    static controllerId = 'app.faculty.wkgrp.list';
    static $inject = ['$uibModal',IDataCtx.serviceId, ICommon.serviceId, ISpTools.serviceId];
    
    private mp = _mp.MpSpStatus;
    private activeCourse: ecat.entity.ICourse;
    protected activeSort: { opt: string, desc: boolean } = { opt: 'mpCategory', desc: false };
    //private canPublish: boolean;
    protected courses: Array<ecat.entity.ICourse> = [];
    private filters: IWgCatFilter = {
        cat: { optionList: [], filterWith: [] },
        status: { optionList: [], filterWith: [] },
        name: { optionList: [], filterWith: [] }
    }

    private loggers = this.c.getAllLoggers('Faculty Workgroup Module');

    protected sortOpt = {
        status: 'mpSpStatus',
        group: 'mpCategory'

    }

    constructor(private $uim: angular.ui.bootstrap.IModalService, private dCtx: IDataCtx, private c: ICommon, private sptool: ISpTools) {
        this.activate();
    }
    
    private activate(force?: boolean): void {
        const that = this;

        const swalSettings: SweetAlert.Settings = {
            title: 'Oh no!, there was a problem initiazing the course. Please refresh and try this again later.',
            type: 'warning',
            allowEscapeKey: true,
            confirmButtonText: 'Ok'
        };

        this.dCtx.faculty.initFacCourses()
            .then(initResponse)
            .catch(initError);

       function initResponse(courses: Array<ecat.entity.ICourse>){
           
           courses.forEach((crs: ecat.entity.ICourse) => {
               crs['displayName'] = `${crs.classNumber}: ${crs.name}`;
           });

           courses = courses.sort((crseA: ecat.entity.ICourse, crseB: ecat.entity.ICourse) => {
               if (crseA.startDate < crseB.startDate) return 1;
               if (crseA.startDate > crseB.startDate) return -1;
               return 0;
           });

           that.courses = courses;

           const activeCourse = courses[0];
           if (activeCourse.workGroups) {
               that.unwrapGrpFilterables(activeCourse.workGroups);
           }

           that.dCtx.faculty.activeCourseId = activeCourse.id;
           that.activeCourse = activeCourse;
       }
       
        function initError(reason: string) {
            _swal(swalSettings);
        }
    }
    
    private changeActiveCourse(course: ecat.entity.ICourse): void {
        const that = this;
        const swalSettings: SweetAlert.Settings = {
            title: 'Oh no!, there was a problem changing the course. Please refresh and try this again later.',
            type: 'warning',
            allowEscapeKey: true,
            confirmButtonText: 'Ok'
        };
       
       this.dCtx.faculty.activeCourseId = course.id;

        this.dCtx.faculty
            .fetchActiveCourse()
            .then(getActiveCourseReponse)
            .catch(getActiveCourseError);
       
        function getActiveCourseReponse(crse: ecat.entity.ICourse) {

            if (crse.workGroups && crse.workGroups.length === 0) {
                that.loggers.warn('There are no WorkGroups for the Course you selected', null, true);
                return;
            }

            that.activeCourse = crse;
       }
       
       function getActiveCourseError(response: ecat.IQueryError) {
           _swal(swalSettings);
       }
            
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
    
    private goToPublish(wg: ecat.entity.IWorkGroup): void {
        if (!wg.canPublish) {
            const alertSettings: SweetAlert.Settings = {
                title: 'Not Yet!',
                text: 'Publishing is not possible at this time, all students in this workgroup have not completed all required' +
                    'self/peers and stratification. \n\n Check the group status for more information',
                type: _mp.MpSweetAlertType.warn,
                closeOnConfirm: true,
                showConfirmButton: true

            }
            _swal(alertSettings);
        } else {
            this.c.$state.go(this.c.stateMgr.faculty.wgPublish, {
                crseId: wg.courseId,
                wgId: wg.workGroupId
            });
        }
    }

    private goToResults(wg: ecat.entity.IWorkGroup): void {

    }

    private refreshInit(): void {
        this.activate(true);
    }

    protected sortList(sortOpt: string): void {
        if (this.activeSort.opt === sortOpt) {
            this.activeSort.desc = !this.activeSort.desc;
            return;
        }

        this.activeSort.opt = sortOpt;
        this.activeSort.desc = true;
    }

    private statusModal($scope: any, $mi: angular.ui.bootstrap.IModalServiceInstance, wg: ecat.entity.IWorkGroup){
        $scope.wgName = (wg.customName) ? `${wg.customName} [${wg.defaultName}]` : wg.defaultName;
        const members = wg.groupMembers as Array<ICrseStudExtended>;
        $scope.close = () => {$mi.close();};

        members.forEach(gm => {

            const isSelfDone = gm.statusOfPeer[gm.studentId].assessComplete;

            const peers = members.filter(mem => mem.studentId !== gm.studentId);

            const peersSpCompletion = peers.map(mem => gm.statusOfPeer[mem.studentId].assessComplete);


            gm['hasChartData'] = gm.statusOfStudent.gaveBreakOutChartData.some(cd => cd.data > 0);                    

            gm.check = {
                isSelfDone: isSelfDone,
                sp: {
                    isDone: !peersSpCompletion.some(complete => !complete),
                    count: `${peersSpCompletion.filter(complete => complete).length} / ${peersSpCompletion.length}`
                },
                strat: {
                    isDone: gm.numOfStratIncomplete === 0,
                    count: `${members.length - gm.numOfStratIncomplete} / ${members.length}`
                }
            }

        });
        $scope.wgMembers = members;
        $scope.remote = moment(wg['remote']).format('DD MMM HH:mm:ss');
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
        .sort((a: any, b: any) => a-b)
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
            const count = groups.filter(g => g.mpSpStatus === key).length;
            return {
                key: key,
                count: count
            }
        });
    }

    private viewStatus(wg: ecat.entity.IWorkGroup): void {
        const that = this;
        const modalSettings: angular.ui.bootstrap.IModalSettings = {
            controller: ['$scope','$uibModalInstance', 'wg', this.statusModal],
            backdrop: 'static',
            size: 'lg',
            keyboard: true,
            templateUrl: '@[appFaculty]/feature/workgroups/list.status.html'
        }
        
           const error: SweetAlert.Settings = {
            title: 'Not Found',
            text: 'Could not locate any members of this workgroup!',
            closeOnConfirm: true
        }

        const modal = this.$uim;
        const c = this.c;
        this.dCtx.faculty.activeGroupId = wg.workGroupId;
        let force = false;
        if (wg['remote'] !== undefined) {
            let diff = moment(Date.now()).diff(wg['remote'], 'minutes');
            if (diff > 1) {
                force = true;
            }
        }
        this.dCtx.faculty.fetchActiveWorkGroup(force)
        .then(getActiveWgReponse)
        .catch(getActiveWgResponseError);
        
        function getActiveWgReponse(wg:ecat.entity.IWorkGroup) {
            if (wg === null){
                  that.loggers.warn('Could not locate any members for this group', 'Could not locate any members for this group', true);
            }
            
            modalSettings.resolve = {wg: wg};
            modal.open(modalSettings);
        }
        
        function getActiveWgResponseError(reason:ecat.IQueryError) {
            error.text = 'Oops! Something went wrong...please refresh and try again!';
            c.swal(error);
        }

    }
}