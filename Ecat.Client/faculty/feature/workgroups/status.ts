import IDataCtx from "core/service/data/context"
//import IScoringService from "core/service/scoring"
import * as _mp from "core/common/mapStrings"

export interface IOvSpStatus {
    self: boolean,
    peer: number,
    strats: number,
    hEGiven: number,
    eGiven: number,
    iEGiven: number,
    nDGiven: number
}

export interface ISpStatuses {
    [groupMemberId: number]: IOvSpStatus;
}

export default class EcFacViewStatusModal {
    static controllerId = 'app.faculty.features.groups.viewStatus';
    static $inject = ['$uibModalInstance', IDataCtx.serviceId, 'selectedGroup'];

    nf: angular.IFormController;

    group: ecat.entity.IWorkGroup;
    spStatuses: ISpStatuses = {};

    constructor(private $mi: angular.ui.bootstrap.IModalServiceInstance, private dCtx: IDataCtx, private selectedGroup: ecat.entity.IWorkGroup) {
        this.group = selectedGroup;
        this.activate();
    }

    activate(): void {
        this.group.groupMembers.forEach(gm => {
            var ovStatus: IOvSpStatus = {
                self: false,
                peer: 0,
                strats: 0,
                hEGiven: 0,
                eGiven: 0,
                iEGiven: 0,
                nDGiven: 0
            }
            gm.groupPeers.forEach(peer => {
                if (gm.statusOfPeer[peer.studentId].assessComplete) {
                    if (peer.studentId === gm.studentId) {
                        ovStatus.self = true;
                    } else {
                        ovStatus.peer += 1;
                    }
                }

                if (gm.statusOfPeer[peer.studentId].stratComplete) {
                    ovStatus.strats += 1;
                }

                ovStatus.hEGiven += gm.statusOfPeer[peer.studentId].breakout.highEff;
                ovStatus.eGiven += gm.statusOfPeer[peer.studentId].breakout.eff;
                ovStatus.iEGiven += gm.statusOfPeer[peer.studentId].breakout.ineff;
                ovStatus.nDGiven += gm.statusOfPeer[peer.studentId].breakout.nd;
            });

            this.spStatuses[gm.studentId] = ovStatus;
        });
    }

    close(): void {
        this.$mi.close();
    }
}