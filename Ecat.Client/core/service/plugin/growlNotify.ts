import 'bsGrowl'

export default class BsGrowlService {
    static serviceId = 'growlService';
    static $inject = ['$templateCache'];

    constructor(private $tc: angular.ITemplateCacheService) { }

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
                allow_dismiss: true,
                newest_on_top: settings.newest_on_top || false,
                delay: settings.delay || 7000,
                placement: settings.placement,
                animate: {
                    enter: `animated ${settings.animate.enter}`,
                    exit: `animated ${settings.animate.exit}`
                },
                offset: {
                    x: 20,
                    y: 85
                },
                template: this.$tc.get('Clinet/app/core/common/tpls/notifyError.tpl.html') as string
            }
        );
    }
}

