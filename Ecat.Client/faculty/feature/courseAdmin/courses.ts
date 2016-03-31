import IDataCtx from 'core/service/data/context'
import ICommon from 'core/common/commonService'
import * as _mp from 'core/common/mapStrings'
import _moment from "moment"
import _swal from "sweetalert"

export default class EcCrseAdCrseList {
    static controllerId = 'app.faculty.crseAd.courses';
    static $inject = ['$uibModal', IDataCtx.serviceId, ICommon.serviceId];

    protected activeView = CrseAdCrsesViews.Loading;
    private courses: Array<ecat.entity.ICourse> = [];
    protected editCourseController: Function;
    private faculty: Array<ecat.entity.s.school.FacultyInCourse> = [];
    private filters: ICrseCatFilter = {
        cat: { optionList: [], filterWith: [] },
        status: { optionList: [], filterWith: [] },
        name: { optionList: [], filterWith: [] }
    }
    private selectedCourse: ecat.entity.ICourse;
    private members: Array<ecat.entity.IPerson> = [];
    protected view = {
        list: CrseAdCrsesViews.List,
        enroll: CrseAdCrsesViews.Enroll,
        instructors: CrseAdCrsesViews.Instructors
    }

    constructor(private $uim: angular.ui.bootstrap.IModalService, private dCtx: IDataCtx, private c: ICommon) {
        this.activate();
    }

    private activate(force?: boolean): void {
        const that = this;
        this.dCtx.lmsAdmin.fetchAllCourses(force)
            .then((courses: Array<ecat.entity.ICourse>) => {
                this.courses = courses;
                this.activeView = CrseAdCrsesViews.List;
            })
            .catch(initError);

        //TODO: Need to take of error
        function initError(reason: string) {

        }
    }

    private editInfo(course: ecat.entity.ICourse): void {
        const that = this;
        this.selectedCourse = course;

        this.editCourseController = function ($mi: angular.ui.bootstrap.IModalServiceInstance) {
            const today = new Date();
            
            this.startDateOptions = {
                formatYear: 'yy',
                maxDate: today.setDate(today.getDate() + 365),
                minDate: today,
                startingDay: 1
            };

            this.endDateOptions = {
                formatYear: 'yy',
                maxDate: new Date().setDate(course.startDate.getDate() + 365),
                minDate: course.startDate,
                startingDay: 1
            };

            this.course = course;
            this.cancel = () => {
                course.entityAspect.rejectChanges();
                $mi.close();
            }
            this.save = () => that.save()
                .then(() => {
                    $mi.close();
                }).catch(() => {

                });
        }

        const modalSettings: angular.ui.bootstrap.IModalSettings = {
            controller: ['$uibModalInstance', this.editCourseController],
            controllerAs: 'eci',
            backdrop: 'static',
            keyboard: true,
            templateUrl: '@[appFaculty]/feature/courseAdmin/courses.editModal.html'
        }

        this.$uim.open(modalSettings);
    }

    protected formatDate(date: Date): string {
        return _moment(date).format('DD-MMM-YY');
    }

    protected goToRoll(course: ecat.entity.ICourse): void {
        const that = this;
        this.selectedCourse = course;
        this.dCtx.lmsAdmin.fetchAllCourseMembers(course.id)
            .then(fetchCourseMemberResponse)
            .catch(fetchCourseMemberError);

        function fetchCourseMemberResponse() {
            that.processMembers(course);
            that.activeView = that.view.enroll;
        }

        //TODO: Need to write an error handler
        function fetchCourseMemberError(reason: string) {

        }
    }

    private goToWrkGrp(course: ecat.entity.ICourse) {
        this.selectedCourse = course;
        this.c.$state.go(this.c.stateMgr.faculty.crseAdGrps.name, { crseId: course.id });
    }

    private publishGradRpt(course: ecat.entity.ICourse): void {
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

        var nonPub: boolean;
        if (course.workGroups.length === 0) { nonPub = true; } else {
            nonPub = course.workGroups.some(grp => {
                if (grp.mpSpStatus !== _mp.MpSpStatus.published) { return true; }
            });
        }

        if (nonPub) {
            alertSettings.title = 'Unpublished Groups';
            alertSettings.text = 'Grad Report cannot be published until all Workgroups in this course have been Published';
            alertSettings.type = 'error';
            alertSettings.showCancelButton = false;
            alertSettings.confirmButtonText = 'OK';
        }

        function afterConfirmClose(confirmed: boolean) {
            if (!confirmed || nonPub) { return; }
            self.selectedCourse.gradReportPublished = true;
            this.save();
        }

        this.c.swal(alertSettings, afterConfirmClose);
    }

