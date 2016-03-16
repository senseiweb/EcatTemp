import * as _mp from "core/common/mapStrings"
import * as _mpe from "core/common/mapEnum"
import _staticDs from "core/service/data/static"

export class SpInventoryExtBase implements ecat.entity.ext.ISpInventoryExtBase {
    private _behaveDisplayed = true;
    private _freqLevel: _mpe.SpFreqLevel = null;
    private _effLevel: _mpe.SpEffectLevel = null;
    private _resultBreakOut: any;
    protected id = null; 
    private behavior: string;
    private commentText: string;
    constructor() { }

    get compositeScore(): number {
        return this.responseForAssessee ? this.responseForAssessee.itemModelScore : null;
    };

    reset(): void {
        this._effLevel = null;
        this._freqLevel = null;
        this._behaveDisplayed = true;
        this.responseForAssessee = null;
    }

    spResult: ecat.entity.ISpResult;

    responseForAssessee: ecat.entity.ISpResponse | ecat.entity.IFacSpResponse = null;

    get behaviorFreq(): _mpe.SpFreqLevel {
        if (!this.responseForAssessee) {
            return null;
        }
        if (!this.responseForAssessee.mpItemResponse) {
            return this._freqLevel;
        }
        switch (this.responseForAssessee.mpItemResponse) {
            case _mp.MpSpItemResponse.hea:
            case _mp.MpSpItemResponse.iea:
            case _mp.MpSpItemResponse.ea:
                return _mpe.SpFreqLevel.Always;

            case _mp.MpSpItemResponse.heu:
            case _mp.MpSpItemResponse.eu:
            case _mp.MpSpItemResponse.ieu:
                return _mpe.SpFreqLevel.Usually;
            default:
                return null;
        }
    }

    set behaviorFreq(freqLevel: _mpe.SpFreqLevel) {
        this._behaveDisplayed = true;
        this._freqLevel = freqLevel;
        this.calculateItemResponse();
    }

    get behaviorEffect(): _mpe.SpEffectLevel {
        if (!this.responseForAssessee) {
            return null;
        }
        if (!this.responseForAssessee.mpItemResponse) {
            return this._effLevel;
        }
        switch (this.responseForAssessee.mpItemResponse) {
            case _mp.MpSpItemResponse.hea:
            case _mp.MpSpItemResponse.heu:
                return _mpe.SpEffectLevel.HighlyEffective;
            case _mp.MpSpItemResponse.eu:
            case _mp.MpSpItemResponse.ea:
                return _mpe.SpEffectLevel.Effective;
            case _mp.MpSpItemResponse.iea:
            case _mp.MpSpItemResponse.ieu:
                return _mpe.SpEffectLevel.Ineffective;
            default:
                return null;
        }
    }

    set behaviorEffect(effLevel: _mpe.SpEffectLevel) {
        this._behaveDisplayed = true;
        this._effLevel = effLevel;
        this.calculateItemResponse();
    }

    get behaviorDisplayed(): boolean {
        if (!this.responseForAssessee) {
            return null;
        }
        if (!this.responseForAssessee.mpItemResponse) {
            return this._behaveDisplayed;
        }
        return this.responseForAssessee.mpItemResponse !== _mp.MpSpItemResponse.nd;
    }

    set behaviorDisplayed(behaveDisplayed: boolean) {

        this._behaveDisplayed = behaveDisplayed;

        if (behaveDisplayed) {
            this._freqLevel = this._effLevel = null;
            this.responseForAssessee.mpItemResponse = null;
            this.compositeScore = null;
        } else {
            this.responseForAssessee.mpItemResponse = _mp.MpSpItemResponse.nd;
        }
    }

