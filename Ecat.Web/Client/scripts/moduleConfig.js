var moduleConfiguraton = {
    "baseURL": 'Client/',
    "map": {
        "jquery": 'scripts/jquery.min.js',
        "angular": 'scripts/angular.js',
        "animate": 'scripts/angular-animate.min.js',
        "ocLazyLoad": 'scripts/ocLazyLoad.js',
        "uiRouter": 'scripts/angular-ui-router.js',
        "uiBootstrap": 'scripts/ui-bootstrap-tpls.min.js',
        "jMouseWheel": 'scripts/jquery.mousewheel.min.js',
        "mCustomScroll": 'scripts/jquery.mCustomScrollbar.js',
        "loadingBar": 'scripts/loading-bar.js',
        "breeze": 'scripts/breeze.debug.js',
        "breezeNg": 'scripts/breeze.bridge.angular.js',
        "breezeSaveError": 'scripts/breeze.saveErrorExtensions.js',
        "ngMessage": 'scripts/angular-messages.min.js',
        "ngTable": 'scripts/ng-table.min.js',
        "moment": 'scripts/moment.js',
        "bsGrowl": 'scripts/bootstrap-notify.js',
        "sweetalert": 'scripts/sweetalert.min.js',
        "templates": 'app/templates.js',
        "waves": 'scripts/waves.min.js',
        "inputMask": 'scripts/jquery.mask.min.js',
        "textNgRangy": 'scripts/textAngular-rangy.min.js',
        "textNgSantize": 'scripts/textAngular-sanitize.min.js',
        "textNg": 'scripts/textAngular.min.js'
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
