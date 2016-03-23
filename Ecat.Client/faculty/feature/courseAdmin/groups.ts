﻿import IDataCtx from 'core/service/data/context'
import ICommon from 'core/common/commonService'
import * as _mp from 'core/common/mapStrings'

interface IGrpFilter {
    filterWith?: Array<string>;
    optionList?: Array<{ key: string, count: number }>;
}

interface IGrpCatFilter {
    cat: IGrpFilter;
    status: IGrpFilter;
    name: IGrpFilter;
}

export default class EcCrseAdGrpList {
    static controllerId = 'app.faculty.crseAd.groups';
    static $inject = ['$uibModal', IDataCtx.serviceId, ICommon.serviceId];

    private activeCourse: ecat.entity.ICourse;
    private activeGroup: ecat.entity.IWorkGroup;
    private courses: Array<ecat.entity.ICourse> = [];
    private filters: IGrpCatFilter = {
        cat: { optionList: [], filterWith: [] },
        status: { optionList: [], filterWith: [] },
        name: { optionList: [], filterWith: [] }
    }
    protected sortOpt = {
        status: 'mpSpStatus',
        group: 'mpCategory'
    }
    protected activeSort: { opt: string, desc: boolean } = { opt: 'mpCategory', desc: false };
    protected view = CrseAdGrpsViews.Loading;

    constructor(private $uim: angular.ui.bootstrap.IModalService, private dCtx: IDataCtx, private c: ICommon) {
        this.activate();
    }

    private activate(force?: boolean): void {
        const _ = this;
        this.dCtx.faculty.getCrseEnrolls()
            .then((retData: ecat.entity.ICourse) => {
                initResponse(retData);
                this.view = CrseAdGrpsViews.List;
            })
            .catch(initError);

        function initResponse(course: ecat.entity.ICourse) {
            _.activeCourse = course;
            if (_.activeCourse.workGroups) {
                _._unwrapGrpFilterables(_.activeCourse.workGroups);
            }
            //_.activeCourse = _.activeCourse;
            _.activeCourse.workGroups.forEach(grp => {
                if (grp.modifiedById !== null || grp.modifiedById !== undefined) {
                    var findFac = _.activeCourse.faculty.filter(fac => {
                        if (fac.facultyPersonId === grp.modifiedById) { return true; }
                        return false;
                    });

                    if (findFac.length > 0) {
                        grp['lastModName'] = findFac[0].facultyProfile.person.lastName + ', ' + findFac[0].facultyProfile.person.firstName;
                    }
                }
            });
        }
       
        //TODO: Need to take of error
        function initError(reason: string) {

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

    protected sortList(sortOpt: string): void {
        if (this.activeSort.opt === sortOpt) {
            this.activeSort.desc = !this.activeSort.desc;
            return;
        }

        this.activeSort.opt = sortOpt;
        this.activeSort.desc = true;
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

//import ICommon from 'core/service/common'
//import IDataCtx from 'core/service/data/context';

//interface ILastMod {
//    [groupId: number]: string
//}

//export default class EcCourseAdminGroups {
//    static controllerId = 'app.courseAdmin.features.groups';
//    static $inject = [ICommon.serviceId, IDataCtx.serviceId];

//    academy: ecat.entity.IAcademy;
//    courses: ecat.entity.ICourse[] = [];
//    selectedCourse: ecat.entity.ICourse;
//    groups: ecat.entity.IWorkGroup[] = [];
//    selectedGroup: ecat.entity.IWorkGroup;
//    groupTypes: string[] = [];
//    lastModifiedBy: ILastMod = {};

//    constructor(private uiModal: angular.ui.bootstrap.IModalService, private c: ICommon, private dCtx: IDataCtx) {
//        this.activate(false);
//    }

//    activate(force: boolean): void {
//        if (this.dCtx.courseAdmin.selectedCourse === null) {
//            this.academy = this.dCtx.courseAdmin.academy;
//            this.dCtx.courseAdmin.initializeCourses(force)
//                .then((retData: ecat.entity.ICourse[]) => {
//                    retData = retData.sort(sortCourses);
//                    this.courses = retData;
//                    this.selectedCourse = this.courses[0];
//                    this.getGroupInfo();
//                });
//        } else {
//            this.selectedCourse = this.dCtx.courseAdmin.selectedCourse;
//            this.getGroupInfo();
//        }

//        function sortCourses(first: ecat.entity.ICourse, second: ecat.entity.ICourse) {
//            if (first.startDate < second.startDate) { return 1 }
//            if (first.startDate > second.startDate) { return -1 }
//            if (first.startDate === second.startDate) { return 0 }
//        }
//    }

//    changeCourse(selectedCourse: ecat.entity.ICourse): void {
//        this.selectedCourse = selectedCourse;
//        this.dCtx.courseAdmin.selectedCourse = this.selectedCourse;
//    }

//    pollLMS(view: number): void {
//        switch (view) {
//            case 0:
//                this.dCtx.courseAdmin.pollGroups()
//                    .then((retData: ecat.entity.IWorkGroup[]) => {
//                        this.groups = retData;
//                        this.getGroupInfo();
//                    });
//                break;
//            case 1:
//                this.dCtx.courseAdmin.pollGroupMembers()
//                    .then((retData: ecat.entity.IWorkGroup) => {
//                        this.selectedGroup = retData;
//                        this.getGroupInfo();
//                    });
//        }
//    }

//    getGroupInfo(): void {
//        this.selectedCourse.groups.forEach(grp => {
//            var found = this.groupTypes.some(gt => {
//                if (gt === grp.mpCategory) { return true; }
//            });
//            if (!found) { this.groupTypes.push(grp.mpCategory); }

//            if (grp.modifiedById !== null || grp.modifiedById !== undefined) {
//                var findFac = this.selectedCourse.courseMembers.filter(cm => {
//                    if (cm.id === grp.modifiedById) { return true; }
//                    return false;
//                });
//                if (findFac.length > 0) {
//                    this.lastModifiedBy[grp.id] = findFac[0].person.lastName + ', ' + findFac[0].person.firstName;
//                }
//            }
//        });
//    }

//    refreshData(view: number): void {
//        switch (view) {
//            case 0:
//                this.dCtx.courseAdmin.selectedCourse = null;
//                this.activate(true);
//                break;
//            case 1:

//        }
//    }
//}