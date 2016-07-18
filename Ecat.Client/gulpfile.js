var del = require('del');
var gulp = require('gulp');
var $$ = require('gulp-load-plugins')({ lazy: true });
var sysJsCfg = require('./_configuration/moduleConfig.js');

var webProj = '../Ecat.Web';
var modelProj = '../Ecat.Shared.Core/Utility';
var linksRegex = /@\[[a-z]+[A-Z]\w+\]\S+\.html/g;
var modCfgRegEx = /_vendor\/\S+\/(\S+.js)/g;
var paths = {
    webroot: webProj + '/ecat/Client',
    app: '/app',
    config: '/config',
    content: '/content',
    font: '/fonts',
    vendor: '/vendor',
    scripts: '/scripts',
    styles: '/styles',
    img: '/img'
}

var pubPaths = {
    appLocation: paths.webroot + paths.app,
    styles: paths.webroot + paths.content + paths.styles,
    img: paths.webroot + paths.content + paths.img,
    content: paths.webroot + paths.content,
    fonts: paths.webroot + paths.content + paths.font,
    scripts: paths.webroot + paths.scripts
}

var sourcePaths = {
    fonts: ['{_content,_vendor}/**/fonts/**/*.{ttf,woff,woff2,eot,svg}'],
    images: '_content/img/**/*.{png,jpeg,jpg,svg,gif}',
    scripts: '_vendor/**/*.js',
    mapScripts: 'app/**/*.map',
    appHtml: ['./**/*.html', '!./_vendor/bower/**', '!./node_modules/**'],
    appJs: ['./**/*.js', '!_vendor/**', '!_configuration/**', '!node_modules/**'],    
    appTs: ['./**/*.ts','!./gulpfile.ts','.!/**/*.d.ts' ,'!_vendor/**', '!_configuration/**', '!node_modules/**']
}

var log = function(msg) {
    if (typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $$.util.log($$.util.colors.green('Logging Object Property ==> ' + item + ' ' + msg[item]));
            }
        }
    } else {
        $$.util.log($$.util.colors.green(msg));
    }
}

var clean = function(path, done){
    log('Cleaning: '+ $$.util.colors.white(path));
    var options = { force: true }
    //WARNING: THIS WILL DELETE FILES OUTSIDE OF THE CURRENT WORKING DIRECTORY!, 
    //Changes options to {dryRun: true, force: true } to test before making changes!!
    return del(path, options, done).then(function(paths) { console.log(paths) });
}

var replaceText = function(path){
    if (!path) {
        console.log('No path');
    }
    var match = /@\[[a-z]+([A-Z]\w+)\](\S+\.html)/g.exec(path);
   //console.log(match || path);
    var appPath = 'Client/app/' + match[1].toLowerCase();
    var filePath = appPath + match[2];
    //console.log('final path ==> printing');
    log(filePath);
    return filePath;
}

gulp.task('buildClean', function(done){
    var keys = Object.keys(pubPaths);
    var source = keys.map(function(key) {
        return pubPaths[key] + '/**';
    });
    //source = source.concat(['./**/*.map','!node_modules/**', '!bower/**']);
    return clean(source, done);
});

gulp.task('compileTypescript',function(){
    return gulp.src(sourcePaths.appTs, { base: '.', since: gulp.lastRun('compileTypescript') })
        .pipe($$.plumber())
        .pipe($$.debug({ title: 'Compiling' }))
        .pipe($$.typescript({
            noImplicitAny: false,
            noEmitOnError: false,
            removeComments: false,
            module: 'system',
            sourceMap: false,
            isolatedModules: true,
            target: 'es5'
        }))
        .pipe(gulp.dest('.'));
});

gulp.task('buildScripts', function() {
    var filePathRegEx = /_vendor\/\S+\/\S+\.js/g;
    var paths = [];

    var orginalSourcePaths = function(){
        var mappings = sysJsCfg.map;
        var keys = Object.keys(mappings);
        //console.log(keys);
        keys.filter(function(key){return key !== 'templates'})
            .forEach(function(key) { return paths.push(mappings[key]) });
    };

    orginalSourcePaths();
    var sourceScripts = [
        '_configuration/moduleConfig.js',
        '_vendor/**/*.js',
        '!_vendor/bower/**',
        '_vendor/**/bower/system.js/dist/system.src.js'
    ].concat(paths);

    sourceScripts.forEach(function(item) { return log(item) });

    var checkForModuleConfig = function(file){
        return file.path.toLowerCase().indexOf('moduleconfig') !== -1;
    }

    var changeDestination = function(path){
        if (!path) {
            console.log('No path');
        }
        console.log('changing paths');
        var fileReg = /\/(\S[^\/]+\.js)/g;
        var file = 'scripts/' + fileReg.exec(path)[1];
        log(file);
        return file;
    }

    return gulp.src(sourceScripts)
        .pipe($$.plumber())
        .pipe($$.debug({ title: 'Script Build:' }))
         .pipe($$.flatten())
        .pipe($$.if(checkForModuleConfig, $$.replace(filePathRegEx, changeDestination)))
        .pipe(gulp.dest(pubPaths.scripts));
});

