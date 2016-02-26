System.register(['bsGrowl'], function(exports_1) {
    var BsGrowlService;
    return {
        setters:[
            function (_1) {}],
        execute: function() {
            BsGrowlService = (function () {
                function BsGrowlService($tc) {
                    var _this = this;
                    this.$tc = $tc;
                    this.notify = function (options, settings) {
                        jQuery.notify({
                            icon: options.icon,
                            message: options.message,
                            title: options.title,
                            url: options.url,
                            target: options.target
                        }, {
                            position: settings.position,
                            type: settings.type,
                            allow_dismiss: true,
                            newest_on_top: settings.newest_on_top || false,
                            delay: settings.delay || 7000,
                            placement: settings.placement,
                            animate: {
                                enter: "animated " + settings.animate.enter,
                                exit: "animated " + settings.animate.exit
                            },
                            offset: {
                                x: 20,
                                y: 85
                            },
                            template: _this.$tc.get('Clinet/app/core/common/tpls/notifyError.tpl.html')
                        });
                    };
                }
                BsGrowlService.serviceId = 'growlService';
                BsGrowlService.$inject = ['$templateCache'];
                return BsGrowlService;
            })();
            exports_1("default", BsGrowlService);
        }
    }
});
