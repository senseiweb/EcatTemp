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
        this.mode = mode;
        this.spResponses = assessment.sort(sortResponses);

        function sortResponses(first: any, second: any) {
            if (first.inventoryItem.displayOrder > second.inventoryItem.displayOrder) { return 1 }
            if (first.inventoryItem.displayOrder < second.inventoryItem.displayOrder) { return -1 }
        }

        this.activeResponse = this.spResponses[0];
        this.notDisplayed = false;
        this.radioEffectiveness = 'None';
        this.radioFreq = 'None';
    }

    pageCheck(response: any): void {
        if (response.mpItemResponse === null) {
            if (response.inventoryItem.displayOrder !== (this.activeResponse.inventoryItem.displayOrder + 1)) {
                var find = this.spResponses.filter(resp => {
                    if (resp.inventoryItem.displayOrder === (response.inventoryItem.displayOrder - 1)) {
                        return true;
                    }
                    return false;
                });

                if (find[0].mpItemResponse !== null) {
                    this.checkResponse(response);
                }
            } else {
                this.checkResponse(response);
            }
        } else {
            this.checkResponse(response);
        }
    }

    checkResponse(response: any): void {
        var switchActive = false;
        if (this.notDisplayed === true) {
            this.activeResponse.itemResponseScore = 0;
            this.activeResponse.mpItemResponse = appVars.EcSpItemResponse.Nd;
            switchActive = true;
        } else {
            if (this.radioEffectiveness !== 'None' && this.radioFreq !== 'None') {
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

                switchActive = true;
            }
        }

        if (switchActive || (response !== null && response.inventoryItem.displayOrder < this.activeResponse.inventoryItem.displayOrder)) {
            this.switchActive(response);
        }

    }

    switchActive(response: any): void {
        var editing = false;
        if (response === null) {
            var find = this.spResponses.filter(resp => {
                if (resp.inventoryItem.displayOrder === (this.activeResponse.inventoryItem.displayOrder + 1)) {
                    if (resp.mpItemResponse !== null) {
                        editing = true;
                    }
                    return true;
                }
                return false;
            });

            response = find[0];
        } 

        if (!editing && response !== undefined) {
            this.activeResponse = response;

            switch (this.activeResponse.itemResponseScore) {
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
                    this.radioEffectiveness = 'None';
                    this.radioFreq = 'None';
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
                    this.radioEffectiveness = 'None';
                    this.radioFreq = 'None';
            }
        } 
    }

    cancel(): void {
        this.spResponses.forEach(resp => {
            if (resp.entityAspect.entityState.isAddedModifiedOrDeleted) {
                resp.entityAspect.rejectChanges();
            }
        });

        this.$mi.dismiss('canceled');
    }

    save(): void {
        this.$mi.close(this.spResponses)
    }
}