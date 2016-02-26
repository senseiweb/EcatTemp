System.register(['mCustomScroll'], function(exports_1) {
    var MalihuScrollService;
    return {
        setters:[
            function (_1) {}],
        execute: function() {
            MalihuScrollService = (function () {
                function MalihuScrollService() {
                    this.malihuScroll = function (selector, theme, mousewheelaxis) {
                        jQuery(selector).mCustomScrollbar({
                            theme: theme,
                            scrollInertia: 100,
                            axis: 'yx',
                            mousewheel: {
                                enable: true,
                                axis: mousewheelaxis,
                                preventDefault: true
                            }
                        });
                    };
                }
                MalihuScrollService.serviceId = 'mCustomScrollService';
                return MalihuScrollService;
            })();
            exports_1("default", MalihuScrollService);
        }
    }
});
