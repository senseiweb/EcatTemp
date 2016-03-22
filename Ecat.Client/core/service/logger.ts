import IGrowl from "core/service/plugin/growlNotify"
import * as _mp from "core/common/mapStrings"
import * as _mpe from "core/common/mapEnum"
import moment from "moment"

export default class EcLoggerService {
    static serviceId = 'core.logger';
    static $inject = ['$log', IGrowl.serviceId];
    eventList: Array<ecat.SigEvent> = [];

    constructor(private $log: angular.ILogService, private growl: IGrowl) { }

    getLogFn = (moduleId: string, alert: _mpe.AlertTypes) => {
        const logFuncName = alert || null;
        switch (logFuncName) {

            case _mpe.AlertTypes.Success:
                return (msg: string, data: any, showLog) => this.logSucces(msg, data, moduleId, (showLog === undefined) ? true : showLog);
            case _mpe.AlertTypes.Warning:
                return (msg: string, data: any, showLog) => this.logWarn(msg, data, moduleId, (showLog === undefined) ? true : showLog);
            case _mpe.AlertTypes.Error:
                return (msg: string, data: any, showLog) => this.logError(msg, data, moduleId, (showLog === undefined) ? true : showLog);
            case _mpe.AlertTypes.Info:
                return (msg: string, data: any, showLog) => this.logInfo(msg, data, moduleId, (showLog === undefined) ? true : showLog);
            default:
                return (msg: string, data: any, showLog) => this.log(msg, data, moduleId, (showLog === undefined) ? true : showLog);
        }
    }

    log = (message: string, data: any, source: string, showLog: boolean) => this.logIt(message, data, null, source, showLog, null);

    logWarn = (message: string, data: any, source: string, showLog: boolean) => this.logIt(message, data, _mpe.AlertTypes.Warning, source, showLog);

    logSucces = (message: string, data: any, source: string, showLog: boolean) => this.logIt(message, data, _mpe.AlertTypes.Success, source, showLog);

    logError = (message: string, data: any, source: string, showLog: boolean) => this.logIt(message, data, _mpe.AlertTypes.Error, source, showLog);

    logInfo = (message: string, data: any, source: string, showLog: boolean) => this.logIt(message, data, _mpe.AlertTypes.Info, source, showLog);

    private logIt(message: string, data: any, logType: _mpe.AlertTypes, source?: string, showLog?: boolean, bugId?: any) {

        const write = (logType === _mpe.AlertTypes.Error) ? this.$log.error : this.$log.log;

        source = source ? `[${source}]` : '[No Source]';

        write(source, message, data);

        const options: NotifyOptions = {
            message: message,
            title: `<strong>${source}</strong>: `
        };

        const settings: NotifySettings = {
            newest_on_top: true,
            allow_dismiss: true,
            placement: { from: 'bottom', align: 'right' },
            animate: {
                enter: _mp.MpAnimation.fadeInRight,
                exit: _mp.MpAnimation.fadeOutRight
            }
        };

        if (showLog) {
            let eventType: string;

            switch (logType) {
                case _mpe.AlertTypes.Error:
                    options.icon = `zmdi-alert-circle-o`;
                    settings.placement.from = 'top';
                    settings.placement.align = 'right';
                    settings.animate.enter = _mp.MpAnimation.bounceInRight;
                    settings.animate.exit = _mp.MpAnimation.bounceOutRight;
                    settings.allow_dismiss = true;
                    settings.type = 'pastel-danger';
                    settings.delay = 10000;
                    eventType = 'Error';
                    break;
                case _mpe.AlertTypes.Info:
                    options.icon = `zmdi-info-alert`;
                    settings.type = 'pastel-info';
                    eventType = 'Informational';
                    break;
                case _mpe.AlertTypes.Warning:
                    options.icon = `zmdi-triangle-up`;
                    settings.type = 'pastel-warning';
                    eventType = 'Warning';
                    break;
                case _mpe.AlertTypes.Success:
                    options.icon = `zmdi-assignment-check`;
                    settings.type = 'pastel-success';
                    eventType = 'Success';
                    break;
                default:
                    options.icon = `${options.icon} zmdi-attachment-alt`;

            }

            const event: ecat.SigEvent = {
                eventType: eventType,
                eventTimeStamp: moment(new Date()),
                source: source,
                event: message
            }

            this.eventList.push(event);
            this.growl.notify(options, settings);
        }

    }

}