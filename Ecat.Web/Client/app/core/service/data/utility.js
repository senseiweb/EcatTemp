System.register(['breezeSaveError', "core/common/commonService", "core/service/data/emFactory", "core/service/data/context", "core/common/mapEnum"], function(exports_1) {
    var commonService_1, emFactory_1, context_1, _mpe;
    var EcUtilityRepoServices;
    return {
        setters:[
            function (_1) {},
            function (commonService_1_1) {
                commonService_1 = commonService_1_1;
            },
            function (emFactory_1_1) {
                emFactory_1 = emFactory_1_1;
            },
            function (context_1_1) {
                context_1 = context_1_1;
            },
            function (_mpe_1) {
                _mpe = _mpe_1;
            }],
        execute: function() {
            EcUtilityRepoServices = (function () {
                function EcUtilityRepoServices(inj, loggerId, endPoint, entityExtCfgs) {
                    var _this = this;
                    this.loggerId = loggerId;
                    this.endPoint = endPoint;
                    this.entityExtCfgs = entityExtCfgs;
                    this.isLoaded = {};
                    this.mgrLoaded = false;
                    this.saveInProgress = false;
                    this.getManager = function (factory) {
                        _this.manager = factory.getNewManager(_this.endPoint, _this.entityExtCfgs);
                        _this.c.broadcast(_this.c.coreCfg.coreApp.events.addManager, { data: { module: _this.endPoint, mgr: _this.manager } });
                        _this.c.$rootScope.$on(_this.c.coreCfg.coreApp.events.managerLoaded, function (event, data) {
                            if (data[0].mgrName === _this.endPoint) {
                                _this.mgrLoaded = true;
                                _this.registerTypes(_this.apiResources);
                            }
                        });
                    };
                    this.queryLocal = function (resource, ordering, predicate) {
                        return _this.query.from(resource)
                            .orderBy(ordering)
                            .where(predicate)
                            .using(_this.manager)
                            .executeLocally();
                    };
                    this.queryFailed = function (error) {
                        var msg = _this.loggerId + " Error querying data: " + (error ? (error.message || error.statusText) : 'Unknown Reason');
                        _this.c.logger.logError(msg, error, 'Query Result', false);
                        var ecatError = {
                            errorMessage: msg,
                            errorType: 1 /* GeneralServerError */
                        };
                        return _this.c.$q.reject(ecatError);
                    };
                    this.registerTypes = function (resourcesToRegister) {
                        _this.emf.registerResourceTypes(_this.manager.metadataStore, resourcesToRegister);
                    };
                    this.saveChanges = function () {
                        //TODO: Add a check for token still valid before change
                        if (!_this.manager.hasChanges()) {
                            return _this.c.$q.reject('Nothing to save!');
                        }
                        if (_this.saveInProgress) {
                            return _this.c.$q.reject('Sorry, already in a save operation...Please wait');
                        }
                        _this.c.broadcast(_this.c.coreCfg.coreApp.events.saveChangesEvent, { inflight: true });
                        _this.saveInProgress = true;
                        return _this.manager.saveChanges()
                            .then(function (result) {
                            _this.log.info('Save Results', result, false);
                            return result;
                        })
                            .catch(_this.saveFailed)
                            .finally(function () {
                            _this.saveInProgress = false;
                            _this.c.broadcast(_this.c.coreCfg.coreApp.events.saveChangesEvent, { inflight: false });
                        });
                    };
                    this.saveFailed = function (error) {
                        var msg = "[Saved Failed] " + breeze.saveErrorMessageService.getErrorMessage(error);
                        _this.c.logger.logError(msg, error, 'Save Error', false);
                        error.msg = msg;
                        return _this.c.$q.reject(error);
                    };
                    var dCtx = inj.get(context_1.default.serviceId);
                    var c = inj.get(commonService_1.default.serviceId);
                    var emf = inj.get(emFactory_1.default.serviceId);
                    this.query = new breeze.EntityQuery();
                    this.c = c;
                    this.log = c.getAllLoggers(this.loggerId);
                    this.dCtx = dCtx;
                    this.emf = emf;
                    this.mgrLoaded = false;
                    this.getManager(emf);
                }
                EcUtilityRepoServices.prototype.addResources = function (apiResources) {
                    this.apiResources = apiResources;
                };
                EcUtilityRepoServices.prototype.loadManager = function (apiResources) {
                    var _this = this;
                    return this.manager.fetchMetadata()
                        .then(function () {
                        _this.registerTypes(apiResources);
                    })
                        .catch(this.queryFailed);
                };
                return EcUtilityRepoServices;
            })();
            exports_1("default", EcUtilityRepoServices);
        }
    }
});
