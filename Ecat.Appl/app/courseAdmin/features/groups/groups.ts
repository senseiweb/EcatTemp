import ICommon from 'core/service/common'
import IDataCtx from 'core/service/data/context';

interface ILastMod {
    [groupId: number]: string
}

export default class EcCourseAdminGroups {
    static controllerId = 'app.courseAdmin.features.groups';
    static $inject = [ICommon.serviceId, IDataCtx.serviceId];

    academy: ecat.entity.IAcademy;
    courses: ecat.entity.ICourse[] = [];
    selectedCourse: ecat.entity.ICourse;
    groups: ecat.entity.IWorkGroup[] = [];
    selectedGroup: ecat.entity.IWorkGroup;
    groupTypes: string[] = [];
    lastModifiedBy: ILastMod = {};

    constructor(private uiModal: angular.ui.bootstrap.IModalService, private c: ICommon, private dCtx: IDataCtx) {
        this.activate(false);
    }

    activate(force: boolean): void {
        if (this.dCtx.courseAdmin.selectedCourse === null) {
            this.academy = this.dCtx.courseAdmin.academy;
            this.dCtx.courseAdmin.initializeCourses(force)
                .then((retData: ecat.entity.ICourse[]) => {
                    retData = retData.sort(sortCourses);
                    this.courses = retData;
                    this.selectedCourse = this.courses[0];
                    this.getGroupInfo();
                });
        } else {
            this.selectedCourse = this.dCtx.courseAdmin.selectedCourse;
            this.getGroupInfo();
        }

        function sortCourses(first: ecat.entity.ICourse, second: ecat.entity.ICourse) {
            if (first.startDate < second.startDate) { return 1 }
            if (first.startDate > second.startDate) { return -1 }
            if (first.startDate === second.startDate) { return 0 }
        }
    }

    changeCourse(selectedCourse: ecat.entity.ICourse): void {
        this.selectedCourse = selectedCourse;
        this.dCtx.courseAdmin.selectedCourse = this.selectedCourse;
    }

    pollLMS(view: number): void {
        switch (view) {
            case 0:
                this.dCtx.courseAdmin.pollGroups()
                    .then((retData: ecat.entity.IWorkGroup[]) => {
                        this.groups = retData;
                        this.getGroupInfo();
                    });
                break;
            case 1:
                this.dCtx.courseAdmin.pollGroupMembers()
                    .then((retData: ecat.entity.IWorkGroup) => {
                        this.selectedGroup = retData;
                        this.getGroupInfo();
                    });
        }
    }

    getGroupInfo(): void {
        this.selectedCourse.groups.forEach(grp => {
            var found = this.groupTypes.some(gt => {
                if (gt === grp.mpCategory) { return true; }
            });
            if (!found) { this.groupTypes.push(grp.mpCategory); }

            if (grp.modifiedById !== null || grp.modifiedById !== undefined) {
                var findFac = this.selectedCourse.courseMembers.filter(cm => {
                    if (cm.id === grp.modifiedById) { return true; }
                    return false;
                });
                if (findFac.length > 0) {
                    this.lastModifiedBy[grp.id] = findFac[0].person.lastName + ', ' + findFac[0].person.firstName;
                }
            }
        });
    }

    refreshData(view: number): void {
        switch (view) {
            case 0:
                this.dCtx.courseAdmin.selectedCourse = null;
                this.activate(true);
                break;
            case 1:

        }
    }
}