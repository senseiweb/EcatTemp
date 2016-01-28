import IGrowl from 'core/service/plugin/growl'
import * as appVar from "appVars"
import moment from "moment"

export default class EcLoggerService {
    static serviceId = 'core.logger';
    static $inject = ['$log', IGrowl.serviceId];
    eventList: Array<ecat.SigEvent> = [];

    constructor(private $log: angular.ILogService, private growl: IGrowl) { }
        
    getLogFn = (moduleId: string, alert: appVar.EcMapAlertType) => {
        const logFuncName = alert || null;
        switch (logFuncName) {

            case appVar.EcMapAlertType.success:
                return (msg: string, data: any, showLog) => this.logSucces(msg, data, moduleId, (showLog === undefined) ? true : showLog); 
            case appVar.EcMapAlertType.warning:
                return (msg: string, data: any, showLog) => this.logWarn(msg, data, moduleId, (showLog === undefined) ? true : showLog);  
            case appVar.EcMapAlertType.danger:
                return (msg: string, data: any, showLog) => this.logError(msg, data, moduleId, (showLog === undefined) ? true : showLog);     
            case appVar.EcMapAlertType.info:
                return (msg: string, data: any, showLog) => this.logInfo(msg, data, moduleId, (showLog === undefined) ? true : showLog);
            default:
                return (msg: string, data: any, showLog) => this.log(msg, data, moduleId, (showLog === undefined) ? true : showLog);
        }
    }

    log = (message: string, data: any, source: string, showLog: boolean) => this.logIt(message, data, null, source, showLog, null);

    logWarn = (message: string, data: any, source: string, showLog: boolean) => this.logIt(message, data, appVar.EcMapAlertType.warning, source, showLog);

    logSucces = (message: string, data: any, source: string, showLog: boolean) => this.logIt(message, data, appVar.EcMapAlertType.success, source, showLog);

    logError = (message: string, data: any, source: string, showLog: boolean) => this.logIt(message, data, appVar.EcMapAlertType.danger, source, showLog);

    logInfo = (message: string, data: any, source: string, showLog: boolean) => this.logIt(message, data, appVar.EcMapAlertType.info, source, showLog);
    
    private logIt(message: string, data: any, logType: appVar.EcMapAlertType, source?: string, showLog?: boolean, bugId?: any) {

        const write = (logType === appVar.EcMapAlertType.danger) ? this.$log.error : this.$log.log;

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
            type: logType as string,
            animate: {
                enter: appVar.EcMapAnimationsEnum.fadeInRight,
                exit: appVar.EcMapAnimationsEnum.fadeOutRight
            }
        };

        if (showLog) {
            let eventType: string;
   
            switch (logType) {
                case appVar.EcMapAlertType.danger:
                    options.icon = `zmdi-alert-circle-o`;
                    settings.placement.from = 'top';
                    settings.placement.align = 'right';
                    settings.animate.enter = appVar.EcMapAnimationsEnum.bounceInRight;
                    settings.animate.exit = appVar.EcMapAnimationsEnum.bounceOutRight;
                    settings.allow_dismiss = true;
                    settings.type = 'pastel-danger';
                    settings.delay = 10000;
                    eventType = 'Error';
                    break;
                case appVar.EcMapAlertType.info:
                    options.icon = `zmdi-info-alert`;
                    settings.type = 'pastel-info';
                    eventType = 'Informational';
                    break;
                case appVar.EcMapAlertType.warning:
                    options.icon = `zmdi-triangle-up`;
                    settings.type = 'pastel-warning';
                    eventType = 'Warning';
                    break;
                case appVar.EcMapAlertType.success:
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