import ICommon from 'core/service/common'
import IDataCtx from 'core/service/data/context';

export default class EcCourseAdminCourses {
    static controllerId = 'app.courseAdmin.features.courses';
    static $inject = [ICommon.serviceId, IDataCtx.serviceId];

    //academy: ecat.entity.IAcademy;
    //courses: ecat.entity.ICourse[] = [];
    //courseMembers: ecat.entity.ICourseMember[] = [];
    academy;
    courses;
    courseMembers;

    constructor(private uiModal: angular.ui.bootstrap.IModalService, private c: ICommon, private dCtx: IDataCtx) {
        console.log('Course Admin Courses Loaded');
        this.activate();
    }

    activate(): void {
        //this.academy = this.dCtx.user.persona.

        this.academy = {
            id: 1,
            Name: 'KENCOA',
        }

        this.courses = [{
                id: 1,
                Name: 'ILE',
                ClassNumber: '16-1',
                StartDate: new Date('1/1/2016'),
                GradDate: new Date('2/1/2016')
            }, {
                id: 2,
                Name: 'ILE',
                ClassNumber: '16-2',
                StartDate: new Date('2/1/2016'),
                GradDate: new Date('3/1/2016')
            }, {
                id: 3,
                Name: 'ILE',
                ClassNumber: '16-3',
                StartDate: new Date('3/1/2016'),
                GradDate: new Date('4/1/2016')
            }, {
                id: 4,
                Name: 'ILE',
                ClassNumber: '16-4',
                StartDate: new Date('4/1/2016'),
                GradDate: new Date('5/1/2016')
            }
        ]
    }

    goToGroups(course: ecat.entity.ICourse) {
        this.dCtx.courseAdmin.selectedCourse = course;
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