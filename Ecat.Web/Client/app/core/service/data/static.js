System.register(["core/common/mapStrings"], function(exports_1) {
    var _mp;
    var EcLocalDataService;
    return {
        setters:[
            function (_mp_1) {
                _mp = _mp_1;
            }],
        execute: function() {
            EcLocalDataService = (function () {
                function EcLocalDataService() {
                    var _this = this;
                    this.milPaygradeGraft = {
                        civ: {
                            designator: _mp.EcMapPaygrade.civ
                        },
                        fn: {
                            designator: _mp.EcMapPaygrade.fn
                        },
                        e1: {
                            designator: _mp.EcMapPaygrade.e1,
                            usaf: {
                                rankShortName: 'AB',
                                rankLongName: 'Airman Basic'
                            },
                            usa: {
                                rankShortName: 'PVT',
                                rankLongName: 'Private'
                            },
                            usn: {
                                rankShortName: 'SR',
                                rankLongName: 'Seaman Recurit'
                            },
                            usmc: {
                                rankShortName: 'PVT',
                                rankLongName: 'Private'
                            }
                        },
                        e2: {
                            designator: _mp.EcMapPaygrade.e2,
                            usaf: {
                                rankShortName: 'Amn',
                                rankLongName: 'Airman'
                            },
                            usa: {
                                rankShortName: 'PV2',
                                rankLongName: 'Private E-2'
                            },
                            usn: {
                                rankShortName: 'SA',
                                rankLongName: 'Seaman Apprentice'
                            },
                            usmc: {
                                rankShortName: 'PFC',
                                rankLongName: 'Private First Class'
                            }
                        },
                        e3: {
                            designator: _mp.EcMapPaygrade.e3,
                            usaf: {
                                rankShortName: 'A1C',
                                rankLongName: 'Airman First Class'
                            },
                            usa: {
                                rankShortName: 'PFC',
                                rankLongName: 'Private First Class'
                            },
                            usn: {
                                rankShortName: 'SN',
                                rankLongName: 'Seaman'
                            },
                            usmc: {
                                rankShortName: 'LCpl',
                                rankLongName: 'Lance Corporal'
                            }
                        },
                        e4: {
                            designator: _mp.EcMapPaygrade.e4,
                            usaf: {
                                rankShortName: 'A1C',
                                rankLongName: 'Airman First Class'
                            },
                            usa: {
                                rankShortName: 'PFC',
                                rankLongName: 'Private First Class'
                            },
                            usn: {
                                rankShortName: 'SN',
                                rankLongName: 'Seaman'
                            },
                            usmc: {
                                rankShortName: 'LCpl',
                                rankLongName: 'Lance Corporal'
                            }
                        },
                        e5: {
                            designator: _mp.EcMapPaygrade.e5,
                            usaf: {
                                rankShortName: 'A1C',
                                rankLongName: 'Airman First Class'
                            },
                            usa: {
                                rankShortName: 'PFC',
                                rankLongName: 'Private First Class'
                            },
                            usn: {
                                rankShortName: 'SN',
                                rankLongName: 'Seaman'
                            },
                            usmc: {
                                rankShortName: 'LCpl',
                                rankLongName: 'Lance Corporal'
                            }
                        },
                        e6: {
                            designator: _mp.EcMapPaygrade.e6,
                            usaf: {
                                rankShortName: 'A1C',
                                rankLongName: 'Airman First Class'
                            },
                            usa: {
                                rankShortName: 'PFC',
                                rankLongName: 'Private First Class'
                            },
                            usn: {
                                rankShortName: 'SN',
                                rankLongName: 'Seaman'
                            },
                            usmc: {
                                rankShortName: 'LCpl',
                                rankLongName: 'Lance Corporal'
                            }
                        },
                        e7: {
                            designator: _mp.EcMapPaygrade.e7,
                            usaf: {
                                rankShortName: 'MSgt',
                                rankLongName: 'McD'
                            },
                            usa: {
                                rankShortName: 'PFC',
                                rankLongName: 'Private First Class'
                            },
                            usn: {
                                rankShortName: 'SN',
                                rankLongName: 'Seaman'
                            },
                            usmc: {
                                rankShortName: 'LCpl',
                                rankLongName: 'Lance Corporal'
                            }
                        },
                        e8: {
                            designator: _mp.EcMapPaygrade.e8,
                            usaf: {
                                rankShortName: 'A1C',
                                rankLongName: 'Airman First Class'
                            },
                            usa: {
                                rankShortName: 'PFC',
                                rankLongName: 'Private First Class'
                            },
                            usn: {
                                rankShortName: 'SN',
                                rankLongName: 'Seaman'
                            },
                            usmc: {
                                rankShortName: 'LCpl',
                                rankLongName: 'Lance Corporal'
                            }
                        },
                        e9: {
                            designator: _mp.EcMapPaygrade.e9,
                            usaf: {
                                rankShortName: 'A1C',
                                rankLongName: 'Airman First Class'
                            },
                            usa: {
                                rankShortName: 'PFC',
                                rankLongName: 'Private First Class'
                            },
                            usn: {
                                rankShortName: 'SN',
                                rankLongName: 'Seaman'
                            },
                            usmc: {
                                rankShortName: 'LCpl',
                                rankLongName: 'Lance Corporal'
                            }
                        }
                    };
                    this.updatePayGradeList = function (user) {
                        var payGradeList = [];
                        var milPayGrade = _this.milPaygradeGraft;
                        if (!user || !user.mpAffiliation) {
                            for (var grade in milPayGrade) {
                                if (milPayGrade.hasOwnProperty(grade)) {
                                    if (milPayGrade[grade] === null)
                                        return;
                                    var designator = milPayGrade[grade]['designator'];
                                    payGradeList.push({
                                        pg: designator,
                                        displayName: designator
                                    });
                                }
                            }
                            return { user: user, paygradelist: payGradeList };
                        }
                        else {
                            user.mpComponent = user.mpAffiliation === _mp.EcMapAffiliation.none ? _mp.EcMapComponent.none : user.mpComponent;
                            user.mpPaygrade = user.mpAffiliation === _mp.EcMapAffiliation.none ? _this.milPaygradeGraft.civ.designator : user.mpPaygrade;
                            var selectedAffiliation = user.mpAffiliation === _mp.EcMapAffiliation.uscg ? _mp.EcMapAffiliation.usn : user.mpAffiliation === _mp.EcMapAffiliation.none ? _this.milPaygradeGraft.civ.designator : user.mpAffiliation;
                            var affilList = _mp.EcMapAffiliation;
                            var affilKey;
                            for (var affil in affilList) {
                                if (affilList.hasOwnProperty(affil)) {
                                    if (affilList[affil] === selectedAffiliation) {
                                        affilKey = affil;
                                    }
                                }
                            }
                            for (var grade in milPayGrade) {
                                if (milPayGrade.hasOwnProperty(grade)) {
                                    if (milPayGrade[grade] === null)
                                        return;
                                    var designator = milPayGrade[grade]['designator'];
                                    var displayName = (affilKey && milPayGrade[grade][affilKey]) ? milPayGrade[grade]['designator'] + ": " + milPayGrade[grade][affilKey]['rankLongName'] : milPayGrade[grade]['designator'];
                                    payGradeList.push({
                                        pg: designator,
                                        displayName: displayName
                                    });
                                }
                            }
                        }
                        return { user: user, paygradelist: payGradeList };
                    };
                }
                Object.defineProperty(EcLocalDataService.prototype, "edLevels", {
                    get: function () {
                        var edlevels = [];
                        var lclEdLevel = _mp.EcMapEdLevel;
                        for (var edl in lclEdLevel) {
                            if (lclEdLevel.hasOwnProperty(edl)) {
                                edlevels.push(lclEdLevel[edl]);
                            }
                        }
                        return edlevels;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(EcLocalDataService.prototype, "milAffil", {
                    get: function () {
                        var affilArray = [];
                        var affiliations = _mp.EcMapAffiliation;
                        for (var prop in affiliations) {
                            if (affiliations.hasOwnProperty(prop)) {
                                affilArray.push({ prop: prop, value: affiliations[prop] });
                            }
                        }
                        return affilArray;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(EcLocalDataService.prototype, "milComponent", {
                    get: function () {
                        var componentArray = [];
                        var components = _mp.EcMapComponent;
                        for (var prop in components) {
                            if (components.hasOwnProperty(prop)) {
                                componentArray.push({ prop: prop, value: components[prop] });
                            }
                        }
                        return componentArray;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(EcLocalDataService.prototype, "milPaygradeList", {
                    get: function () {
                        var paygradeArray = [];
                        var paygrades = _mp.EcMapPaygrade;
                        for (var prop in paygrades) {
                            if (paygrades.hasOwnProperty(prop)) {
                                paygradeArray.push({ pg: prop, displayName: paygrades[prop] });
                            }
                        }
                        return paygradeArray;
                    },
                    enumerable: true,
                    configurable: true
                });
                EcLocalDataService.serviceId = 'data.local';
                return EcLocalDataService;
            })();
            exports_1("default", EcLocalDataService);
        }
    }
});
