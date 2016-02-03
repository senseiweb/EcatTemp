import ICommon from "core/service/common"
import IDataCtx from "core/service/data/context"

export default class EcStudentAssessments {
    static controllerId = 'app.student.assessments';
    static $inject = [IDataCtx.serviceId, ICommon.serviceId];
    courseMems: ecat.entity.ICourseMember[] = [];
    groups: Ecat.Models.EcGroup[] = [];



    constructor(private dCtx: IDataCtx, private common: ICommon) {
        console.log('Student Assessment Loaded');
    }

    getMembershipsAndAssessments(): void {
        const self = this;

        this.dCtx.student.getMembershipsAndAssessments()
            //.then((retData: ecat.entity.ICourseMember[]) => { this.courseMems = retData; })
            .then(getMemAndAssessResp)
            .catch((retData: any) => { this.common.logger.logWarn("Getting coursemems didn't work", retData, 'EcStudentAssessments', false);});

        function getMemAndAssessResp(retData: ecat.entity.ICourseMember[]): void {
            self.courseMems = retData;
            //self.groups = self.courseMems[0].groups.;
            self.courseMems[0].groups.forEach(g => {
                self.groups.push(g.group)
            });
        }
    }
}