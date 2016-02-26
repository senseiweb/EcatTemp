System.register(["core/service/data/context"], function(exports_1) {
    var context_1;
    var EcFacCapstoneDetailsModal;
    return {
        setters:[
            function (context_1_1) {
                context_1 = context_1_1;
            }],
        execute: function() {
            EcFacCapstoneDetailsModal = (function () {
                function EcFacCapstoneDetailsModal($mi, dCtx) {
                    this.$mi = $mi;
                    this.dCtx = dCtx;
                    this.studentGMs = [];
                    this.assesseeByPeer = {};
                    this.assessorByPeer = {};
                    this.selectedAssess = [];
                    //this.dCtx.faculty.getStudentCapstoneDetails()
                    //    .then((retData: Array<ecat.entity.IMemberInGroup>) => {
                    //        this.studentGMs = retData;
                    //        console.log(this.studentGMs);
                    //        this.activate();
                    //    });
                }
                EcFacCapstoneDetailsModal.prototype.activate = function () {
                    var _this = this;
                    this.radioResponseType = 'Assessee';
                    this.studentGMs.forEach(function (gm) {
                        gm.groupPeers.forEach(function (peer) {
                            var results = {
                                assessment: '',
                                strat: 0
                            };
                            //var resultsAgg = 0;
                            //peer.assessorSpResponses.forEach(resp => {
                            //    results.assessment += resp.itemModelScore
                            //});
                            //var responses = peer.assessorSpResponses.filter(resp => {
                            //    if (resp.assesseeId === gm.id) { return true; }
                            //    return false;
                            //});
                            //responses.forEach(resp => {
                            //    resultsAgg += resp.itemModelScore;
                            //});
                            results.assessment = _this.getResultString(peer.statusOfPeer[gm.studentId].compositeScore);
                            results.strat = peer.assessorStratResponse[0].stratPosition;
                            //var strat = peer.assessorStratResponse.filter(strat => {
                            //    if (strat.assesseeId === gm.id) { return true; }
                            //    return false;
                            //});
                            //if (strat.length === 1) {
                            //    results.strat = strat[0].stratPosition;
                            //}
                            _this.assesseeByPeer[peer.studentId] = results;
                        });
                    });
                };
                EcFacCapstoneDetailsModal.prototype.calcAssessor = function () {
                    var _this = this;
                    if (this.assessorByPeer === null || this.assessorByPeer === undefined) {
                        this.studentGMs.forEach(function (gm) {
                            gm.groupPeers.forEach(function (peer) {
                                var results = {
                                    assessment: '',
                                    strat: 0
                                };
                                results.assessment = _this.getResultString(gm.statusOfPeer[gm.studentId].compositeScore);
                                results.strat = peer.assesseeStratResponse[0].stratPosition;
                                _this.assessorByPeer[peer.studentId] = results;
                            });
                        });
                    }
                };
                EcFacCapstoneDetailsModal.prototype.popBehaviors = function (peer) {
                    if (this.radioResponseType === 'Assessee') {
                        this.selectedAssess = peer.assessorSpResponses;
                    }
                    else if (this.radioResponseType === 'Assessor') {
                        this.selectedAssess = peer.assesseeSpResponses;
                    }
                };
                EcFacCapstoneDetailsModal.prototype.getResultString = function (respScore) {
                    if (respScore < .17) {
                        return 'Ineffective Always';
                    }
                    if (respScore >= .17 && respScore < .34) {
                        return 'Ineffective Usually';
                    }
                    if (respScore >= .34 && respScore < .5) {
                        return 'Not Displayed';
                    }
                    if (respScore >= .5 && respScore < .67) {
                        return 'Effective Usually';
                    }
                    if (respScore >= .67 && respScore < .84) {
                        return 'Effective Always';
                    }
                    if (respScore >= .84 && respScore < 1) {
                        return 'Highly Effective Usually';
                    }
                    if (respScore >= 1) {
                        return 'Highly Effective Always';
                    }
                };
                EcFacCapstoneDetailsModal.prototype.close = function () {
                    this.$mi.dismiss();
                };
                EcFacCapstoneDetailsModal.controllerId = 'app.faculty.features.groups.capstonestudentdetails';
                EcFacCapstoneDetailsModal.$inject = ['$uibModalInstance', context_1.default.serviceId];
                return EcFacCapstoneDetailsModal;
            })();
            exports_1("default", EcFacCapstoneDetailsModal);
        }
    }
});
