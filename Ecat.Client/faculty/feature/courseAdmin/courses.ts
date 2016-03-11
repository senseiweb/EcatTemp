import IDataCtx from 'core/service/data/context'
import ICommon from 'core/common/commonService'
import * as _mp from 'core/common/mapStrings'

interface ICrseFilter {
    filterWith?: Array<string>;
    optionList?: Array<{ key: string, count: number }>;
}

interface ICrseCatFilter {
    cat: ICrseFilter;
    status: ICrseFilter;
    name: ICrseFilter;
}

export default class EcCrseAdCrseList {
    static controllerId = 'app.faculty.crseAd.courses';
    static $inject = ['$uibModal', IDataCtx.serviceId, ICommon.serviceId];

    private selectedCourse: ecat.entity.ICourse;
    private courses: Array<ecat.entity.ICourse> = [];
    private faculty: Array<ecat.entity.s.school.FacultyInCourse> = [];
    private students: Array<ecat.entity.s.school.StudentInCourse> = [];
    private filters: ICrseCatFilter = {
        cat: { optionList: [], filterWith: [] },
        status: { optionList: [], filterWith: [] },
        name: { optionList: [], filterWith: [] }
    }
    protected view = CrseAdCrsesViews.Loading;

    constructor(private $uim: angular.ui.bootstrap.IModalService, private dCtx: IDataCtx, private c: ICommon) {
        this.activate();
    }

    private activate(force?: boolean): void {
        const _ = this;
        this.dCtx.faculty.initializeCourses()
            .then((retData: Array<ecat.entity.ICourse>) => {
                //retData = retData.sort((first: ecat.entity.ICourse, second: ecat.entity.ICourse) => this.sortCourses(first, second));
                this.courses = retData;
                this.view = CrseAdCrsesViews.List;
            })
            .catch(initError);

        //function initResponse(courses: Array<ecat.entity.ICourse>) {
        //    _.courses = courses;
        //    const activeCourse = courses[0];
        //    if (activeCourse.workGroups) {
        //        _._unwrapCrseFilterables(activeCourse.workGroups);
        //    }
        //    _.selectedCourse = activeCourse;
        //}
       
        //TODO: Need to take of error
        function initError(reason: string) {

        }
    }

    //private filteredGrpCat = (item: ecat.entity.ICourse) => {

    //    return this.filters.cat.filterWith.length === 0 || this.filters.cat.filterWith.some(e => item.gradReportPublished === e);
    //}

    //private filteredGrpFlight = (item: ecat.entity.IWorkGroup) => {

    //    return this.filters.name.filterWith.length === 0 || this.filters.name.filterWith.some(e => item.defaultName === e);
    //}

    //private filteredGrpStatus = (item: ecat.entity.IWorkGroup) => {

    //    return this.filters.status.filterWith.length === 0 || this.filters.status.filterWith.some(e => item.mpSpStatus === e);
    //}

    private selectCourse(course: ecat.entity.ICourse) {
        this.selectedCourse = course;
        this.faculty = this.selectedCourse.faculty;
        this.students = this.selectedCourse.studentsInCourse;
    }

    private goToGroups(course: ecat.entity.ICourse) {
        this.selectedCourse = course;
        this.dCtx.courseAdmin.selectedCourse = this.selectedCourse;
    }

    private editInfo(course: ecat.entity.ICourse): void {
        this.selectedCourse = course;

        const modalSettings: angular.ui.bootstrap.IModalSettings = {
            controller: ['$scope', '$uibModalInstance', 'crse', 'origName'],
            backdrop: 'static',
            keyboard: true,
            templateUrl: '@[appFaculty]/feature/courseAdmin/courses.edit.html'
        }

        const modal = this.$uim;
        const c = this.c;
        this.selectedCourse = course;
        modalSettings.resolve = { crse: this.selectedCourse, origName: this.selectedCourse.name };
        modal.open(modalSettings);
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

        function afterConfirmClose(confirmed: boolean) {
            if (!confirmed) { return; }
            self.selectedCourse.gradReportPublished = true;
            this.save();
        }

        this.c.swal(alertSettings, afterConfirmClose);
    }

    private pollLMS(view: number): void {
        switch (view) {
            case 1:
                this.dCtx.courseAdmin.pollCourses()
                    .then((retData: ecat.entity.ICourse[]) => {
                        retData = retData.sort((first: ecat.entity.ICourse, second: ecat.entity.ICourse) => this.sortCourses(first, second))
                        this.courses = retData;
                    });
            case 2 || 3:
                this.dCtx.courseAdmin.pollCourseMembers()
                    .then((retData: ecat.entity.ICourse) => {
                        this.selectCourse(retData);
                    });
        }
    }

    //private sortCourses(first: ecat.entity.ICourse, second: ecat.entity.ICourse) {
    //    if (first.startDate === undefined || first.startDate === null) { return -1 }
    //    if (first.startDate < second.startDate) { return 1 }
    //    if (first.startDate > second.startDate) { return -1 }
    //    if (first.startDate === second.startDate) { return 0 }
    //}

    private refreshData(): void {
        this.activate(true);
    }

    private save(): void {
        const self = this;
        this.dCtx.faculty.saveChanges()
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

const enum CrseAdCrsesViews {
    Loading,
    List,
    Students,
    Instructors
}