gulp.task('buildStyles', function() {
    return gulp.src(['_content/ecat.less'])
        .pipe($$.plumber())
        .pipe($$.debug({ title: 'Styles Build:' }))
        .pipe($$.less())
        .pipe($$.autoprefixer({ browser: ['last 2 version', '> 5%'] }))
        .pipe(gulp.dest(pubPaths.styles));
});

gulp.task('getIndexHtml', function() {

        return gulp.src([webProj + '/Views/Lti/Secure.cshtml'])
            .pipe($$.plumber())
            .pipe($$.debug({ title: 'Index Build: ' }))
            .pipe($$.rename('index.html'))
            .pipe(gulp.dest(paths.webroot + '/'));
    }
);

gulp.task('getTypings', function() {
    var check = function(file) {
        return file.path.indexOf('.d.ts') > -1;
    }

    return gulp.src([modelProj + '/*.ts'])
        .pipe($$.plumber())
        .pipe($$.debug({ title: 'Typings' }))
        .pipe($$.if(check, $$.rename('ecatServer.d.ts'), $$.rename('serverEnums.ts')))
        .pipe(gulp.dest('./_configuration/custom/'));
});

gulp.task('buildFonts', function() {
    var check = function (file){
        return file.path.toLowerCase().indexOf('roboto') === -1 &&
            file.path.toLowerCase().indexOf('weather') === -1 &&
            file.path.toLowerCase().indexOf('shadowsintolight') === -1;
    }

    var  renameOption = function(path){
        var newDirName = path.dirname.toLowerCase().replace('_content\\fonts', '');
        path.dirname = newDirName;
    }

    return gulp.src(sourcePaths.fonts)
        .pipe($$.plumber())
        .pipe($$.debug({ title: 'Fonts Build:' }))
        .pipe($$.if(check, $$.flatten(), $$.rename(renameOption)))
        .pipe(gulp.dest(pubPaths.fonts));
});


gulp.task('buildImages', function() {
    return gulp.src(sourcePaths.images)
        .pipe($$.debug({ title: 'Image Build:' }))
        .pipe($$.plumber())
        .pipe(gulp.dest(pubPaths.img));
});



gulp.task('buildTemplates', function() {
    var options = {
        standalone: true,
        base: function(file) {
             return file.relative;
        },
        root: 'Client/app/',
        transformUrl: function(url) {
            log('Transformed Url' + url);
            if (url.indexOf('tabset.tmpl.override') >= 0) {
                url = 'template/tabs/tabset.html';
                return url;
            } else {
                return url;
            }
        }
    }

    return gulp.src(sourcePaths.appHtml)
        .pipe($$.debug({ title: 'Template Build:' }))
        .pipe($$.htmlmin({ collapseWhitespace: true }))
        .pipe($$.replace(linksRegex, replaceText))
        .pipe($$.angularTemplatecache(options))
        .pipe($$.plumber())
        .pipe(gulp.dest(pubPaths.appLocation));

});

gulp.task('smallBuildApp', function(){
    return gulp.src(sourcePaths.appJs)
        .pipe($$.debug({ title: 'App Build:' }))
        .pipe($$.replace(linksRegex, replaceText))
        .pipe($$.print())
        .pipe(gulp.dest(pubPaths.appLocation));
});

gulp.task('buildApp', gulp.series('buildTemplates',
    'compileTypescript',
    'smallBuildApp'));

gulp.task('rebuildApp', gulp.series('buildClean',
    'buildScripts',
    'buildStyles',
    'getIndexHtml',
    'buildFonts',
    'buildImages',
    'buildApp'));

gulp.task('rebuildAppWatch', gulp.series('rebuildApp', function(){ gulp.watch(['./**/*.{ts,js,html,less}', '!./_vendor/bower/**'], gulp.series('rebuildApp'))}));
gulp.task('buildAppWatch', gulp.series('rebuildApp', function() { gulp.watch(['./**/*.{ts,js,html}', '!./_vendor/bower/**', '!./node_modules/**', '!./gulpfile*'], gulp.series('buildApp')) }));

