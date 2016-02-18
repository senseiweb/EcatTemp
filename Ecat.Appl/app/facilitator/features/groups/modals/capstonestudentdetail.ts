import IDataCtx from "core/service/data/context"
import * as AppVar from "appVars"

//interface IAssesseeData {
//    assessor: Ecat.Shared.Model.MemberInGroup;
//    spResponses: Ecat.Shared.Model.SpAssessResponse[];
//    spOverall: number;
//    strat: Ecat.Shared.Model.SpStratResponse;
//}

//interface IAssessorData {
//    assessee: Ecat.Shared.Model.MemberInGroup;
//    spResponses: Ecat.Shared.Model.SpAssessResponse[];
//    spOverall: number;
//    strat: Ecat.Shared.Model.SpStratResponse;
//}

export default class EcFacCapstoneDetailsModal {
    static controllerId = 'app.facilitator.features.groups.capstonestudentdetails';
    static $inject = ['$uibModalInstance', IDataCtx.serviceId, 'selectedStudent'];

    nf: angular.IFormController;

    student: ecat.entity.IStudent;
    radioResponseType: string;

    constructor(private $mi: angular.ui.bootstrap.IModalServiceInstance, private dCtx: IDataCtx, private selectedStudent: ecat.entity.IStudent) {
        this.student = selectedStudent;
        this.radioResponseType = 'Assessee';

    }

    close(): void {
        this.$mi.dismiss();
    }
}