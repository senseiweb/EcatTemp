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
                gm.getFacSpStatus();
                const hasComment = gm.statusOfStudent.hasComment;
                const assessComplete = gm.statusOfStudent.assessComplete;
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
        this.sptool
            .loadSpAssessment(studentId, this.isViewOnly)
            .then(() => { })
            .catch((error) => console.log(error));
    }

   //TODO: are any handlers needed for after actions
    private loadComment(studentId: number): void {
        this.sptool
            .loadSpComment(studentId, this.isViewOnly)
            .then(() => { })
            .catch((error) => console.log(error));
    }
}