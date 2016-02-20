import IDataCtx from "core/service/data/context"
import * as appVars from "appVars"

export interface IRadios {
    effectiveness: string;
    freq: string;
    displayed: boolean;
}

export interface IRadioCollection {
    [responseId: number]: IRadios
}

export default class EcAssessmentAddForm {
    static controllerId = 'app.core.assessment.formEdit';
    static $inject = ['$uibModalInstance', IDataCtx.serviceId, 'mode', 'assessment'];

    nf: angular.IFormController;

    spResponses: any;
    radioEffectiveness: string;
    radioFreq: string;
    response: any;
    mode: string;

    radios: IRadioCollection = {} ;

    constructor(private $mi: angular.ui.bootstrap.IModalServiceInstance, private dCtx: IDataCtx, mode: string, assessment: any) {
        console.log('Assessment Loaded');
        this.spResponses = assessment;
        this.mode = mode;
        this.activate();
    }

    activate(): void {
        this.spResponses.forEach(resp => {
            var radioSet: IRadios = {
                effectiveness: 'None',
                freq: 'None',
                displayed: true
            }

            switch (resp.itemModelScore) {
                case -2:
                    radioSet.effectiveness = 'ineffective';
                    radioSet.freq = 'always';
                    break;
                case -1:
                    radioSet.effectiveness = 'ineffective';
                    radioSet.freq = 'frequently';
                    break;
                case 0:
                    radioSet.displayed = false;
                    break;
                case 1:
                    radioSet.effectiveness = 'effective';
                    radioSet.freq = 'frequently';
                    break;
                case 2:
                    radioSet.effectiveness = 'effective';
                    radioSet.freq = 'always';
                    break;
                case 3:
                    radioSet.effectiveness = 'highlyeffective';
                    radioSet.freq = 'frequently';
                    break;
                case 4:
                    radioSet.effectiveness = 'highlyeffective';
                    radioSet.freq = 'always';
                    break;
            }

            this.radios[resp.id] = radioSet;
        });

    }

    checkResponse(response: any): void {
        if (this.radios[response.id].displayed === false) {
            response.itemResponseScore = 0;
            response.mpItemResponse = appVars.EcSpItemResponse.Nd;
        } else {
            if (this.radios[response.id].effectiveness !== 'None' && this.radios[response.id].freq !== 'None') {
                switch (this.radios[response.id].effectiveness) {
                    case 'highlyeffective':
                        response.itemResponseScore = 3;
                        break;
                    case 'effective':
                        response.itemResponseScore = 1;
                        break;
                    case 'ineffective':
                        response.itemResponseScore = -2;
                        break;
                }
                if (this.radios[response.id].freq === 'always') {
                    if (response.itemResponseScore === -1) {
                        response.itemResponseScore -= 1;
                    } else {
                        response.itemResponseScore += 1;
                    }
                }

                switch (response.itemResponseScore) {
                    case -2:
                        response.mpItemResponse = appVars.EcSpItemResponse.Iea;
                        break;
                    case -1:
                        response.mpItemResponse = appVars.EcSpItemResponse.Ieu;
                        break;
                    case 1:
                        response.mpItemResponse = appVars.EcSpItemResponse.Eu;
                        break;
                    case 2:
                        response.mpItemResponse = appVars.EcSpItemResponse.Ea;
                        break;
                    case 3:
                        response.mpItemResponse = appVars.EcSpItemResponse.Heu;
                        break;
                    case 4:
                        response.mpItemResponse = appVars.EcSpItemResponse.Hea;
                        break;
                }
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

    ok(): void {
        this.spResponses.forEach(resp => {
            this.checkResponse(resp);
        });

        this.$mi.close(this.spResponses);
    }

}