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
                    this.mode = mode;
                    this.spResponses = assessment.sort(sortResponses);
                    function sortResponses(first, second) {
                        if (first.inventoryItem.displayOrder > second.inventoryItem.displayOrder) {
                            return 1;
                        }
                        if (first.inventoryItem.displayOrder < second.inventoryItem.displayOrder) {
                            return -1;
                        }
                    }
                    this.activeResponse = this.spResponses[0];
                    this.notDisplayed = false;
                    this.radioEffectiveness = 'None';
                    this.radioFreq = 'None';
                }
                EcAssessmentAddForm.prototype.pageCheck = function (response) {
                    if (response.mpItemResponse === null) {
                        if (response.inventoryItem.displayOrder !== (this.activeResponse.inventoryItem.displayOrder + 1)) {
                            var find = this.spResponses.filter(function (resp) {
                                if (resp.inventoryItem.displayOrder === (response.inventoryItem.displayOrder - 1)) {
                                    return true;
                                }
                                return false;
                            });
                            if (find[0].mpItemResponse !== null) {
                                this.checkResponse(response);
                            }
                        }
                        else {
                            this.checkResponse(response);
                        }
                    }
                    else {
                        this.checkResponse(response);
                    }
                };
                EcAssessmentAddForm.prototype.checkResponse = function (response) {
                    var switchActive = false;
                    if (this.notDisplayed === true) {
                        this.activeResponse.itemModelScore = 0;
                        this.activeResponse.mpItemResponse = _mp.EcSpItemResponse.nd;
                        switchActive = true;
                    }
                    else {
                        if (this.radioEffectiveness !== 'None' && this.radioFreq !== 'None') {
                            switch (this.radioEffectiveness) {
                                case 'highlyeffective':
                                    this.activeResponse.itemModelScore = 3;
                                    break;
                                case 'effective':
                                    this.activeResponse.itemModelScore = 1;
                                    break;
                                case 'ineffective':
                                    this.activeResponse.itemModelScore = -2;
                                    break;
                            }
                            if (this.radioFreq === 'always') {
                                if (this.activeResponse.itemModelScore === -1) {
                                    this.activeResponse.itemModelScore -= 1;
                                }
                                else {
                                    this.activeResponse.itemModelScore += 1;
                                }
                            }
                            switch (this.activeResponse.itemModelScore) {
                                case -2:
                                    this.activeResponse.mpItemResponse = _mp.EcSpItemResponse.iea;
                                    break;
                                case -1:
                                    this.activeResponse.mpItemResponse = _mp.EcSpItemResponse.ieu;
                                    break;
                                case 1:
                                    this.activeResponse.mpItemResponse = _mp.EcSpItemResponse.eu;
                                    break;
                                case 2:
                                    this.activeResponse.mpItemResponse = _mp.EcSpItemResponse.ea;
                                    break;
                                case 3:
                                    this.activeResponse.mpItemResponse = _mp.EcSpItemResponse.heu;
                                    break;
                                case 4:
                                    this.activeResponse.mpItemResponse = _mp.EcSpItemResponse.hea;
                                    break;
                            }
                            switchActive = true;
                        }
                    }
                    if (switchActive || (response !== null && response.inventoryItem.displayOrder < this.activeResponse.inventoryItem.displayOrder)) {
                        this.switchActive(response);
                    }
                };
                EcAssessmentAddForm.prototype.switchActive = function (response) {
                    var _this = this;
                    var editing = false;
                    if (response === null) {
                        var find = this.spResponses.filter(function (resp) {
                            if (resp.inventoryItem.displayOrder === (_this.activeResponse.inventoryItem.displayOrder + 1)) {
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
                        switch (this.activeResponse.itemModelScore) {
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
                                if (this.activeResponse.mpItemResponse === null) {
                                    this.notDisplayed = false;
                                    this.radioEffectiveness = 'None';
                                    this.radioFreq = 'None';
                                    break;
                                }
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
                };
                EcAssessmentAddForm.prototype.cancel = function () {
                    this.spResponses.forEach(function (resp) {
                        if (resp.entityAspect.entityState.isAddedModifiedOrDeleted) {
                            resp.entityAspect.rejectChanges();
                        }
                    });
                    this.$mi.dismiss('canceled');
                };
                EcAssessmentAddForm.prototype.save = function () {
                    this.$mi.close(this.spResponses);
                };
                EcAssessmentAddForm.controllerId = 'app.core.assessment.formAdd';
                EcAssessmentAddForm.$inject = ['$uibModalInstance', context_1.default.serviceId, 'mode', 'assessment'];
                return EcAssessmentAddForm;
            })();
            exports_1("default", EcAssessmentAddForm);
        }
    }
});
