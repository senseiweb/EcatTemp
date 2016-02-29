﻿const del = require('del');
const gulp = require('gulp');
const $$ = require('gulp-load-plugins')({ lazy: true });
const sysJsCfg = require('./_configuration/moduleConfig.js');

var webProj = '../Ecat.Web';
var modelProj = '../Ecat.Shared.Core/Utility';
var linksRegex = /@\[[a-z]+[A-Z]\w+\]\S+\.html/g;
var modCfgRegEx = /_vendor\/\S+\/(\S+.js)/g;
var paths = {
    webroot: `${webProj}/Client`,
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
    appJs: ['./**/*.js', '!_vendor/**', '!_configuration/**', '!node_modules/**']
}

const log = (msg: any) => {
    if (typeof (msg) === 'object') {
        for (let item in msg) {
            if (msg.hasOwnProperty(item)) {
                $$.util.log($$.util.colors.green(`Logging Object Property ==> ${item}: ${msg[item]}`));
            }
        }
    } else {
        $$.util.log($$.util.colors.green(msg));
    }
}

const clean = (path: string | Array<string>, done: any): any => {
    log(`Cleaning: ${$$.util.colors.white(path)}`);
    var options = { force: true }
    //WARNING: THIS WILL DELETE FILES OUTSIDE OF THE CURRENT WORKING DIRECTORY!, 
    //Changes options to {dryRun: true, force: true } to test before making changes!!
    return del(path, options, done).then(paths => console.log(paths));
}

const replaceText = (path) => {
    if (!path) {
        console.log('No path');
    }
    const match = /@\[[a-z]+([A-Z]\w+)\](\S+\.html)/g.exec(path);
   //console.log(match || path);
    const appPath = `Client/app/${match[1].toLowerCase()}`;
    const filePath = `${appPath}${match[2]}`;
    //console.log('final path ==> printing');
    log(filePath);
    return filePath;
}

gulp.task('buildClean', (done : any) => {
    const keys = Object.keys(pubPaths);
    let source = keys.map((key: string) => `${pubPaths[key]}/**`);
    source = source.concat(['**/*.map']);
    return clean(source, done);
});

gulp.task('buildScripts', () => {
    const filePathRegEx = /_vendor\/\S+\/\S+\.js/g;
    const paths = [];

    const orginalSourcePaths = () => {
        const mappings = sysJsCfg.map;
        const keys = Object.keys(sysJsCfg.map);
        //console.log(keys);
        keys.filter(key => key !== 'templates')
            .forEach(key => paths.push(mappings[key]));
    };

    orginalSourcePaths();
    const sourceScripts = [
        '_configuration/moduleConfig.js',
        '_vendor/**/*.js',
        '!_vendor/bower/**',
        '_vendor/**/bower/system.js/dist/system.src.js'
    ].concat(paths);

    sourceScripts.forEach((item) => log(item));

    const checkForModuleConfig = (file: any) => {
        return file.path.toLowerCase().indexOf('moduleconfig') !== -1;
    }

    const changeDestination = (path) => {
        if (!path) {
            console.log('No path');
        }
        console.log('changing paths');
        const fileReg = /\/(\S[^\/]+\.js)/g;
        const file = 'scripts/' + fileReg.exec(path)[1];
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

gulp.task('buildStyles', () => {
    return gulp.src(['_content/ecat.less'])
        .pipe($$.plumber())
        .pipe($$.debug({ title: 'Styles Build:' }))
        .pipe($$.less())
        .pipe($$.autoprefixer({ browser: [`last 2 version`, '> 5%'] }))
        .pipe(gulp.dest(pubPaths.styles));
});

gulp.task('getIndexHtml', () => {

return  gulp.src([`${webProj}/Views/Lti/Secure.cshtml`])
    .pipe($$.plumber())
    .pipe($$.debug({ title: 'Index Build: ' }))
    .pipe($$.rename('index.html'))
    .pipe(gulp.dest(`${paths.webroot}/`))});

gulp.task('getTypings', () => {
    var check = (file: any): boolean => file.path.indexOf('.d.ts') > -1;

    return gulp.src([`${modelProj}/*.ts`])
        .pipe($$.plumber())
        .pipe($$.debug({ title: 'Typings' }))
        .pipe($$.if(check, $$.rename('ecatServer.d.ts'), $$.rename('serverEnums.ts')))
        .pipe(gulp.dest('./_configuration/custom/'));
});

gulp.task('buildFonts', () => {
    const check = (file: any) => {
        return file.path.toLowerCase().indexOf('roboto') === -1 &&
            file.path.toLowerCase().indexOf('weather') === -1 &&
            file.path.toLowerCase().indexOf('shadowsintolight') === -1;
    }

    const renameOption = (path: any) => {
        const newDirName = path.dirname.toLowerCase().replace('_content\\fonts', '');
        path.dirname = newDirName;
    }

    return gulp.src(sourcePaths.fonts)
        .pipe($$.plumber())
        .pipe($$.debug({ title: 'Fonts Build:' }))
        .pipe($$.if(check, $$.flatten(), $$.rename(renameOption)))
        .pipe(gulp.dest(pubPaths.fonts));
});


gulp.task('buildImages', () => {
    return gulp.src(sourcePaths.images)
        .pipe($$.debug({ title: 'Image Build:' }))
        .pipe($$.plumber())
        .pipe(gulp.dest(pubPaths.img));
});



gulp.task('buildTemplates', () => {
    const options = {
        standalone: true,
        base: (file: any) => { return file.relative; },
        root: 'Client/app/',
        transformUrl: (url: string) => {
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

gulp.task('buildApp', () => {
    return gulp.src(sourcePaths.appJs)
        .pipe($$.debug({ title: 'App Build:' }))
        .pipe($$.replace(linksRegex, replaceText))
        .pipe($$.print())
        .pipe(gulp.dest(pubPaths.appLocation));
});

gulp.task('rebuildApp', gulp.series('buildClean',
    'buildScripts',
    'buildStyles',
    'getIndexHtml',
    'getTypings',
    'buildFonts',
    'buildImages',
    'buildTemplates',
    'buildApp'));

gulp.task('buildAppWatch', gulp.series('rebuildApp', () => gulp.watch(['{app,content,scripts,views}/*.{js,html,less}', '!scripts/vendor/bower/**'], gulp.series('rebuildApp'))));
