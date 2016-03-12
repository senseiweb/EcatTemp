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
        this.dCtx.faculty.activeCourseId = course.id;
        this.dCtx.faculty.getCrseEnrolls()
            .then((course: ecat.entity.ICourse) => {
                this.selectedCourse = course;
                this.faculty = this.selectedCourse.faculty;
                this.students = this.selectedCourse.studentsInCourse;
            });
    }

    private goToGroups(course: ecat.entity.ICourse) {
        this.selectedCourse = course;
        this.dCtx.faculty.activeCourseId = this.selectedCourse.id;
    }

    private editInfo(course: ecat.entity.ICourse): void {
        this.dCtx.faculty.activeCourseId = course.id;
        this.selectedCourse = course;

        const modalSettings: angular.ui.bootstrap.IModalSettings = {
            controller: ['$scope', '$uibModalInstance', 'crse', 'origName', 'dateOpts', this.editModal],
            backdrop: 'static',
            keyboard: true,
            templateUrl: '@[appFaculty]/feature/courseAdmin/courses.edit.html'
        }

        const modal = this.$uim;
        const c = this.c;
        const dateOptions = {
            //dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1
        }
        modalSettings.resolve = { crse: () => this.selectedCourse, origName: () => this.selectedCourse.name, dateOpts: () => dateOptions };
        modal.open(modalSettings);
    }

    private editModal($scope: any, $mi: angular.ui.bootstrap.IModalServiceInstance, crse: ecat.entity.ICourse, origName: string, dateOpts: any) {
        $scope.origName = origName;
        $scope.crse = crse;
        $scope.startPick = { opened: false };
        $scope.gradPick = { opened: false };
        $scope.cancel = () => { crse.entityAspect.rejectChanges(); $mi.dismiss('cancelled'); };
        $scope.save = () => { this.save(); $mi.close(); };
        $scope.openStart = () => { $scope.startPick.opened = true; };
        $scope.openGrad = () => { $scope.gradPick.opened = true; };
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

    private pollLMS(view: number): void {
        switch (view) {
            case 1:
                this.dCtx.courseAdmin.pollCourses()
                    .then((retData: ecat.entity.ICourse[]) => {
                        this.courses = retData;
                    });
            case 2 || 3:
                this.dCtx.courseAdmin.pollCourseMembers()
                    .then((retData: ecat.entity.ICourse) => {
                        this.selectCourse(retData);
                    });
        }
    }

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