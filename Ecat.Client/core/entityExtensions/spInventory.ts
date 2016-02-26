import * as _mp from "core/common/mapStrings"
import * as _mpe from "core/common/mapEnum"

export default class SpInventoryExt implements ecat.entity.ext.IFacSpInventoryExt {
    private _behaveNotDisplayed: boolean;
    private _freqLevel: _mpe.SpFreqLevel;
    private _effLevel: _mpe.SpEffectiveLevel;

    responseForAssessee: ecat.entity.IFacSpResponse;
    compositeScore: number;

    get behaviorFreq(): _mpe.SpFreqLevel {
        switch (this.responseForAssessee.mpItemResponse) {
            case _mp.EcSpItemResponse.hea:
            case _mp.EcSpItemResponse.iea:
            case _mp.EcSpItemResponse.ea:
                return _mpe.SpFreqLevel.Always;

            case _mp.EcSpItemResponse.heu:
            case _mp.EcSpItemResponse.eu:
            case _mp.EcSpItemResponse.ieu:
                return _mpe.SpFreqLevel.Frequently;
            default:
                return null;
        }
    }

    set behaviorFreq(freqLevel: _mpe.SpFreqLevel) {
        this._behaveNotDisplayed = false;
        this._freqLevel = freqLevel;
        this.calculateItemResponse();
    }

    get behaviorEffect(): _mpe.SpEffectiveLevel {
        switch (this.responseForAssessee.mpItemResponse) {
            case _mp.EcSpItemResponse.hea:
            case _mp.EcSpItemResponse.heu:
                return _mpe.SpEffectiveLevel.HighlyEffective;
            case _mp.EcSpItemResponse.eu:
            case _mp.EcSpItemResponse.ea:
                return _mpe.SpEffectiveLevel.Effective;
            case _mp.EcSpItemResponse.iea:
            case _mp.EcSpItemResponse.ieu:
                return _mpe.SpEffectiveLevel.Ineffective;
            default:
                return null;
        }
    }

    set behaviorEffect(effLevel: _mpe.SpEffectiveLevel) {
        this._behaveNotDisplayed = false;
        this._effLevel = effLevel;
        this.calculateItemResponse();
    }

    get behaviorDisplayed(): boolean {
        return this.responseForAssessee.mpItemResponse === _mp.EcSpItemResponse.nd;
    }

    set behaviorDisplayed(behaveNotDisplayed: boolean) {
        this._behaveNotDisplayed = behaveNotDisplayed;

        if (behaveNotDisplayed) {
            this.responseForAssessee.mpItemResponse = _mp.EcSpItemResponse.nd;
            this.compositeScore = _mpe.CompositeModelScore.nd;
        } else {
            this._freqLevel = this._effLevel = null;
            this.responseForAssessee.mpItemResponse = null;
            this.compositeScore = null;
        }
    }

    private calculateItemResponse(): void {
        if (!this._effLevel || !this._freqLevel) {
            this.responseForAssessee.mpItemResponse = null;
            this.compositeScore = null;
            return;
        }

        switch (this._effLevel) {

            case _mpe.SpEffectiveLevel.HighlyEffective:
                if (this._freqLevel === _mpe.SpFreqLevel.Always) {
                    this.responseForAssessee.mpItemResponse = _mp.EcSpItemResponse.hea;
                    this.compositeScore = _mpe.CompositeModelScore.hea;
                } else {
                    this.responseForAssessee.mpItemResponse = _mp.EcSpItemResponse.heu;
                    this.compositeScore = _mpe.CompositeModelScore.heu;
                }
                break;

            case _mpe.SpEffectiveLevel.Effective:
                if (this._freqLevel === _mpe.SpFreqLevel.Always) {
                    this.responseForAssessee.mpItemResponse = _mp.EcSpItemResponse.ea;
                    this.compositeScore = _mpe.CompositeModelScore.ea;
                } else {
                    this.responseForAssessee.mpItemResponse = _mp.EcSpItemResponse.eu;
                    this.compositeScore = _mpe.CompositeModelScore.eu;
                }
                break;

            case _mpe.SpEffectiveLevel.Ineffective:
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