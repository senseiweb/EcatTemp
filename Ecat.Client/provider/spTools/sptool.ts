import IDataCtx from "core/service/data/context"
import ICommon from "core/common/commonService"
import * as _mpe from "core/common/mapEnum"
import _commenter from "provider/spTools/commenter"
import _assesser from "provider/spTools/assesser"

export default class EcSpTools {
    static serviceId = 'app.service.sptools';
    static $inject = ['$uibModal', IDataCtx.serviceId];

    private commentModalOptions: angular.ui.bootstrap.IModalSettings = {
        controller: _commenter.controllerId,
        controllerAs: 'commenter',
        bindToController: true,
        keyboard: false,
        backdrop: 'static',
        templateUrl: '@[appProvider]/spTools/commenter.html'

    };

    private assssModalOption: angular.ui.bootstrap.IModalSettings = {
        controller: _assesser.controllerId,
        controllerAs: 'assesser',
        bindToController: true,
        keyboard: false,
        backdrop: 'static',
        templateUrl: '@[appProvider]/spTools/assesser.html'

    };

    constructor(private $uim: angular.ui.bootstrap.IModalService,c:ICommon, private dCtx: IDataCtx) {
       
    }

    loadSpComment(recipientId: number, viewOnly: boolean): angular.IPromise<void> {
        this.commentModalOptions.resolve = { recipientId: recipientId, viewOnly: viewOnly };
        return this.$uim.open(this.commentModalOptions).result;
    }

    loadSpAssessment(assesseeId: number, viewOnly: boolean): angular.IPromise<void> {
        this.assssModalOption.resolve = {
            assesseeId: assesseeId,
            viewOnly: viewOnly
        }
        return this.$uim.open(this.assssModalOption).result;
    }

    evaluateStratification<T extends ecat.entity.IFacStratResponse | ecat.entity.IStratResponse>(response: T, peers: Array<ecat.entity.ICrseStudInGroup>): T {
        const newPos = response.proposedPosition;
         //Check 1: Do I need to continue?
        if ((response.stratPosition && !newPos)) {
            response.isValid = true;
            return response;
        }

        const errors: Array<{ cat: string, text: string }> = [];

        //Check 2: If no previous strat, check if proposed is empty
        if (!newPos) {
            errors.push({
                cat: 'Missing',
                text: 'A numerical value gt 0 must be entered'
            });
            response.validationErrors = errors;
            return response;
        }

        //Check 3: Check for is a number value
        if (!angular.isNumber(newPos)) {
            errors.push({
                cat: 'Not Number',
                text: 'A numerical value gt 0 must be entered'
            });
        }

        //Check 4: Check for strat outside top range
        if (newPos > peers.length) {
            errors.push({
                cat: 'Not In Range',
                text: 'Must be eq or less than number of group '
            });
        }

        //Check 5: Check for strat outside low range
        if (newPos < 0) {
            errors.push({
                cat: 'Not In Range',
                text: 'Must be greater than 0'
            });
        }

        //Check 6: for duplicate proposed changes
        peers
            .filter(peer => peer.facultyStrat.proposedPosition === newPos && response.assesseePersonId !== peer.studentId)
            .forEach(peer => {
                errors.push({
                    cat: 'Duplicate',
                    text: `${peer.rankName} has identical proposed change`
                });
            });

        //Check 7: for duplicate exist strat w/o proposed changes
        peers
            .filter(peer => peer.facultyStrat.stratPosition === newPos &&
                peer.facultyStrat.proposedPosition === null &&
                response.assesseePersonId !== peer.studentId)
            .forEach(peer => {
                errors.push({
                    cat: 'Duplicate',
                    text: `${peer.rankName} is already stratified at this position`
                });
            });

        response.isValid = errors.length === 0;
        response.validationErrors = errors;
        return response;
    }
}