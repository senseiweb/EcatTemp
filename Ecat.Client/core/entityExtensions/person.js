System.register(["core/service/data/static", "core/common/mapStrings"], function(exports_1) {
    var static_1, _mp;
    var PersonInitializer, PersonClientExtended, personConfig;
    return {
        setters:[
            function (static_1_1) {
                static_1 = static_1_1;
            },
            function (_mp_1) {
                _mp = _mp_1;
            }],
        execute: function() {
            PersonInitializer = (function () {
                function PersonInitializer(person) {
                    if (person.avatarLocation === null) {
                        var imgDirectory = '/Client/content/img/avatars/';
                        person.defaultAvatarLocation = imgDirectory + "default.png";
                    }
                }
                return PersonInitializer;
            })();
            exports_1("PersonInitializer", PersonInitializer);
            PersonClientExtended = (function () {
                function PersonClientExtended() {
                }
                Object.defineProperty(PersonClientExtended.prototype, "saluatation", {
                    get: function () {
                        var paygradeList = static_1.default;
                        if (!this.mpPaygrade) {
                            return null;
                        }
                        if (this.mpPaygrade === _mp.EcMapPaygrade.civ) {
                            return 'Civ';
                        }
                        if (this.mpPaygrade === _mp.EcMapPaygrade.fn) {
                            return 'FN';
                        }
                        if (!this.mpPaygrade || !this.mpInstituteRole || !this.mpComponent) {
                            return null;
                        }
                        for (var paygrade in paygradeList) {
                            if (!paygradeList.hasOwnProperty(paygrade)) {
                                return null;
                            }
                            if (paygrade.designator === this.mpComponent) {
                                switch (this.mpAffiliation) {
                                    case _mp.EcMapAffiliation.usa:
                                        return paygrade.designator.usa.rankShortName;
                                    case _mp.EcMapAffiliation.usaf:
                                        return paygrade.designator.usaf.rankShortName;
                                    case _mp.EcMapAffiliation.usn:
                                    case _mp.EcMapAffiliation.uscg:
                                        return paygrade.designator.usn.rankShortName;
                                    case _mp.EcMapAffiliation.usmc:
                                        return paygrade.designator.usmc.rankShortName;
                                    default:
                                        return null;
                                }
                            }
                        }
                        return null;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PersonClientExtended.prototype, "prettyInstituteRole", {
                    get: function () {
                        switch (this.mpInstituteRole) {
                            case _mp.EcMapInstituteRole.student:
                                return 'Student';
                            case _mp.EcMapInstituteRole.faculty:
                                return 'Facilatator';
                            case _mp.EcMapInstituteRole.external:
                                return 'External User';
                            default:
                                return null;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                return PersonClientExtended;
            })();
            exports_1("PersonClientExtended", PersonClientExtended);
            exports_1("personConfig", personConfig = {
                entityName: _mp.EcMapEntityType.person,
                ctorFunc: PersonClientExtended,
                initFunc: function (personEntity) { return new PersonInitializer(personEntity); }
            });
        }
    }
});
