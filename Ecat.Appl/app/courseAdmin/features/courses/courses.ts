import ICommon from 'core/service/common'
import IDataCtx from 'core/service/data/context';
import * as appVars from 'appVars'

export default class EcCourseAdminCourses {
    static controllerId = 'app.courseAdmin.features.courses';
    static $inject = [ICommon.serviceId, IDataCtx.serviceId];

    academy: ecat.entity.IAcademy;
    courses: ecat.entity.ICourse[] = [];
    selectedCourse: ecat.entity.ICourse;
    facilitators: ecat.entity.ICourseMember[] = [];
    students: ecat.entity.ICourseMember[] = [];

    constructor(private uiModal: angular.ui.bootstrap.IModalService, private c: ICommon, private dCtx: IDataCtx) {
        this.activate(false);
    }

    activate(force: boolean): void {
        this.academy = this.dCtx.courseAdmin.academy;
        this.dCtx.courseAdmin.initializeCourses(force)
            .then((retData: ecat.entity.ICourse[]) => {
                retData = retData.sort(this.sortCourses);
                this.courses = retData;
            });
    }

    selectCourse(course: ecat.entity.ICourse) {
        this.selectedCourse = course;
        this.selectedCourse.courseMembers.forEach(cm => {
            if (cm.mpCourseRole === 'facilitator') {//appVars.){
                this.facilitators.push(cm);
            } else if (cm.mpCourseRole === 'student') {
                this.students.push(cm);
            }
        });
    }

    goToGroups(course: ecat.entity.ICourse) {
        this.selectedCourse = course;
        this.dCtx.courseAdmin.selectedCourse = this.selectedCourse;
    }

    publishGradRpt(course: ecat.entity.ICourse): void {
        const self = this;
        const alertSettings: SweetAlert.Settings = {
            title: 'Publish Grad Report',
            text: 'Are you sure you want to make the Capstone Report available to all instructors?',
            type: 'warning',
            confirmButtonText: 'Publish',
            closeOnConfirm: true,
            allowEscapeKey: true,
            allowOutsideClick: true,
            showCancelButton: true
        }

        function afterConfirmClose(confirmed: boolean) {
            if (!confirmed) { return; }
            self.selectedCourse.gradReportPublished = true;
            this.save();
        }

        this.c.swal(alertSettings, afterConfirmClose);
    }

    pollLMS(view: number): void {
        switch (view) {
            case 0:
                this.dCtx.courseAdmin.pollCourses()
                    .then((retData: ecat.entity.ICourse[]) => {
                        retData = retData.sort(this.sortCourses);
                        this.courses = retData;
                    });
            case 1:
                this.dCtx.courseAdmin.pollCourseMembers()
                    .then((retData: ecat.entity.ICourse) => {
                        this.selectCourse(retData);
                    });
        }
    }

    sortCourses(first: ecat.entity.ICourse, second: ecat.entity.ICourse) {
        if (first.startDate < second.startDate) { return 1 }
        if (first.startDate > second.startDate) { return -1 }
        if (first.startDate === second.startDate) { return 0 }
    }

    refreshData(): void {
        this.activate(true);
    }

    save(): void {
        const self = this;
        this.dCtx.facilitator.saveChanges()
            .then(saveReturn)
            .catch(saveRejected);

        function saveReturn(ret: breeze.SaveResult): void {

        }

        function saveRejected(reason: any): void {
            if (reason) {

            }
        }
    }
}