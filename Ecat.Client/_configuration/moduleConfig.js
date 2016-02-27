var moduleConfiguraton = {
    "baseURL": 'Client/',
    "map": {
        "jquery": '_vendor/bower/jquery/dist/jquery.min.js',
        "angular": '_vendor/bower/angular/angular.js',
        "animate": '_vendor/bower/angular-animate/angular-animate.min.js',
        "ocLazyLoad": '_vendor/bower/oclazyload/dist/ocLazyLoad.js',
        "uiRouter": '_vendor/bower/angular-ui-router/release/angular-ui-router.js',
        "uiBootstrap": '_vendor/bower/angular-bootstrap/ui-bootstrap-tpls.min.js',
        "jMouseWheel": '_vendor/bower/jquery-mousewheel/jquery.mousewheel.min.js',
        "mCustomScroll": '_vendor/bower/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.js',
        "loadingBar": '_vendor/angular-loading-bar/src/loading-bar.js',
        "breeze": '_vendor/bower/breeze-client/breeze.debug.js',
        "breezeNg": '_vendor/bower/breeze-client/build/adapters/breeze.bridge.angular.js',
        "breezeSaveError": '_vendor/bower/breeze-client-labs/breeze.saveErrorExtensions.js',
        "ngMessage": '_vendor/bower/angular-messages/angular-messages.min.js',
        "ngTable": '_vendor/bower/ng-table/dist/ng-table.min.js',
        "moment": '_vendor/bower/moment/moment.js',
        "bsGrowl": '_vendor/bower/remarkable-bootstrap-notify/bootstrap-notify.js',
        "sweetalert": '_vendor/bower/sweetalert/dist/sweetalert.min.js',
        "templates": 'app/templates.js',
        "waves": '_vendor/bower/waves/dist/waves.min.js',
        "inputMask": '_vendor/bower/jquery-mask-plugin/dist/jquery.mask.min.js',
        "textNgRangy": '_vendor/bower/textAngular/dist/textAngular-rangy.min.js',
        "textNgSantize": '_vendor/bower/textAngular/dist/textAngular-sanitize.min.js',
        "textNg": '_vendor/bower/textAngular/dist/textAngular.min.js'
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
                "courseAdmin": 'app/courseAdmin',
                "provider": "app/provider",
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