    protected poll(): void {
        switch (this.activeView) {
            case this.view.list:
                this.pollLmsCourses();
                break;
            case this.view.enroll:
                this.pollCourseEnroll();
                break;
        }
    }

    private pollLmsCourses(): void {
        const that = this;

        this.dCtx.lmsAdmin.pollCourses()
            .then(pollLmsCourseResponse)
            .catch(pollLmsCourseError);

        function pollLmsCourseResponse(reconResult: ecat.entity.ICourseRecon) {
            const alertSettings: SweetAlert.Settings = {
                title: 'Polling Complete!',
                text: `Added ${reconResult.courses.length} courses to your academy \n <ul>`,
                type: _mp.MpSweetAlertType.success,
                html: true
            }

            if (reconResult.courses && reconResult.courses.length > 0) {
                reconResult.courses.forEach(course => {
                    alertSettings.text += `<li>${course.name}</li>`;
                });
                alertSettings.text += '</ul>';
                that.courses = that.dCtx.lmsAdmin.getAllCourses();
            } else {
                alertSettings.text = 'No Changes Detected';
            }
            _swal(alertSettings);
        }

        //TODO: Need to add error handlers
        function pollLmsCourseError(reason: string) {
            
        }
    }

    private pollCourseEnroll(): void {
        const that = this;

        this.dCtx.lmsAdmin.pollCourseMembers(this.selectedCourse.id)
            .then(pollLmsCourseEnrollResponse)
            .catch(pollLmsCourseError);

        function pollLmsCourseEnrollResponse(reconResult: ecat.entity.IMemRecon) {
            const alertSettings: SweetAlert.Settings = {
                title: 'Polling Complete!',
                text: `The following memberships changes were made to course: ${that.selectedCourse.name}<br/><br/><hr/>
                       Accounts Created: ${reconResult.numOfAccountCreated} <br/> Accounts Added ${reconResult.numAdded}<br/> Accounts Removed ${reconResult.numRemoved}`,
                type: _mp.MpSweetAlertType.success,
                html: true
            }

            if (reconResult.numAdded === 0 && reconResult.numRemoved === 0) {
                alertSettings.text = 'No Changes Detected';
            }

            _swal(alertSettings);
             that.dCtx.lmsAdmin.fetchAllCourseMembers(that.selectedCourse.id)
                 .then((course: ecat.entity.ICourse) => that.processMembers(course));
        }

        //TODO: Need to add error handlers
        function pollLmsCourseError(reason: string) {

        }
    }

    private processMembers(course: ecat.entity.ICourse): void {
        const faculty = course.faculty.map(fic => {
            const me = fic.facultyProfile.person;
            const removeIds = fic.reconResult ? fic.reconResult.removedIds : null;
            me['role'] = 'Instructor';
            let status = 'Uncahanged';
            if (fic.reconResult) status = 'Added';
            if (removeIds && removeIds.some(id => id === fic.facultyPersonId)) status = 'Removed';
            me['status'] = status;
            return me;
        });

       const students = course.students.map(sic => {
            const me = sic.student.person;
            const removeIds = sic.reconResult ? sic.reconResult.removedIds : null;
            me['role'] = 'Student';
            let status = 'Uncahanged';
            if (sic.reconResult) status = 'Added';
            if (removeIds && removeIds.some(id => id === sic.studentPersonId)) status = 'Removed';
            me['status'] = status;
            return me;
        });
        this.members = faculty.concat(students);
    }

    private refreshData(): void {
        this.activate(true);
    }

    private save(): angular.IPromise<any> {
        const that = this;
        return this.dCtx.lmsAdmin.saveChanges()
            .then(saveReturn)
            .catch(saveRejected);
        
        //TODO: add save success notification
        function saveReturn(ret: breeze.SaveResult): void {
         
        }

        //TODO: add save error notification
        function saveRejected(reason: any): void {
            if (reason) {

            }
        }
    }
}

interface ICrseFilter {
    filterWith?: Array<string>;
    optionList?: Array<{ key: string, count: number }>;
}

interface ICrseCatFilter {
    cat: ICrseFilter;
    status: ICrseFilter;
    name: ICrseFilter;
}

const enum CrseAdCrsesViews {
    Loading,
    List,
    Enroll,
    Instructors
}