import IDataCtx from "core/service/data/context"
import * as appVars from "appVars"

export default class EcAssessmentAddForm {
    static controllerId = 'app.core.assessment.formAdd';
    static $inject = ['$uibModalInstance', IDataCtx.serviceId, 'mode', 'assessment'];

    nf: angular.IFormController;
    mode: string;
    spResponses: any;
    radioEffectiveness: string;
    radioFreq: string;
    activeResponse: any;
    notDisplayed: boolean;


    constructor(private $mi: angular.ui.bootstrap.IModalServiceInstance, private dCtx: IDataCtx, mode: string, assessment: any) {
        console.log(assessment);
        this.mode = mode;
        //this.spResponses = assessment;
        this.spResponses = assessment.sort(sortResponses);
        //var findFirst = this.spResponses.filter(resp => {
        //    if (resp.inventory.displayOrder === 1) {
        //        return true;
        //    }
        //    return false;
        //});
        function sortResponses(first: any, second: any) {
            if (first.inventoryItem.displayOrder > second.inventoryItem.displayOrder) { return 1 }
            if (first.inventoryItem.displayOrder < second.inventoryItem.displayOrder) { return -1 }
        }

        this.activeResponse = this.spResponses[0];
        //this.activeResponse = findFirst[0];
        this.notDisplayed = false;
        this.radioEffectiveness = '';
        this.radioFreq = '';
        console.log(this.activeResponse);
    }

    checkResponse(responseId: number): void {
        if (this.notDisplayed === true) {
            this.activeResponse.itemResponseScore = 0;
            this.activeResponse.mpItemResponse = appVars.EcSpItemResponse.Nd;
            this.switchActive(responseId);
        } else {
            if (this.radioEffectiveness !== '' && this.radioFreq !== '') {
                switch (this.radioEffectiveness) {
                    case 'highlyeffective':
                        this.activeResponse.itemResponseScore = 3;
                        break;
                    case 'effective':
                        this.activeResponse.itemResponseScore = 1;
                        break;
                    case 'ineffective':
                        this.activeResponse.itemResponseScore = -2;
                        break;
                }
                if (this.radioFreq === 'always') {
                    if (this.activeResponse.itemResponseScore === -1) {
                        this.activeResponse.itemResponseScore -= 1;
                    } else {
                        this.activeResponse.itemResponseScore += 1;
                    }
                }

                switch (this.activeResponse.itemResponseScore) {
                    case -2:
                        this.activeResponse.mpItemResponse = appVars.EcSpItemResponse.Iea;
                        break;
                    case -1:
                        this.activeResponse.mpItemResponse = appVars.EcSpItemResponse.Ieu;
                        break;
                    case 1:
                        this.activeResponse.mpItemResponse = appVars.EcSpItemResponse.Eu;
                        break;
                    case 2:
                        this.activeResponse.mpItemResponse = appVars.EcSpItemResponse.Ea;
                        break;
                    case 3:
                        this.activeResponse.mpItemResponse = appVars.EcSpItemResponse.Heu;
                        break;
                    case 4:
                        this.activeResponse.mpItemResponse = appVars.EcSpItemResponse.Hea;
                        break;
                }

                this.switchActive(responseId);
            }
        }

        if (responseId < this.activeResponse.inventoryItem.displayOrder) {
            this.switchActive(responseId);
        }
    }

    switchActive(responseId: number): void {
        if (responseId === 0) {
            var find = this.spResponses.filter(resp => {
                if (resp.inventoryItem.displayOrder === (this.activeResponse.inventory.displayOrder + 1)) {
                    return true;
                }
                return false;
            });
        } else {
            var find = this.spResponses.filter(resp => {
                if (resp.inventoryItem.displayOrder === responseId) {
                    return true;
                }
                return false;
            });
        }        

        switch (find[0].itemResponseScore) {
            case -2:
                this.notDisplayed = false;
                this.radioEffectiveness = 'ineffective';
                this.radioFreq = 'always';
                break;
            case -1:
                this.notDisplayed = false;
                this.radioEffectiveness = 'ineffective';
                this.radioFreq = 'frequently';
                break;
            case 0:
                this.notDisplayed = true;
                this.radioEffectiveness = '';
                this.radioFreq = '';
                break;
            case 1:
                this.notDisplayed = false;
                this.radioEffectiveness = 'effective';
                this.radioFreq = 'frequently';
                break;
            case 2:
                this.notDisplayed = false;
                this.radioEffectiveness = 'effective';
                this.radioFreq = 'always';
                break;
            case 3:
                this.notDisplayed = false;
                this.radioEffectiveness = 'highlyeffective';
                this.radioFreq = 'frequently';
                break;
            case 4:
                this.notDisplayed = false;
                this.radioEffectiveness = 'highlyeffective';
                this.radioFreq = 'always';
                break;
            default:
                this.notDisplayed = false;
                this.radioEffectiveness = '';
                this.radioFreq = '';
        }

        this.activeResponse = find[0];
    }

    cancel(): void {
        this.$mi.dismiss('canceled');
    }

    save(): void {
        this.$mi.close()
    }
}