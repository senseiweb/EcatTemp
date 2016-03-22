import 'mCustomScroll'

export default class MalihuScrollService {
    static serviceId = 'mCustomScrollService';

    malihuScroll = (selector: angular.IAugmentedJQuery, theme: string, mousewheelaxis) => {
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
    }
}