import IGrowl from 'core/service/plugin/growl'
import {EcMapAlertType as AlertType, EcMapAnimationsEnum as AnimType} from 'appVars'
import moment from "moment"

export default class EcLoggerService {
    static serviceId = 'core.logger';
    static $inject = ['$log', IGrowl.serviceId];
    eventList: Array<ecat.SigEvent> = [];


    constructor(private $log: angular.ILogService, private growl: IGrowl) { }
        
    getLogFn = (moduleId: string, alert: AlertType) => {
        const logFuncName = alert || null;
        switch (logFuncName) {

            case AlertType.success:
                return (msg: string, data: any, showLog) => this.logSucces(msg, data, moduleId, (showLog === undefined) ? true : showLog); 
            case AlertType.warning:
                return (msg: string, data: any, showLog) => this.logWarn(msg, data, moduleId, (showLog === undefined) ? true : showLog);  
            case AlertType.danger:
                return (msg: string, data: any, showLog) => this.logError(msg, data, moduleId, (showLog === undefined) ? true : showLog);     
            case AlertType.info:
                return (msg: string, data: any, showLog) => this.logInfo(msg, data, moduleId, (showLog === undefined) ? true : showLog);
            default:
                return (msg: string, data: any, showLog) => this.log(msg, data, moduleId, (showLog === undefined) ? true : showLog);
        }
    }

    log = (message: string, data: any, source: string, showLog: boolean) => this.logIt(message, data, null, source, showLog, null);

    logWarn = (message: string, data: any, source: string, showLog: boolean) => this.logIt(message, data, AlertType.warning, source, showLog);

    logSucces = (message: string, data: any, source: string, showLog: boolean) => this.logIt(message, data, AlertType.success, source, showLog);

    logError = (message: string, data: any, source: string, showLog: boolean) => this.logIt(message, data, AlertType.danger, source, showLog);

    logInfo = (message: string, data: any, source: string, showLog: boolean) => this.logIt(message, data, AlertType.info, source, showLog);
    
    private logIt(message: string, data: any, logType: AlertType, source?: string, showLog?: boolean, bugId?: any) {

        const write = (logType === AlertType.danger) ? this.$log.error : this.$log.log;

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
                enter: AnimType.fadeInRight,
                exit: AnimType.fadeOutRight
            }
        };

        if (showLog) {
            let eventType: string;
   
            switch (logType) {
                case AlertType.danger:
                    options.icon = `zmdi-alert-circle-o`;
                    settings.placement.from = 'top';
                    settings.placement.align = 'right';
                    settings.animate.enter = AnimType.bounceInRight;
                    settings.animate.exit = AnimType.bounceOutRight;
                    settings.allow_dismiss = true;
                    settings.type = 'pastel-danger';
                    settings.delay = 10000;
                    eventType = 'Error';
                    break;
                case AlertType.info:
                    options.icon = `zmdi-info-alert`;
                    settings.type = 'pastel-info';
                    eventType = 'Informational';
                    break;
                case AlertType.warning:
                    options.icon = `zmdi-triangle-up`;
                    settings.type = 'pastel-warning';
                    eventType = 'Warning';
                    break;
                case AlertType.success:
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