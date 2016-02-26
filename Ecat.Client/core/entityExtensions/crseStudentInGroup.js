System.register(["core/common/mapStrings"], function(exports_1) {
    var _mp;
    var CrseStudInGrpInit, CrseStudInGrpExt, memberInGrpEntityExt;
    return {
        setters:[
            function (_mp_1) {
                _mp = _mp_1;
            }],
        execute: function() {
            CrseStudInGrpInit = (function () {
                function CrseStudInGrpInit(memberInGrpEntity) {
                    var group = memberInGrpEntity.group;
                    if (group && group.assignedSpInstr && memberInGrpEntity.groupPeers) {
                        memberInGrpEntity.getMigStatus();
                    }
                }
                return CrseStudInGrpInit;
            })();
            exports_1("CrseStudInGrpInit", CrseStudInGrpInit);
            CrseStudInGrpExt = (function () {
                function CrseStudInGrpExt() {
                    var _this = this;
                    this.statusOfPeer = {};
                    this.getMigStatus = function () {
                        _this.groupPeers.forEach(function (gm) {
                            var cummScore = 0;
                            var migStatus = {
                                assessComplete: false,
                                stratComplete: false,
                                isPeerAllComplete: false,
                                missingAssessItems: [],
                                breakout: { ineff: 0, nd: 0, eff: 0, highEff: 0 },
                                compositeScore: 0,
                                hasComment: false
                            };
                            var responseList = gm.assesseeSpResponses
                                .filter(function (response) { return response.assesseePersonId === _this.studentId && response.assessor.entityId === gm.entityId; });
                            migStatus.stratComplete = !!gm.assesseeStratResponse
                                .filter(function (strat) { return strat.assessorPersonId === _this.studentId &&
                                strat.assesseePersonId === gm.studentId &&
                                (strat.stratPosition !== null || strat.stratPosition !== undefined || strat.stratPosition !== 0); })[0];
                            migStatus.hasComment = !!gm.recipientOfComments
                                .filter(function (comment) { return comment.authorPersonId === _this.studentId &&
                                comment.recipientPersonId === gm.studentId; })[0];
                            var knownReponse = _mp.EcSpItemResponse;
                            responseList.forEach(function (response) {
                                switch (response.mpItemResponse) {
                                    case knownReponse.iea:
                                        migStatus.breakout.ineff += 1;
                                        cummScore += 0;
                                        break;
                                    case knownReponse.ieu:
                                        migStatus.breakout.ineff += 1;
                                        cummScore += 1;
                                        break;
                                    case knownReponse.nd:
                                        cummScore += 2;
                                        migStatus.breakout.nd += 1;
                                        break;
                                    case knownReponse.ea:
                                        cummScore += 3;
                                        migStatus.breakout.eff += 1;
                                        break;
                                    case knownReponse.eu:
                                        cummScore += 4;
                                        migStatus.breakout.eff += 1;
                                        break;
                                    case knownReponse.hea:
                                        cummScore += 5;
                                        migStatus.breakout.highEff += 1;
                                        break;
                                    case knownReponse.heu:
                                        cummScore += 6;
                                        migStatus.breakout.highEff += 1;
                                        break;
                                    default:
                                        break;
                                }
                            });
                            if (_this.group && _this.group.assignedSpInstr) {
                                _this.group
                                    .assignedSpInstr
                                    .inventoryCollection
                                    .forEach(function (inventoryItem) {
                                    var hasResponse = responseList.some(function (response) { return response.inventoryItemId === inventoryItem.id; });
                                    if (!hasResponse) {
                                        migStatus.missingAssessItems.push(inventoryItem.id);
                                    }
                                });
                                migStatus.compositeScore = cummScore / (_this.group.assignedSpInstr.inventoryCollection.length * 6);
                            }
                            migStatus.assessComplete = migStatus.missingAssessItems.length === 0;
                            migStatus.isPeerAllComplete = migStatus.assessComplete && migStatus.stratComplete;
                            _this.statusOfPeer[gm.entityId] = migStatus;
                        });
                    };
                }
                return CrseStudInGrpExt;
            })();
            exports_1("CrseStudInGrpExt", CrseStudInGrpExt);
            exports_1("memberInGrpEntityExt", memberInGrpEntityExt = {
                entityName: _mp.EcMapEntityType.grpMember,
                ctorFunc: CrseStudInGrpExt,
                initFunc: function (crseStudInGrp) { return new CrseStudInGrpInit(crseStudInGrp); }
            });
        }
    }
});
