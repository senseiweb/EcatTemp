import IDataCtx from 'core/service/data/context'
import ISpTools from 'provider/spTools/sptool'
import ICommon from 'core/common/commonService'
import * as _mp from 'core/common/mapStrings'

export default class EcFacultyWgAssess {
    static controllerId = 'app.faculty.wkgrp.assess';
    static $inject = ['$scope',ICommon.serviceId, IDataCtx.serviceId, ISpTools.serviceId];
    
    private activeWg: ecat.entity.IWorkGroup;
    private isViewOnly = false;
    private groupMembers: Array<ecat.entity.ICrseStudInGroup> = [];
    private log = this.c.getAllLoggers('Faculty Sp Assessment');

    constructor(private $scope, private c: ICommon, private dCtx: IDataCtx, private sptool: ISpTools) {
        $scope.$on('$destroy', ($event) => {
            //TODO: change this to the appropriate event
            c.broadcast(c.coreCfg.coreApp.events.spInvntoryResponseChanged, { event: $event });
        });
        this.activate();
    }
    
    private activate(): void {
        const wgId = this.c.$stateParams.wgId;
        const crseId = this.c.$stateParams.crseId;
        if (!wgId || !crseId) {
            this.log.warn('No active workgroup was selected', null, true);
            return;
        }
        this.dCtx.faculty.activeGroupId = wgId;
        this.dCtx.faculty.activeCourseId = crseId;
        this.dCtx.faculty.getActiveWorkGroup().then((wg: ecat.entity.IWorkGroup) => {
            this.activeWg = wg;

            this.isViewOnly = wg.mpSpStatus === _mp.MpSpStatus.published || wg.mpSpStatus === _mp.MpSpStatus.arch;

            wg.groupMembers.forEach(gm => {
                const hasComment = gm.statusOfStudent.hasComment;
                const assessComplete = gm.statusOfStudent.assessComplete;
                gm['hasChartData'] = gm.statusOfStudent.breakOutChartData.some(cd => cd.data > 0);
                let commentText = '';
                let assessText = '';

                if (this.isViewOnly) {
                    commentText = hasComment ? 'View' : 'Not Available';
                    assessText = assessComplete ? 'View' : 'Not Available';
                } else {
                    commentText = hasComment ? 'Edit' : 'Add';
                    assessText = assessComplete ? 'Edit' : 'Add';
                }
                gm['commentText'] = commentText;
                gm['assessText'] = assessText;
            });
            this.$scope.groupMembers = this.groupMembers = wg.groupMembers;
        });
    }

    //TODO: are any handlers needed for after actions
    private loadAssessment(studentId: number): void {
        if (!studentId) {
            console.log('You must pass a student id to use this feature');
            return null
        }

        this.sptool
            .loadSpAssessment(studentId, this.isViewOnly)
            .then(() => {
                console.log('Assessment Modal Closed');
                if (this.isViewOnly) {
                    return;
                }

                const updatedStudent = this.groupMembers.filter(mem => mem.studentId === studentId)[0];
                updatedStudent.updateStatusOfStudent();
                updatedStudent['hasChartData'] = updatedStudent.statusOfStudent.breakOutChartData.some(cd => cd.data > 0);
                updatedStudent['assessText'] = updatedStudent.statusOfStudent.assessComplete ? 'Edit' : 'Add';

            })
            .catch(() => {
                this.log.error('Assessment Model errored', '', true);
            });
    }

   //TODO: are any handlers needed for after actions
    private loadComment(studentId: number): void {
        if (!studentId) {
            console.log('You must pass a student id to use this feature');
        }

        this.sptool
            .loadSpComment(studentId, this.isViewOnly)
            .then(() => {
                console.log('Comment Modal Closed');
                if (this.isViewOnly) {
                    return;
                }

                const updatedStudent = this.groupMembers.filter(mem => mem.studentId === studentId)[0];
                updatedStudent.updateStatusOfStudent();
                updatedStudent['commentText'] = updatedStudent.statusOfStudent.hasComment ? 'Edit' : 'Add';
            })
            .catch(() => {
                    console.log('Comment model errored');
            });
    }
}