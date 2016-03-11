import * as _mp from "core/common/mapStrings"
import * as _mpe from "core/common/mapEnum"

export class SpInventoryExtBase implements ecat.entity.ext.ISpInventoryExtBase {
    private _behaveDisplayed = true;
    private _freqLevel: _mpe.SpFreqLevel = null;
    private _effLevel: _mpe.SpEffectLevel = null;


    compositeScore: number = 0;
    responseForAssessee: ecat.entity.ISpResponse | ecat.entity.IFacSpResponse = null;
ß
    get behaviorFreq(): _mpe.SpFreqLevel {
        if (!this.responseForAssessee) {
            return null;
        }
        if (!this.responseForAssessee.mpItemResponse) {
            return this._freqLevel;
        }
        switch (this.responseForAssessee.mpItemResponse) {
            case _mp.EcSpItemResponse.hea:
            case _mp.EcSpItemResponse.iea:
            case _mp.EcSpItemResponse.ea:
                return _mpe.SpFreqLevel.Always;

            case _mp.EcSpItemResponse.heu:
            case _mp.EcSpItemResponse.eu:
            case _mp.EcSpItemResponse.ieu:
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
            case _mp.EcSpItemResponse.hea:
            case _mp.EcSpItemResponse.heu:
                return _mpe.SpEffectLevel.HighlyEffective;
            case _mp.EcSpItemResponse.eu:
            case _mp.EcSpItemResponse.ea:
                return _mpe.SpEffectLevel.Effective;
            case _mp.EcSpItemResponse.iea:
            case _mp.EcSpItemResponse.ieu:
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
        return this.responseForAssessee.mpItemResponse !== _mp.EcSpItemResponse.nd;
    }

    set behaviorDisplayed(behaveDisplayed: boolean) {

        this._behaveDisplayed = behaveDisplayed;

        if (behaveDisplayed) {
            this._freqLevel = this._effLevel = null;
            this.responseForAssessee.mpItemResponse = null;
            this.compositeScore = null;
        } else {
            this.responseForAssessee.mpItemResponse = _mp.EcSpItemResponse.nd;
            this.compositeScore = _mpe.CompositeModelScore.nd;
        }
    }

    private calculateItemResponse(): void {
        const reponse = this.responseForAssessee.mpItemResponse;
        if (reponse) {
            if (this._effLevel === null || this._effLevel === undefined) this._effLevel = this.behaviorEffect;
            if (this._freqLevel === null || this._freqLevel === undefined) this._freqLevel = this.behaviorFreq;
        }


        if ((this._effLevel === null || this._effLevel === undefined) || (this._freqLevel === null  || this._freqLevel === undefined)) {
            this.responseForAssessee.mpItemResponse = null;
            this.compositeScore = null;
            return;
        }

        switch (this._effLevel) {

            case _mpe.SpEffectLevel.HighlyEffective:
                if (this._freqLevel === _mpe.SpFreqLevel.Always) {
                    this.responseForAssessee.mpItemResponse = _mp.EcSpItemResponse.hea;
                    this.compositeScore = _mpe.CompositeModelScore.hea;
                } else {
                    this.responseForAssessee.mpItemResponse = _mp.EcSpItemResponse.heu;
                    this.compositeScore = _mpe.CompositeModelScore.heu;
                }
                break;

            case _mpe.SpEffectLevel.Effective:
                if (this._freqLevel === _mpe.SpFreqLevel.Always) {
                    this.responseForAssessee.mpItemResponse = _mp.EcSpItemResponse.ea;
                    this.compositeScore = _mpe.CompositeModelScore.ea;
                } else {
                    this.responseForAssessee.mpItemResponse = _mp.EcSpItemResponse.eu;
                    this.compositeScore = _mpe.CompositeModelScore.eu;
                }
                break;

            case _mpe.SpEffectLevel.Ineffective:
                if (this._freqLevel === _mpe.SpFreqLevel.Always) {
                    this.responseForAssessee.mpItemResponse = _mp.EcSpItemResponse.iea;
                    this.compositeScore = _mpe.CompositeModelScore.iea;
                } else {
                    this.responseForAssessee.mpItemResponse = _mp.EcSpItemResponse.ieu;
                    this.compositeScore = _mpe.CompositeModelScore.ieu;
                }
                break;

            default:
                this.responseForAssessee.mpItemResponse = null;
                this.compositeScore = null;
        }


    }
}



