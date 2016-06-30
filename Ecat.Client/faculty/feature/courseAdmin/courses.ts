import IDataCtx from 'core/service/data/context'
import ICommon from 'core/common/commonService'
import * as _mp from 'core/common/mapStrings'
import _moment from "moment"
import _swal from "sweetalert"

export default class EcCrseAdCrseList {
    static controllerId = 'app.faculty.crseAd.courses';
    static $inject = ['$uibModal', '$scope', IDataCtx.serviceId, ICommon.serviceId];

    protected activeView = CrseAdCrsesViews.Loading;
    private courses: Array<ecat.entity.ICourse> = [];
    protected editCourseController: Function;
    private faculty: Array<ecat.entity.s.school.FacultyInCourse> = [];
    private filters: ICrseCatFilter = {
        role: { optionList: [], filterWith: [] },
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
    protected currentPage: number;
    private pagedMembers: Array<ecat.entity.IPerson> = [];
    private filteredMembers: Array<ecat.entity.IPerson> = [];

    constructor(private $uim: angular.ui.bootstrap.IModalService, private $scope: angular.IScope, private dCtx: IDataCtx, private c: ICommon) {
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
            that.currentPage = 1;
            that.pagedMembers = that.filteredMembers.slice(0, 25);
            that.$scope.$watch('cac.currentPage', () => {
                let begin = ((that.currentPage - 1) * 25);
                let end = begin + 25;

                that.pagedMembers = that.filteredMembers.slice(begin, end);
            });
            that.activeView = that.view.enroll;
        }

        //TODO: Need to write an error handler
        function fetchCourseMemberError(reason: string) {

        }
    }

    //private filter(): void {
    //    let filterName = [];
    //    let filterRole = [];
    //    let filterStatus = [];
    //    this.filteredMembers = [];

    //    if (this.filters.name.filterWith.length === 0 && this.filters.role.filterWith.length === 0 && this.filters.status.filterWith.length === 0) {
    //        this.filteredMembers = this.members;
    //        return null;
    //    }

    //    if (this.filters.name.filterWith.length > 0) {
    //        filterName = this.members.filter(mem => {
    //            if (this.filters.name.filterWith.some(name => mem.lastName === name)) { return true; }
    //            return false;
    //        });
    //    }

    //    if (this.filters.role.filterWith.length > 0) {
    //        filterRole = this.members.filter(mem => {
    //            if (this.filters.role.filterWith.some(role => mem['role'] === role)) { return true; }
    //            return false;
    //        });

    //        if (this.filteredMembers.length > 0) {
    //            this.filteredMembers = filterRole.filter(mem => {
    //                if (this.filters.name.filterWith.some(name => mem.lastName === name)) { return true; }
    //                return false;
    //            });
    //        } else { this.filteredMembers = filterRole; }
    //    }

    //    if (this.filters.status.filterWith.length > 0) {
    //        filterStatus = this.members.filter(mem => {
    //            if (this.filters.status.filterWith.some(status => mem['status'] === status)) { return true; }
    //            return false;
    //        });

    //        if (filterName.length > 0 && filterRole.length > 0) {
    //            this.filteredMembers = filterStatus.filter(mem => {
    //                if (this.filters.name.filterWith.some(name => mem.lastName === name)) {
    //                    if (this.filters.role.filterWith.some(role => mem['role'] === role)) { return true; }
    //                }
    //                return false;
    //            });
    //        } else if (filterName.length > 0 && filterRole.length === 0) {
    //            this.filteredMembers = filterStatus.filter(mem => {
    //                if (this.filters.name.filterWith.some(name => mem.lastName === name)) {return true;}
    //                return false;
    //            });
    //        } else if (filterName.length === 0 && filterRole.length > 0) {
    //            this.filteredMembers = filterStatus.filter(mem => {
    //                if (this.filters.role.filterWith.some(role => mem['role'] === role)) { return true; }
    //                return false;
    //            });
    //        } else { this.filteredMembers = filterRole; }
    //    }
    //}

    private filteredMemRole = (item: ecat.entity.IPerson) => {

        return this.filters.role.filterWith.length === 0 || this.filters.role.filterWith.some(e => item['role'] === e);
    }

    private filteredMemName = (item: ecat.entity.IPerson) => {

        return this.filters.name.filterWith.length === 0 || this.filters.name.filterWith.some(e => item.lastName === e);
    }

    private filteredMemStatus = (item: ecat.entity.IPerson) => {

        return this.filters.status.filterWith.length === 0 || this.filters.status.filterWith.some(e => item['status'] === e);
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

        faculty.sort((a: ecat.entity.IPerson, b: ecat.entity.IPerson) => {
            if (a.lastName < b.lastName) { return -1 }
            if (a.lastName > b.lastName) { return 1 }
            if (a.firstName < b.firstName) { return -1 }
            if (a.firstName > b.firstName) { return 1 }
            return 0;
        });

       const students = course.students.map(sic => {
            const me = sic.student.person;
            const removeIds = sic.reconResult ? sic.reconResult.removedIds : null;
            me['role'] = 'Student';
            let studStatus = 'Uncahanged';
            if (sic.reconResult) studStatus = 'Added';
            if (removeIds && removeIds.some(id => id === sic.studentPersonId)) studStatus = 'Removed';
            me['status'] = studStatus;
            return me;
        });

       students.sort((a: ecat.entity.IPerson, b: ecat.entity.IPerson) => {
           if (a.lastName < b.lastName) { return -1 }
           if (a.lastName > b.lastName) { return 1 }
           if (a.firstName < b.firstName) { return -1 }
           if (a.firstName > b.firstName) { return 1 }
           return 0;
       });

       this.members = faculty.concat(students);
       this.filteredMembers = this.members;
       this.currentPage = 1;

       const role = {};
       const name = {};
       const status = {};

       this.members.forEach((mem, i, array) => {
           role[mem['role']] = null;
           name[mem.lastName] = null;
           status[mem['status']] = null;
       });

       const uniqueCatKeys = Object.keys(role).sort();
       const uniqueNameKeys = Object.keys(name)
           .sort((a: any, b: any) => a - b)
           .map(n => `${n}`);

       const uniqueStatusKeys = Object.keys(status).sort();

       this.filters.role.optionList = uniqueCatKeys.map(key => {
           const count = this.members.filter(g => g['role'] === key).length;
           return {
               key: key,
               count: count
           }
       });

       this.filters.name.optionList = uniqueNameKeys.map(key => {
           const count = this.members.filter(g => g.lastName === key).length;
           return {
               key: key,
               count: count
           }
       });

       this.filters.status.optionList = uniqueStatusKeys.map(key => {
           const count = this.members.filter(g => g['status'] === key).length;
           return {
               key: key,
               count: count
           }
       });
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
    role: ICrseFilter;
    status: ICrseFilter;
    name: ICrseFilter;
}

const enum CrseAdCrsesViews {
    Loading,
    List,
    Enroll,
    Instructors
}