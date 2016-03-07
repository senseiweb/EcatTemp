import IDataCtx from 'core/service/data/context'
import ICommon from 'core/common/commonService'
import * as _mp from 'core/common/mapStrings'

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
    },
    aggreg: {
        he: any,
        e: any,
        nd: any,
        ie: any,
    }
    
}

export default class EcFacultyWgList {
    static controllerId = 'app.faculty.wkgrp.list';
    static $inject = ['$uibModal',IDataCtx.serviceId, ICommon.serviceId];
    
    private mp = _mp.MpSpStatus;
    private activeCourse: ecat.entity.ICourse;
    private canPublish = false;
    private courses: Array<ecat.entity.ICourse> = [];
    private filters: IWgCatFilter = {
        cat: { optionList: [], filterWith: [] },
        status: { optionList: [], filterWith: [] },
        name: { optionList: [], filterWith: [] }
    }

    constructor(private $uim: angular.ui.bootstrap.IModalService, private dCtx: IDataCtx, private c: ICommon) {
        this.activate();
    }
    
    private activate(force?: boolean): void {
        const _ = this;
        this.dCtx.faculty.initializeCourses()
            .then(initResponse)
            .catch(initError);

       function initResponse(courses: Array<ecat.entity.ICourse>){
           _.courses = courses;
           const activeCourse = courses[0];
           if (activeCourse.workGroups) {
               _._unwrapGrpFilterables(activeCourse.workGroups);
           }
           _.activeCourse = activeCourse;
       }
       
        //TODO: Need to take of error
        function initError(reason: string) {
            
        }
    }
    
    private changeActiveCourse(course: ecat.entity.ICourse): void {
        let activeCourse = this.activeCourse;
       activeCourse = course;
       
       this.dCtx.faculty
            .activeCourseId = course.id;

        this.dCtx.faculty
            .getActiveCourse()
            .then(getActiveCourseReponse)
            .catch(getActiveCourseError);
       
       function getActiveCourseReponse(crse: ecat.entity.ICourse) {
           activeCourse = crse;
       }
       
       function getActiveCourseError(response: ecat.IQueryError) {
           
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
        //TODO: Check if all work is done, if not error;
    }

    private goToResults(wg: ecat.entity.IWorkGroup): void {

    }

    private refreshInit(): void {
        this.activate(true);
    }
    
    private statusModal($scope: any, $mi: angular.ui.bootstrap.IModalServiceInstance, wg: ecat.entity.IWorkGroup){
        $scope.wgName = (wg.customName) ? `${wg.customName} [${wg.defaultName}]` : wg.defaultName;
        const members = wg.groupMembers as Array<ICrseStudExtended>;
        $scope.close = () => {$mi.close();};

        members.forEach(gm => {

            const isSelfDone = gm.statusOfPeer[gm.studentId].assessComplete;

            const peers = members.filter(mem => mem.studentId !== gm.studentId);

            const peersSpCompletion = peers.map(mem => gm.statusOfPeer[mem.studentId].assessComplete);

            const peersStratCompletion = peers.map(mem => gm.statusOfPeer[mem.studentId].stratComplete);

            let totalMarkings = 0;
            let totalHe = 0;
            let totalE = 0;
            let totalIe = 0;
            let totalNd = 0;

            peers.forEach((mem) => {
                const c = gm.statusOfPeer[mem.studentId].breakout;
                const totalForPeer = c.E + c.HE + c.IE + c.ND;
                totalMarkings += totalForPeer;
                totalE += c.E;
                totalHe += c.HE;
                totalIe += c.IE;
                totalNd += c.ND;
            });

            gm.check = {
                isSelfDone: isSelfDone,
                sp: {
                    isDone: !peersSpCompletion.some(complete => !complete),
                    count: `${peersSpCompletion.filter(complete => complete).length} / ${peersSpCompletion.length}`
                },
                strat: {
                    isDone: !peersStratCompletion.some(complete => !complete),
                    count: `${peersStratCompletion.filter(complete => complete).length} / ${peersStratCompletion.length}`
                }
            }
            gm.aggreg = {
                he: `${(totalHe / totalMarkings * 100).toFixed(2)}%`,
                e: `${(totalE / totalMarkings * 100).toFixed(2)}%`,
                nd: `${(totalNd / totalMarkings * 100).toFixed(2)}%`,
                ie: `${(totalIe / totalMarkings * 100).toFixed(2)}%`,
            }
        });
        $scope.wgMembers = members;
    }
    
    private _unwrapGrpFilterables(groups: Array<ecat.entity.IWorkGroup>): void {
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
            const count = groups.filter(g => g.mpCategory === key).length;
            return {
                key: key,
                count: count
            }
        });
    }

    private viewStatus(wg: ecat.entity.IWorkGroup): void {
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
        this.dCtx.faculty.activeGroupId = wg.id;
        this.dCtx.faculty.getActiveWorkGroup()
        .then(getActiveWgReponse)
        .catch(getActiveWgResponseError);
        
        function getActiveWgReponse(wg:ecat.entity.IWorkGroup) {
            if (wg === null){
                  c.swal(error);
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