import IDataCtx from 'core/service/data/context'
import ICommon from 'core/common/commonService'
import * as _mp from 'core/common/mapStrings'

export default class EcFacultyWgResult {
    static controllerId = 'app.faculty.wkgrp.result';
    static $inject = [IDataCtx.serviceId, ICommon.serviceId];

    private activeWg: ecat.entity.IWorkGroup;
    private activeStudResult: ecat.entity.ICrseStudInGroup;
    protected commentPerspective: string;
    private groupMembers: Array<ecat.entity.ICrseStudInGroup>;
    protected hasComments = false;
    private log = this.c.getAllLoggers('Faculty Wg Result');
    protected wgResults: Array<ecat.entity.ICrseStudInGroup>;
    private routingParams = { crseId: 0, wgId: 0 };
    protected selectedComment: IResultComment;
    private studentComments: Array<IResultComment>;
    protected viewState = WgResViews.Loading;
    protected recXTicks = [];
    protected givXTicks = [];
    protected yTicks = [];

    constructor(private dCtx: IDataCtx, private c: ICommon) {
        this.routingParams.wgId = this.c.$stateParams.wgId;
        this.routingParams.crseId = this.c.$stateParams.crseId;
        this.activate();
    }

    private activate(): void {

        const that = this;
        if (!this.routingParams.wgId || !this.routingParams.crseId) {
            this.log.error('The required course ID and/or workgroup ID is missing. Try workgroup result option on the workgroup list screen', null, true);
            this.c.$state.go(this.c.stateMgr.faculty.wgList.name);
            return null;
        }

        this.dCtx.faculty.activeCourseId = this.routingParams.crseId;
        this.dCtx.faculty.activeGroupId = this.routingParams.wgId;
     
        this.dCtx.faculty.fetchActiveWgSpResults()
            .then(activateResponse);

        function activateResponse(groupMembers: Array<ecat.entity.ICrseStudInGroup>) {
            that.activeWg = groupMembers[0].workGroup;
            that.viewState = WgResViews.List;
            if (that.activeWg.mpSpStatus !== _mp.MpSpStatus.published) {
                that.c.$state.go(that.c.stateMgr.faculty.wgList.name);
                return null;
            }

            groupMembers.forEach(gm => {
                gm['hasReceivedChartData'] = gm.resultForStudent.breakOutReceived.some(cd => cd.data > 0);
                gm['hasGivenChartData'] = gm.statusOfStudent.gaveBreakOutChartData.some(cd => cd.data > 0);
            });          

            that.wgResults = groupMembers;
            that.wgResults = that.wgResults.sort(that.sortByLastName);
            that.activeStudResult = that.wgResults[0];

            that.activeStudResult.workGroup.assignedSpInstr.inventoryCollection.forEach(inv => {
                inv['needsEllipse'] = inv.behavior.length <= 50;
            });

            that.commentPerspective = 'Author';
        }
    }

    protected changeCommentView(view: string): void {
        if (view === 'Author') {
            this.commentPerspective = 'Author';
            this.studentComments = this.activeStudResult
                .authorOfComments
                .map(comment => ({
                    studentId: comment.recipientPersonId,
                    nameSorter: comment.recipient.nameSorter,
                    initials: `${comment.recipient.studentProfile.person.firstName.charAt(0)}${comment.recipient.studentProfile.person.lastName.charAt(0)}`,
                    rankName: comment.recipient.rankName,
                    commentType: comment.requestAnonymity ? 'Anonymous' : 'Signed',
                    commentText: comment.commentText,
                    isAppr: comment.flag.mpFaculty === _mp.MpCommentFlag.appr,
                }))
                .sort(this.sortsComment);
            this.selectedComment = this.studentComments[0];
            return null;
        }

        this.commentPerspective = 'Recipient';
        const comments = this.activeStudResult
            .recipientOfComments
            .map(comment => ({
                studentId: comment.authorPersonId,
                nameSorter: comment.author.nameSorter,
                initials: `${comment.author.nameSorter.last.charAt(0)}${comment.author.nameSorter.first.charAt(0)}`,
                rankName: comment.author.rankName,
                commentType: comment.requestAnonymity ? 'Anonymous' : 'Signed',
                commentText: comment.commentText,
                isAppr: comment.flag.mpFaculty === _mp.MpCommentFlag.appr
            }))
            .sort(this.sortsComment);

        if (!this.activeStudResult.facultyComment) {
            this.studentComments = comments.sort(this.sortsComment);
            this.selectedComment = this.studentComments[0];
            return null;
        }

        comments.push({
            studentId: this.activeStudResult.facultyComment.facultyPersonId,
            nameSorter: {
                last: this.activeStudResult.facultyComment.facultyCourse.facultyProfile.person.lastName,
                first: this.activeStudResult.facultyComment.facultyCourse.facultyProfile.person.firstName
            },
            initials: `${this.activeStudResult.facultyComment.facultyCourse.facultyProfile.person.lastName.charAt(0)}${this.activeStudResult.facultyComment.facultyCourse.facultyProfile.person.firstName.charAt(0)}`,
            rankName: 'Faculty',
            commentType: 'Faculty',
            commentText: this.activeStudResult.facultyComment.commentText,
            isAppr: true
        });
        this.studentComments = comments.sort(this.sortsComment);
        this.selectedComment = this.studentComments[0];
        return null;
    }

    protected selectComment(comment: IResultComment): void {
        this.selectedComment = comment;
    }

    private sortByLastName(studentA: ecat.entity.ICrseStudInGroup, studentB: ecat.entity.ICrseStudInGroup) {
        if (studentA.nameSorter.last < studentB.nameSorter.last) return -1;
        if (studentA.nameSorter.last > studentB.nameSorter.last) return 1;
        return 0;
    }

    private sortsComment(studentA: IResultComment, studentB: IResultComment) {
        if (studentA.nameSorter.last < studentB.nameSorter.last) return -1;
        if (studentA.nameSorter.last > studentB.nameSorter.last) return 1;
        if (studentA.nameSorter.last === studentB.nameSorter.last) {
            if (studentA.nameSorter.first < studentB.nameSorter.first) return -1;
            if (studentA.nameSorter.first > studentB.nameSorter.first) return 1;
        }
        return 0;
    }

    protected switchTo(state: string) {
        switch (state) {

        case 'list':
            this.viewState = WgResViews.List;
            break;

        case 'behavior':
            this.viewState = WgResViews.Behavior;
            break;

        case 'comment':
            this.hasComments = this.activeStudResult.authorOfComments.length > 0 || this.activeStudResult.recipientOfComments.length > 0 ||
                this.activeStudResult.facultyComment !== null;
            this.changeCommentView('Author');
            this.viewState = WgResViews.Comment;
            break;
        default:
            this.viewState = WgResViews.Loading;
        }
    }
}

const enum WgResViews {
    Loading,
    List,
    Behavior,
    Comment
}

export interface IResultComment {
    studentId: number;
    initials: string;
    nameSorter: {last: string, first: string};
    rankName: string;
    commentType: string;
    commentText: string;
    isAppr: boolean;
}