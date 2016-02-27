System.register(["core/service/data/emfactory", "core/common/commonService", "core/common/mapStrings"], function(exports_1) {
    var emfactory_1, commonService_1, _mp;
    var EcDataContext;
    return {
        setters:[
            function (emfactory_1_1) {
                emfactory_1 = emfactory_1_1;
            },
            function (commonService_1_1) {
                commonService_1 = commonService_1_1;
            },
            function (_mp_1) {
                _mp = _mp_1;
            }],
        execute: function() {
            EcDataContext = (function () {
                function EcDataContext($rs, c, emFactory) {
                    var _this = this;
                    this.c = c;
                    this.loadedManagers = [];
                    this.repoNames = [
                        'static',
                        this.fixUpResourceName(_mp.EcMapApiResource.user),
                        this.fixUpResourceName(_mp.EcMapApiResource.sa),
                        this.fixUpResourceName(_mp.EcMapApiResource.student),
                        this.fixUpResourceName(_mp.EcMapApiResource.courseAdmin),
                        this.fixUpResourceName(_mp.EcMapApiResource.designer),
                        this.fixUpResourceName(_mp.EcMapApiResource.faculty)
                    ];
                    this.repoNames.forEach(function (name) {
                        Object.defineProperty(_this, name, {
                            configurable: true,
                            get: function () {
                                var repo = emFactory.getRepo(name);
                                Object.defineProperty(this, name, {
                                    value: repo,
                                    configurable: false,
                                    enumerable: true
                                });
                                return repo;
                            }
                        });
                    });
                    $rs.$on(c.coreCfg.coreApp.events.addManager, function (event, data) {
                        _this.loadedManagers.push({ module: data[0].data.module, mgr: data[0].data.mgr });
                        event.preventDefault();
                    });
                }
                EcDataContext.prototype.clearManagers = function () {
                    this.loadedManagers.forEach(function (holder) {
                        holder.mgr.clear();
                    });
                };
                EcDataContext.prototype.fixUpResourceName = function (name) {
                    var firstChar = name.substr(0, 1).toLowerCase();
                    return firstChar + name.substr(1);
                };
                EcDataContext.prototype.unsavedChanges = function () {
                    var changesStatus = [];
                    this.loadedManagers.forEach(function (holder) {
                        changesStatus.push({ name: holder.module, hasChanges: holder.mgr.hasChanges() });
                    });
                    return changesStatus.filter(function (status) { return status.hasChanges; });
                };
                EcDataContext.prototype.logoutUser = function () {
                    this.clearManagers();
                    this.user.persona = null;
                    this.user.token.auth = null;
                    this.user.token.warning = null;
                    this.user.token.expire = null;
                    this.user.token.userEmail = null;
                    this.user.token.password = null;
                    this.user.userStatic = null;
                    localStorage.removeItem('ECAT:TOKEN');
                    sessionStorage.removeItem('ECAT:TOKEN');
                    this.user.isLoggedIn = false;
                    this.user;
                };
                EcDataContext.serviceId = 'data.context';
                EcDataContext.$inject = ['$rootScope', commonService_1.default.serviceId, emfactory_1.default.serviceId];
                return EcDataContext;
            })();
            exports_1("default", EcDataContext);
        }
    }
});
