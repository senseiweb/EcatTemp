import ICommon from 'core/service/common'
import IDataCtx from 'core/service/data/context';

export default class EcCourseAdminCourses {
    static controllerId = 'app.courseAdmin.features.courses';
    static $inject = [ICommon.serviceId, IDataCtx.serviceId];

    courseMembers: ecat.entity.ICourseMember[] = [];

    constructor(private uiModal: angular.ui.bootstrap.IModalService, private c: ICommon, private dCtx: IDataCtx) {
        console.log('Course Admin Courses Loaded');
        this.activate();
    }

    activate(): void {
        
    }

    goToGroups(course: ecat.entity.ICourse) {
        //this.dCtx.courseAdmin.selectedCourse = course;
    }

    publishGradRpt(course: ecat.entity.ICourse): void {
        const alertSettings: SweetAlert.Settings = {
            title: 'Publish Grad Report',
            text: 'Are you sure you want to make the Graduation Report available to all instructors?',
            type: 'warning',
            confirmButtonText: 'Publish',
            closeOnConfirm: true,
            allowEscapeKey: true,
            allowOutsideClick: true,
            showCancelButton: true
        }

        function afterConfirmClose(confirmed: boolean) {
            if (!confirmed) {
                return;
            }
            
        }

        this.c.swal(alertSettings, afterConfirmClose);
    }

    pollCourses(): void {
        
    }

    pollEnrollments(): void {
        
    }
}