    private calculateItemResponse(): void {
        const reponse = this.responseForAssessee.mpItemResponse;
        if (reponse) {
            if (!this._effLevel) this._effLevel = this.behaviorEffect;
            if (!this._freqLevel) this._freqLevel = this.behaviorFreq;
        }


        if (!this._effLevel || !this._freqLevel) {
            this.responseForAssessee.mpItemResponse = null;
            return;
        }

        switch (this._effLevel) {

            case _mpe.SpEffectLevel.HighlyEffective:
                if (this._freqLevel === _mpe.SpFreqLevel.Always) {
                    this.responseForAssessee.mpItemResponse = _mp.MpSpItemResponse.hea;
                    this.responseForAssessee.itemModelScore = _mpe.CompositeModelScore.hea;
                } else {
                    this.responseForAssessee.mpItemResponse = _mp.MpSpItemResponse.heu;
                    this.responseForAssessee.itemModelScore  = _mpe.CompositeModelScore.heu;
                }
                break;

            case _mpe.SpEffectLevel.Effective:
                if (this._freqLevel === _mpe.SpFreqLevel.Always) {
                    this.responseForAssessee.mpItemResponse = _mp.MpSpItemResponse.ea;
                    this.responseForAssessee.itemModelScore  = _mpe.CompositeModelScore.ea;
                } else {
                    this.responseForAssessee.mpItemResponse = _mp.MpSpItemResponse.eu;
                    this.responseForAssessee.itemModelScore  = _mpe.CompositeModelScore.eu;
                }
                break;

            case _mpe.SpEffectLevel.Ineffective:
                if (this._freqLevel === _mpe.SpFreqLevel.Always) {
                    this.responseForAssessee.mpItemResponse = _mp.MpSpItemResponse.iea;
                    this.responseForAssessee.itemModelScore  = _mpe.CompositeModelScore.iea;
                } else {
                    this.responseForAssessee.mpItemResponse = _mp.MpSpItemResponse.ieu;
                    this.responseForAssessee.itemModelScore  = _mpe.CompositeModelScore.ieu;
                }
                break;

            default:
                this.responseForAssessee.mpItemResponse = null;
                this.responseForAssessee.itemModelScore = null;
        }


    }

    get behaviorEllipse(): string {
        if (this.behavior) {
            return this.behavior.substr(0, 25);
        }
        return null;
    }

    get abbrivateText(): string {
        if (this.commentText) return this.commentText.substr(30);
        return null;
    }

    get resultBreakOut(): any {
        if (this._resultBreakOut) {
            return this._resultBreakOut;
        }

        if (!this.spResult) {
            return null;
        }

        const breakOut = {
            selfResult: '',
            peersResult: '',
            facultyResult: '',
            peerBoChart: []
        }

        const responsesForItem = this.spResult.sanitizedResponses.filter(response => response.inventoryItemId === this.id);

        const compositeBreakOut = {};

        responsesForItem
            .filter(response => !response.isSelfResponse)
            .forEach(response => {
                if (compositeBreakOut[response.mpItemResponse]) {
                    compositeBreakOut[response.mpItemResponse] += 1;
                } else {
                    compositeBreakOut[response.mpItemResponse] = 1;
                }
            });

        const dataSet = [];

        for (let bo in compositeBreakOut) {
            if (compositeBreakOut.hasOwnProperty(bo)) {
                if (bo === 'IEA') dataSet.push({ data: compositeBreakOut[bo], label: bo, color: '#AA0000' });
                if (bo === 'IEU') dataSet.push({ data: compositeBreakOut[bo], label: bo, color: '#FE6161' });
                if (bo === 'ND') dataSet.push({ data: compositeBreakOut[bo], label: bo, color: '#AAAAAA' });
                if (bo === 'EA') dataSet.push({ data: compositeBreakOut[bo], label: bo, color: '#00AA58' });
                if (bo === 'EU') dataSet.push({ data: compositeBreakOut[bo], label: bo, color: '#73FFBB' });
                if (bo === 'HEA') dataSet.push({ data: compositeBreakOut[bo], label: bo, color: '#9f9f9f' });
                if (bo === 'HEU') dataSet.push({ data: compositeBreakOut[bo], label: bo, color: '#7CA8FF' });
            }
        }

        breakOut.peerBoChart = dataSet;
        breakOut.peersResult = _staticDs.breakDownCalculation(compositeBreakOut);

        const selfResponse = responsesForItem.filter(response => response.isSelfResponse && response.inventoryItemId === this.id)[0];

        const facResponse = (this.spResult.facultyResponses) ?  this.spResult.facultyResponses.filter(response => response.inventoryItemId === this.id)[0] : null;

        breakOut.selfResult = _staticDs.prettifyItemResponse(selfResponse.mpItemResponse);

        breakOut.facultyResult = (facResponse) ? _staticDs.prettyInstituteRole(facResponse.mpItemResponse) : 'Not Assessed';
       
        this._resultBreakOut = breakOut;
        return breakOut;
    }


}



