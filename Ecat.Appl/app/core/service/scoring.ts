import * as appVars from "appVars"

//export interface IInventoriesWithOveralls {
//    [displayOrder: number]: IInventoryOverall;
//}

//export interface IInventoryOverall {
//    selfAgg: number,
//    selfWP: string,
//    peerAgg: number,
//    peerWP: string,
//    facAgg: number,
//    facWP: string
//}

export default class EcScoreService {
    static serviceId = 'core.service';

    getCompositeResultString(score: number): string {
        if (score < .17) { return 'Ineffective Always'; }
        if (score >= .17 && score < .34) { return 'Ineffective Usually'; }
        if (score >= .34 && score < .5) { return 'Not Displayed'; }
        if (score >= .5 && score < .67) { return 'Effective Usually'; }
        if (score >= .67 && score < .84) { return 'Effective Always'; }
        if (score >= .84 && score < 1) { return 'Highly Effective Usually'; }
        if (score >= 1) { return 'Highly Effective Always'; }
    }
        
    getModelScoreString(score: number) {
        if (score < -1) { return 'Ineffective Always'; }
        if (score >= -1 && score < 0) { return 'Ineffective Usually'; }
        if (score >= 0 && score < 1) { return 'Not Displayed'; }
        if (score >= 1 && score < 2) { return 'Effective Usually'; }
        if (score >= 2 && score < 3) { return 'Effective Always'; }
        if (score >= 3 && score < 4) { return 'Highly Effective Usually'; }
        if (score >= 4) { return 'Highly Effective Always'; }
    }

    calcFacComposite(responses: Ecat.Shared.Model.FacSpAssessResponse[]): number {
        var cummScore = 0;
        var knownResponse = appVars.EcSpItemResponse;
        responses.forEach(resp => {
            switch (resp.mpItemResponse) {
                case knownResponse.Iea: cummScore += 0; break;
                case knownResponse.Ieu: cummScore += 1; break;
                case knownResponse.Nd: cummScore += 2; break;
                case knownResponse.Ea: cummScore += 3; break;
                case knownResponse.Eu: cummScore += 4; break;
                case knownResponse.Hea: cummScore += 5; break;
                case knownResponse.Heu: cummScore += 6; break;
                default: break;
            }
        });
        return cummScore;
    }

    calcInventoryOveralls(instrument: Ecat.Shared.Model.SpInstrument, spResponses: Ecat.Shared.Model.SpAssessResponse[], facResponses: Ecat.Shared.Model.FacSpAssessResponse[]): ecat.IInventoriesWithOveralls {
        var invsWithOvs: ecat.IInventoriesWithOveralls = {};

        instrument.inventoryCollection.forEach(inv => {
            var overalls: ecat.IInventoryOverall = {
                selfWP: '',
                peerAgg: 0,
                peerCount: 0,
                peerWP: '',
                facWP: ''
            }
            invsWithOvs[inv.displayOrder] = overalls;
        });

        spResponses.forEach(resp => {
            if (resp.assesseeId === resp.assessorId) {
                invsWithOvs[resp.inventoryItem.displayOrder].selfWP = resp.mpItemResponse;
            } else {
                invsWithOvs[resp.inventoryItem.displayOrder].peerAgg += resp.itemModelScore;
                invsWithOvs[resp.inventoryItem.displayOrder].peerCount += 1;
            }
        });

        facResponses.forEach(resp => {
            invsWithOvs[resp.inventoryItem.displayOrder].facWP = resp.mpItemResponse;
        });

        instrument.inventoryCollection.forEach(inv => {
            invsWithOvs[inv.displayOrder].peerWP = this.getModelScoreString((invsWithOvs[inv.displayOrder].peerAgg / invsWithOvs[inv.displayOrder].peerCount));
        });

        return invsWithOvs;
    }
}