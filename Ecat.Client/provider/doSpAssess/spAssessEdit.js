System.register(["core/service/data/context", "core/common/mapStrings"], function(exports_1) {
    var context_1, _mp;
    var EcAssessmentAddForm;
    return {
        setters:[
            function (context_1_1) {
                context_1 = context_1_1;
            },
            function (_mp_1) {
                _mp = _mp_1;
            }],
        execute: function() {
            EcAssessmentAddForm = (function () {
                function EcAssessmentAddForm($mi, dCtx, mode, assessment) {
                    this.$mi = $mi;
                    this.dCtx = dCtx;
                    this.radios = {};
                    console.log('Assessment Loaded');
                    this.spResponses = assessment;
                    this.mode = mode;
                    this.activate();
                }
                EcAssessmentAddForm.prototype.activate = function () {
                    var _this = this;
                    this.spResponses.forEach(function (resp) {
                        var radioSet = {
                            effectiveness: 'None',
                            freq: 'None',
                            displayed: true
                        };
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
                        _this.radios[resp.id] = radioSet;
                    });
                };
                EcAssessmentAddForm.prototype.checkResponse = function (response) {
                    if (this.radios[response.id].displayed === false) {
                        response.itemModelScore = 0;
                        response.mpItemResponse = _mp.EcSpItemResponse.nd;
                    }
                    else {
                        if (this.radios[response.id].effectiveness !== 'None' && this.radios[response.id].freq !== 'None') {
                            switch (this.radios[response.id].effectiveness) {
                                case 'highlyeffective':
                                    response.itemModelScore = 3;
                                    break;
                                case 'effective':
                                    response.itemModelScore = 1;
                                    break;
                                case 'ineffective':
                                    response.itemModelScore = -2;
                                    break;
                            }
                            if (this.radios[response.id].freq === 'always') {
                                if (response.itemModelScore === -1) {
                                    response.itemModelScore -= 1;
                                }
                                else {
                                    response.itemModelScore += 1;
                                }
                            }
                            switch (response.itemModelScore) {
                                case -2:
                                    response.mpItemResponse = _mp.EcSpItemResponse.iea;
                                    break;
                                case -1:
                                    response.mpItemResponse = _mp.EcSpItemResponse.ieu;
                                    break;
                                case 1:
                                    response.mpItemResponse = _mp.EcSpItemResponse.eu;
                                    break;
                                case 2:
                                    response.mpItemResponse = _mp.EcSpItemResponse.ea;
                                    break;
                                case 3:
                                    response.mpItemResponse = _mp.EcSpItemResponse.heu;
                                    break;
                                case 4:
                                    response.mpItemResponse = _mp.EcSpItemResponse.hea;
                                    break;
                            }
                        }
                    }
                };
                EcAssessmentAddForm.prototype.cancel = function () {
                    this.spResponses.forEach(function (resp) {
                        if (resp.entityAspect.entityState.isAddedModifiedOrDeleted) {
                            resp.entityAspect.rejectChanges();
                        }
                    });
                    this.$mi.dismiss('canceled');
                };
                EcAssessmentAddForm.prototype.ok = function () {
                    var _this = this;
                    this.spResponses.forEach(function (resp) {
                        _this.checkResponse(resp);
                    });
                    this.$mi.close(this.spResponses);
                };
                EcAssessmentAddForm.controllerId = 'app.core.assessment.formEdit';
                EcAssessmentAddForm.$inject = ['$uibModalInstance', context_1.default.serviceId, 'mode', 'assessment'];
                return EcAssessmentAddForm;
            })();
            exports_1("default", EcAssessmentAddForm);
        }
    }
});
