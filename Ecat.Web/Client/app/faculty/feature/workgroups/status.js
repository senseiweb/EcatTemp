System.register(["core/service/data/context"], function(exports_1) {
    var context_1;
    var EcFacViewStatusModal;
    return {
        setters:[
            function (context_1_1) {
                context_1 = context_1_1;
            }],
        execute: function() {
            EcFacViewStatusModal = (function () {
                function EcFacViewStatusModal($mi, dCtx, selectedGroup) {
                    this.$mi = $mi;
                    this.dCtx = dCtx;
                    this.selectedGroup = selectedGroup;
                    this.spStatuses = {};
                    this.group = selectedGroup;
                    this.activate();
                }
                EcFacViewStatusModal.prototype.activate = function () {
                    var _this = this;
                    this.group.groupMembers.forEach(function (gm) {
                        var ovStatus = {
                            self: false,
                            peer: 0,
                            strats: 0,
                            hEGiven: 0,
                            eGiven: 0,
                            iEGiven: 0,
                            nDGiven: 0
                        };
                        gm.groupPeers.forEach(function (peer) {
                            if (gm.statusOfPeer[peer.studentId].assessComplete) {
                                if (peer.studentId === gm.studentId) {
                                    ovStatus.self = true;
                                }
                                else {
                                    ovStatus.peer += 1;
                                }
                            }
                            if (gm.statusOfPeer[peer.studentId].stratComplete) {
                                ovStatus.strats += 1;
                            }
                            ovStatus.hEGiven += gm.statusOfPeer[peer.studentId].breakout.highEff;
                            ovStatus.eGiven += gm.statusOfPeer[peer.studentId].breakout.eff;
                            ovStatus.iEGiven += gm.statusOfPeer[peer.studentId].breakout.ineff;
                            ovStatus.nDGiven += gm.statusOfPeer[peer.studentId].breakout.nd;
                        });
                        _this.spStatuses[gm.studentId] = ovStatus;
                    });
                };
                EcFacViewStatusModal.prototype.close = function () {
                    this.$mi.close();
                };
                EcFacViewStatusModal.controllerId = 'app.faculty.features.groups.viewStatus';
                EcFacViewStatusModal.$inject = ['$uibModalInstance', context_1.default.serviceId, 'selectedGroup'];
                return EcFacViewStatusModal;
            })();
            exports_1("default", EcFacViewStatusModal);
        }
    }
});
