import IDataCtx from "core/service/data/context"
import * as AppVar from "appVars"

export default class EcFacViewStatusModal {
    static controllerId = 'app.facilitator.features.groups.viewStatus';
    static $inject = ['$uibModalInstance', IDataCtx.serviceId];

    nf: angular.IFormController;

    group: ecat.entity.IGroup;
    //students = [];
    peersTotal: number;

    constructor(private $mi: angular.ui.bootstrap.IModalServiceInstance, private dCtx: IDataCtx, private selectedGroup: ecat.entity.IGroup) {
        this.group = selectedGroup;
        this.peersTotal = this.group.members.length - 1;
        
        //this.group.members.forEach(m => {
        //    var name = m.member.person.lastName + ', ' + m.member.person.firstName;
        //    var selfComplete = false;
        //    var peerComplete = 0;
        //    var hEGiven = 0;
        //    var eGiven = 0;
        //    var iEGiven = 0;
        //    var nDGiven = 0;

        //    m.assessorSpResponses.forEach(resp => {
        //        if (resp.assesseeId === resp.assessorId) {
        //            selfComplete = true;
        //        } else {
        //            peerComplete += 1;
        //        }
        //        if (resp.mpSpItemResponse === AppVar.EcSpItemResponse.Heu
        //            || resp.mpSpItemResponse === AppVar.EcSpItemResponse.Hea) {
        //            hEGiven += 1
        //        } else if (resp.mpSpItemResponse === AppVar.EcSpItemResponse.Eu
        //            || resp.mpSpItemResponse === AppVar.EcSpItemResponse.Ea) {
        //            eGiven += 1
        //        } else if (resp.mpSpItemResponse === AppVar.EcSpItemResponse.Iea
        //            || resp.mpSpItemResponse === AppVar.EcSpItemResponse.Ieu) {
        //            iEGiven += 1
        //        } else if (resp.mpSpItemResponse === AppVar.EcSpItemResponse.Nd) {
        //            nDGiven += 1
        //        }
        //    });

        //    if (m.assessorStratResponse.length === this.peersTotal + 1) {
        //        var stratComplete = this.peersTotal
        //    } else {
        //        var stratComplete = m.assessorStratResponse.length;
        //    }

        //    var comments = m.authorOfComments.length;

        //    var student = {
        //        name: name,
        //        selfComplete: selfComplete,
        //        peerComplete: peerComplete,
        //        hEGiven: hEGiven,
        //        eGiven: eGiven,
        //        iEGiven: iEGiven,
        //        nDGiven: nDGiven,
        //        stratComplete: stratComplete,
        //        comments: comments
        //    };

        //    this.students.push(student);
        //});
    }

    close(): void {
        this.$mi.close();
    }
}