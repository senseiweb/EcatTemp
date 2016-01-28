var config = {
    "baseURL": 'wwwroot/',
    "map": {
        "jquery": 'scripts/vendor/bower/jquery/dist/jquery.js',
        "angular": 'scripts/vendor/bower/angular/angular.js',
        "animate": 'scripts/vendor/bower/angular-animate/angular-animate.min.js',
        "ocLazyLoad": 'scripts/vendor/bower/oclazyload/dist/ocLazyLoad.js',
        "uiRouter": 'scripts/vendor/bower/angular-ui-router/release/angular-ui-router.js',
        "uiBootstrap": 'scripts/vendor/bower/angular-bootstrap/ui-bootstrap-tpls.min.js',
        "jMouseWheel": 'scripts/vendor/bower/jquery-mousewheel/jquery.mousewheel.min.js',
        "mCustomScroll": 'scripts/vendor/bower/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.js',
        "loadingBar": 'scripts/vendor/angular-loading-bar/src/loading-bar.js',
        "breeze": 'scripts/vendor/bower/breeze-client/breeze.debug.js',
        "breezeNg": 'scripts/vendor/bower/breeze-client/build/adapters/breeze.bridge.angular.js',
        "breezeSaveError": 'scripts/vendor/bower/breeze-client-labs/breeze.saveErrorExtensions.js',
        "ngMessage": 'scripts/vendor/bower/angular-messages/angular-messages.min.js',
        "ngTable": 'scripts/vendor/bower/ng-table/dist/ng-table.min.js',
        "moment": 'scripts/vendor/bower/moment/moment.js',
        "bsGrowl": 'scripts/vendor/bower/remarkable-bootstrap-notify/bootstrap-notify.js',
        "sweetalert": 'scripts/vendor/bower/sweetalert/dist/sweetalert.min.js',
        "templates": 'app/templates.js',
        "waves": 'scripts/vendor/bower/waves/dist/waves.min.js',
        "inputMask": 'scripts/vendor/bower/jquery-mask-plugin/dist/jquery.mask.min.js',
        "textNgRangy": 'scripts/vendor/bower/textAngular/dist/textAngular-rangy.min.js',
        "textNgSantize": 'scripts/vendor/bower/textAngular/dist/textAngular-sanitize.min.js',
        "textNg": 'scripts/vendor/bower/textAngular/dist/textAngular.min.js'
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
            "main": 'app/app.js',
            "format": 'register',
            "defaultExtension": 'js',
            "map": {
                "appVars": 'app/appVars',
                "core": 'app/core',
                "config": 'app/core/config',
                "directive": 'app/core/directives',
                "provider": 'app/core/provider',
                "service": 'app/core/service',
                "global": 'app/core/global',
                "admin": 'app/admin'
            }
        }
    }
};

(function() {
    // CommonJS
    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = config;
        // RequireJS
    } else if (window.System !== undefined) {
        System.config(config);
        System.import('app/app.js').then(function (angularMod) {
            new angularMod.default();
             angular.bootstrap(document.querySelector('html'), ['appEcat'], {strictD: true});
        });
        // <script>
    } else {
        return config;
    }
})();
  