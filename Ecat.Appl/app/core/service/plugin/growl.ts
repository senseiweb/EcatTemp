import 'bsGrowl'

export default class BsGrowlService {
    static serviceId = 'growlService';
    private defaultTemplate = '<div data-notify="container" class="col-xs-11 col-sm-4 alert alert-{0} growl-animated" role="alert"><button type="button" aria-hidden="true" class="close" data-notify="dismiss">&times;</button><span data-notify="icon"></span> <span data-notify="title">{1}</span> <span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div></div><a href="{3}" target="{4}" data-notify="url"></a></div>';

    notify = (options: NotifyOptions, settings: NotifySettings) => {
        jQuery.notify(
            {
                icon: options.icon,
                message: options.message,
                title: options.title,
                url: options.url,
                target: options.target
            },
            {
                position: settings.position,
                type: settings.type,
                allow_dismiss: settings.allow_dismiss,
                newest_on_top: settings.newest_on_top || false,
                delay: settings.delay || 6000,
                placement: settings.placement,
                animate: {
                    enter: `animated ${settings.animate.enter}`,
                    exit: `animated ${settings.animate.exit}`
                },
                offset: {
                    x: 20,
                    y: 85
                },
                template: settings.template || this.defaultTemplate
            }
        );
    }
}

