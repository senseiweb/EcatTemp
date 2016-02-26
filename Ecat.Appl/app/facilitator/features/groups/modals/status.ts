import IDataCtx from "core/service/data/context"
//import IScoringService from "core/service/scoring"
import * as AppVar from "appVars"

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
    static controllerId = 'app.facilitator.features.groups.viewStatus';
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
                if (gm.statusOfPeer[peer.id].assessComplete) {
                    if (peer.id === gm.id) {
                        ovStatus.self = true;
                    } else {
                        ovStatus.peer += 1;
                    }
                }

                if (gm.statusOfPeer[peer.id].stratComplete) {
                    ovStatus.strats += 1;
                }

                ovStatus.hEGiven += gm.statusOfPeer[peer.id].breakout.highEff;
                ovStatus.eGiven += gm.statusOfPeer[peer.id].breakout.eff;
                ovStatus.iEGiven += gm.statusOfPeer[peer.id].breakout.ineff;
                ovStatus.nDGiven += gm.statusOfPeer[peer.id].breakout.nd;
            });

            this.spStatuses[gm.id] = ovStatus;
        });
        console.log(this.group.groupNumber + ' ' + this.group.defaultName + ' Group Status Loaded');
    }

    close(): void {
        this.$mi.close();
    }
}