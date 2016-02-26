System.register(["core/service/plugin/growlNotify", "core/common/mapStrings", "core/common/mapEnum", "moment"], function(exports_1) {
    var growlNotify_1, _mp, _mpe, moment_1;
    var EcLoggerService;
    return {
        setters:[
            function (growlNotify_1_1) {
                growlNotify_1 = growlNotify_1_1;
            },
            function (_mp_1) {
                _mp = _mp_1;
            },
            function (_mpe_1) {
                _mpe = _mpe_1;
            },
            function (moment_1_1) {
                moment_1 = moment_1_1;
            }],
        execute: function() {
            EcLoggerService = (function () {
                function EcLoggerService($log, growl) {
                    var _this = this;
                    this.$log = $log;
                    this.growl = growl;
                    this.eventList = [];
                    this.getLogFn = function (moduleId, alert) {
                        var logFuncName = alert || null;
                        switch (logFuncName) {
                            case 3 /* Success */:
                                return function (msg, data, showLog) { return _this.logSucces(msg, data, moduleId, (showLog === undefined) ? true : showLog); };
                            case 2 /* Warning */:
                                return function (msg, data, showLog) { return _this.logWarn(msg, data, moduleId, (showLog === undefined) ? true : showLog); };
                            case 1 /* Error */:
                                return function (msg, data, showLog) { return _this.logError(msg, data, moduleId, (showLog === undefined) ? true : showLog); };
                            case 0 /* Info */:
                                return function (msg, data, showLog) { return _this.logInfo(msg, data, moduleId, (showLog === undefined) ? true : showLog); };
                            default:
                                return function (msg, data, showLog) { return _this.log(msg, data, moduleId, (showLog === undefined) ? true : showLog); };
                        }
                    };
                    this.log = function (message, data, source, showLog) { return _this.logIt(message, data, null, source, showLog, null); };
                    this.logWarn = function (message, data, source, showLog) { return _this.logIt(message, data, 2 /* Warning */, source, showLog); };
                    this.logSucces = function (message, data, source, showLog) { return _this.logIt(message, data, 3 /* Success */, source, showLog); };
                    this.logError = function (message, data, source, showLog) { return _this.logIt(message, data, 1 /* Error */, source, showLog); };
                    this.logInfo = function (message, data, source, showLog) { return _this.logIt(message, data, 0 /* Info */, source, showLog); };
                }
                EcLoggerService.prototype.logIt = function (message, data, logType, source, showLog, bugId) {
                    var write = (logType === 1 /* Error */) ? this.$log.error : this.$log.log;
                    source = source ? "[" + source + "]" : '[No Source]';
                    write(source, message, data);
                    var options = {
                        message: message,
                        title: "<strong>" + source + "</strong>: "
                    };
                    var settings = {
                        newest_on_top: true,
                        allow_dismiss: true,
                        placement: { from: 'bottom', align: 'right' },
                        animate: {
                            enter: _mp.EcMapAnimationsEnum.fadeInRight,
                            exit: _mp.EcMapAnimationsEnum.fadeOutRight
                        }
                    };
                    if (showLog) {
                        var eventType;
                        switch (logType) {
                            case 1 /* Error */:
                                options.icon = "zmdi-alert-circle-o";
                                settings.placement.from = 'top';
                                settings.placement.align = 'right';
                                settings.animate.enter = _mp.EcMapAnimationsEnum.bounceInRight;
                                settings.animate.exit = _mp.EcMapAnimationsEnum.bounceOutRight;
                                settings.allow_dismiss = true;
                                settings.type = 'pastel-danger';
                                settings.delay = 10000;
                                eventType = 'Error';
                                break;
                            case 0 /* Info */:
                                options.icon = "zmdi-info-alert";
                                settings.type = 'pastel-info';
                                eventType = 'Informational';
                                break;
                            case 2 /* Warning */:
                                options.icon = "zmdi-triangle-up";
                                settings.type = 'pastel-warning';
                                eventType = 'Warning';
                                break;
                            case 3 /* Success */:
                                options.icon = "zmdi-assignment-check";
                                settings.type = 'pastel-success';
                                eventType = 'Success';
                                break;
                            default:
                                options.icon = options.icon + " zmdi-attachment-alt";
                        }
                        var event_1 = {
                            eventType: eventType,
                            eventTimeStamp: moment_1.default(new Date()),
                            source: source,
                            event: message
                        };
                        this.eventList.push(event_1);
                        this.growl.notify(options, settings);
                    }
                };
                EcLoggerService.serviceId = 'core.logger';
                EcLoggerService.$inject = ['$log', growlNotify_1.default.serviceId];
                return EcLoggerService;
            })();
            exports_1("default", EcLoggerService);
        }
    }
});
