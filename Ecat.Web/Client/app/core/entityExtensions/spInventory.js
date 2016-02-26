System.register(["core/common/mapStrings", "core/common/mapEnum"], function(exports_1) {
    var _mp, _mpe;
    var SpInventoryExt;
    return {
        setters:[
            function (_mp_1) {
                _mp = _mp_1;
            },
            function (_mpe_1) {
                _mpe = _mpe_1;
            }],
        execute: function() {
            SpInventoryExt = (function () {
                function SpInventoryExt() {
                }
                Object.defineProperty(SpInventoryExt.prototype, "behaviorFreq", {
                    get: function () {
                        switch (this.responseForAssessee.mpItemResponse) {
                            case _mp.EcSpItemResponse.hea:
                            case _mp.EcSpItemResponse.iea:
                            case _mp.EcSpItemResponse.ea:
                                return 0 /* Always */;
                            case _mp.EcSpItemResponse.heu:
                            case _mp.EcSpItemResponse.eu:
                            case _mp.EcSpItemResponse.ieu:
                                return 1 /* Frequently */;
                            default:
                                return null;
                        }
                    },
                    set: function (freqLevel) {
                        this._behaveNotDisplayed = false;
                        this._freqLevel = freqLevel;
                        this.calculateItemResponse();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SpInventoryExt.prototype, "behaviorEffect", {
                    get: function () {
                        switch (this.responseForAssessee.mpItemResponse) {
                            case _mp.EcSpItemResponse.hea:
                            case _mp.EcSpItemResponse.heu:
                                return 2 /* HighlyEffective */;
                            case _mp.EcSpItemResponse.eu:
                            case _mp.EcSpItemResponse.ea:
                                return 1 /* Effective */;
                            case _mp.EcSpItemResponse.iea:
                            case _mp.EcSpItemResponse.ieu:
                                return 0 /* Ineffective */;
                            default:
                                return null;
                        }
                    },
                    set: function (effLevel) {
                        this._behaveNotDisplayed = false;
                        this._effLevel = effLevel;
                        this.calculateItemResponse();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SpInventoryExt.prototype, "behaviorDisplayed", {
                    get: function () {
                        return this.responseForAssessee.mpItemResponse === _mp.EcSpItemResponse.nd;
                    },
                    set: function (behaveNotDisplayed) {
                        this._behaveNotDisplayed = behaveNotDisplayed;
                        if (behaveNotDisplayed) {
                            this.responseForAssessee.mpItemResponse = _mp.EcSpItemResponse.nd;
                            this.compositeScore = 2 /* nd */;
                        }
                        else {
                            this._freqLevel = this._effLevel = null;
                            this.responseForAssessee.mpItemResponse = null;
                            this.compositeScore = null;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                SpInventoryExt.prototype.calculateItemResponse = function () {
                    if (!this._effLevel || !this._freqLevel) {
                        this.responseForAssessee.mpItemResponse = null;
                        this.compositeScore = null;
                        return;
                    }
                    switch (this._effLevel) {
                        case 2 /* HighlyEffective */:
                            if (this._freqLevel === 0 /* Always */) {
                                this.responseForAssessee.mpItemResponse = _mp.EcSpItemResponse.hea;
                                this.compositeScore = 6 /* hea */;
                            }
                            else {
                                this.responseForAssessee.mpItemResponse = _mp.EcSpItemResponse.heu;
                                this.compositeScore = 5 /* heu */;
                            }
                            break;
                        case 1 /* Effective */:
                            if (this._freqLevel === 0 /* Always */) {
                                this.responseForAssessee.mpItemResponse = _mp.EcSpItemResponse.ea;
                                this.compositeScore = 3 /* ea */;
                            }
                            else {
                                this.responseForAssessee.mpItemResponse = _mp.EcSpItemResponse.eu;
                                this.compositeScore = 4 /* eu */;
                            }
                            break;
                        case 0 /* Ineffective */:
                            if (this._freqLevel === 0 /* Always */) {
                                this.responseForAssessee.mpItemResponse = _mp.EcSpItemResponse.iea;
                                this.compositeScore = 0 /* iea */;
                            }
                            else {
                                this.responseForAssessee.mpItemResponse = _mp.EcSpItemResponse.ieu;
                                this.compositeScore = 1 /* ieu */;
                            }
                            break;
                        default:
                            this.responseForAssessee.mpItemResponse = null;
                            this.compositeScore = null;
                    }
                };
                return SpInventoryExt;
            })();
            exports_1("default", SpInventoryExt);
        }
    }
});
