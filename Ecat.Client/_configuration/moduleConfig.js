var moduleConfiguraton = {
    "baseURL": 'Client/',
    "map": {
        "angular": '_vendor/bower/angular/angular.js',
        "animate": '_vendor/bower/angular-animate/angular-animate.min.js',
        "breeze": '_vendor/bower/breeze-client/breeze.debug.js',
        "breezeNg": '_vendor/bower/breeze-client/build/adapters/breeze.bridge.angular.js',
        "breezeSaveError": '_vendor/bower/breeze-client-labs/breeze.saveErrorExtensions.js',
        "bsGrowl": '_vendor/bower/remarkable-bootstrap-notify/bootstrap-notify.js',
        "flot": '_vendor/flot/jquery.flot.js',
        "flotPie": '_vendor/flot/jquery.flot.pie.js',
        "flotResize": '_vendor/flot/jquery.flot.resize.js',
        "flotTooltip": '_vendor/flot/jquery.flot.tooltip.js',
        "inputMask": '_vendor/bower/jquery-mask-plugin/dist/jquery.mask.min.js',
        "jMouseWheel": '_vendor/bower/jquery-mousewheel/jquery.mousewheel.min.js',
        "jquery": '_vendor/bower/jquery/dist/jquery.min.js',
        "loadingBar": '_vendor/angular-loading-bar/src/loading-bar.js',
        "mCustomScroll": '_vendor/bower/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.js',
        "moment": '_vendor/bower/moment/moment.js',
        "ngMessage": '_vendor/bower/angular-messages/angular-messages.min.js',
        "ngSanitize": '_vendor/bower/angular-sanitize/angular-sanitize.js',
        "ngTable": '_vendor/bower/ng-table/dist/ng-table.min.js',
        "ocLazyLoad": '_vendor/bower/oclazyload/dist/ocLazyLoad.js',
        "sweetalert": '_vendor/bower/sweetalert/dist/sweetalert.min.js',
        "templates": 'app/templates.js',
        "textNgRangy": '_vendor/bower/textAngular/dist/textAngular-rangy.min.js',
        "textNgSantize": '_vendor/bower/textAngular/dist/textAngular-sanitize.min.js',
        "textNg": '_vendor/bower/textAngular/dist/textAngular.min.js',
        "uiRouter": '_vendor/bower/angular-ui-router/release/angular-ui-router.js',
        "uiBootstrap": '_vendor/bower/angular-bootstrap/ui-bootstrap-tpls.min.js',
        "uiSelect": '_vendor/ui-select/select.min.js',
        "waves": '_vendor/bower/waves/dist/waves.min.js'
    },
    "meta": {
        "jquery": {
            "format": 'global',
            "exports": 'jQuery'
        },
        "angular": {
            "format": 'global',
            "exports": 'angular',
            "deps": ['jquery', 'waves']
        },
        "animate": {
            "format": 'global',
            "deps": ['angular']
        },
        "moment": {
            "format": 'global'
        },
        "ocLazyLoad": {
            "format": 'global',
            "deps": ['angular']
        },
        "uiRouter": {
            "format": 'global',
            "deps": ['angular']
        },
        "uiSelect": {
            "format": 'global',
            "deps": ['angular']
        },
        "uiBootstrap": {
            "format": 'global',
            "deps": ['angular']
        },
        "niceScroll": {
            "format": 'global',
            "deps": ['jquery']
        },
        "loadingBar": {
            "format": 'global',
            "deps": ['angular']
        },
        "breeze": {
            "format": 'global',
            "deps": ['angular']
        },
        "breezeSaveError": {
            "format": 'global',
            "deps": ['breeze']
        },
        "breezeNg": {
            "format": 'global',
            "deps": ['breeze']
        },
        "bsGrowl": {
            "format": 'global',
            "deps": ['jquery']
        },
        "templates": {
            "format": 'global',
            "deps": ['angular']
        },
        "sweetalert": {
            "format": 'global',
            "deps": ['jquery']
        },
        "waves": {
            "format": 'global',
            "deps": ['jquery']
        },
        "inputMask": {
            "format": 'global',
            "deps": ['jquery']
        },
        "jMouseWheel": {
            "format": 'global',
            "deps": ['jquery']
        },
        "mCustomScroll": {
            "format": 'global',
            "deps": ['jMouseWheel']
        },
        "textNgRangy": {
            "format": 'global'
        },
        'textNgSantize': {
            "format": 'global',
            "deps": ['angular']
        },
        "textNg": {
            "format": 'global',
            "deps": ['textNgSantize', 'textNgRangy']
        },
        "ngTable": {
            "format": 'global',
            "deps": ['angular']
        },
        "ngSanitize": {
            "format": 'global',
            "deps": ['angular']
        },
        "flot": {
            "format": 'global',
            "deps": ['jquery']
        },
        "flotPie": {
            "format": 'global',
            "deps": ['flot']
        },
        "flotTooltip": {
            "format": 'global',
            "deps": ['flot']
        }, 
        "flotResize": {
            "format": 'global',
            "deps": ['flot']
        }
    },
    "packages": {
        "app": {
            "main": 'app/appEcat.js',
            "format": 'register',
            "defaultExtension": 'js',
            "map": {
                "core": 'app/core',
                "admin": 'app/admin',
                "student": 'app/student',
                "faculty": 'app/faculty',
                "provider": 'app/provider',
                "designer": 'app/designer',
                "hq": 'app/hq'
            }
        }
    }
};

(function () {
    // CommonJS
    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = moduleConfiguraton;
        // RequireJS
    } else if (window.System !== undefined) {
        System.config(moduleConfiguraton);
        System.import('app/appEcat.js').then(function (ecatApp) {
            ecatApp.default.load();
            angular.bootstrap(document.querySelector('html'), ['app.ecat'], { strictD: true });
        });
        // <script>
    } else {
        return moduleConfiguraton;
    }
})();
