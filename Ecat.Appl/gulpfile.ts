﻿const del = require('del');
const gulp = require('gulp');
const $$ = require('gulp-load-plugins')({ lazy: true });
const sysJsCfg = require('./Scripts/config/systemCfg');

var paths = {
    webroot: './wwwroot',
    app: '/app',
    config:'/config',
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
    fonts: ['{Content,Scripts}/**/fonts/**/*.{ttf,woff,woff2,eot,svg}'],
    images: 'Content/img/**/*.{png,jpeg,jpg,svg,gif}',
    scripts: 'Scripts/**/*.js',
    mapScripts: 'app/**/*.map',
    appHtml: 'app/**/*.html',
    appJs: 'app/**/*.js'
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

const clean = (path, done): any => {
    log(`Cleaning: ${$$.util.colors.white(path)}`);
    return del(path, done);
}

gulp.task('buildClean', (done) => {
    const keys = Object.keys(pubPaths);
    let source = keys.map((key) => `${pubPaths[key]}/**`);
    source = source.concat(['**/*.map']);
    return clean(source, done);
});

gulp.task('buildScripts', () => {
    const sysJsMap = sysJsCfg.map;
    const mappedKeys = Object.keys(sysJsMap);
    const source = mappedKeys.filter((key) => {
        const value = sysJsMap[key];
        return value && value.indexOf('scripts') > -1;
    }).map((key) => {
        const value = sysJsMap[key];
        const newValue = value.replace('scripts/', 'scripts/**');
        return `./${newValue}`;
        });
    const sourceScripts = [
        'scripts/**/config/**/*.js',
        'scripts/**/vendor/**/*.js',
        '!scripts/vendor/bower/**',
        'scripts/**/vendor/bower/system.js/dist/system.src.js'
    ].concat(source);

    sourceScripts.forEach((item) => log(item));

    return gulp.src(sourceScripts)
        .pipe($$.plumber())
        .pipe($$.debug({ title: 'Script Build:'}))
        .pipe(gulp.dest(pubPaths.scripts));
});

gulp.task('buildStyles', () => {
    return gulp.src(['Content/ecat.less'])
        .pipe($$.plumber())
        .pipe($$.debug({ title: 'Styles Build:' }))
        .pipe($$.less())
        .pipe($$.autoprefixer({ browser: [`last 2 version`, '> 5%'] }))
        .pipe(gulp.dest(pubPaths.styles));
});

gulp.task('buildIndexHtml', () => {
    return gulp.src(['./Views/Lti/Secure.cshtml'])
        .pipe($$.plumber())
        .pipe($$.debug({title: 'Index Build: '}))
        .pipe($$.rename('index.html'))
        .pipe(gulp.dest(`${paths.webroot}/`));
});

gulp.task('buildFonts', () => {
    const check = (file: any) => {
        return file.path.toLowerCase().indexOf('roboto') === -1 &&
            file.path.toLowerCase().indexOf('weather') === -1 &&
            file.path.toLowerCase().indexOf('shadowsintolight') === -1;
    }
    
    const renameOption = (path: any) => {
        const newDirName = path.dirname.toLowerCase().replace('content\\fonts', '');
        path.dirname = newDirName;
    }

    return gulp.src(sourcePaths.fonts)
            .pipe($$.plumber())
        .pipe($$.debug({title: 'Fonts Build:'}))
        .pipe($$.if(check, $$.flatten(), $$.rename(renameOption)))
        .pipe(gulp.dest(pubPaths.fonts));
});


gulp.task('buildImages', () => {
    return gulp.src(sourcePaths.images)
        .pipe($$.debug({title: 'Image Build:'}))
        .pipe($$.plumber())
        .pipe(gulp.dest(pubPaths.img));
});

gulp.task('buildTemplates', () => {
    const options = {
        standalone: true,
        base: (file: any) => { return file.relative; },
        root: 'wwwroot/app/',
        transformUrl: (url: string) => {
            log(url);
            if (url.indexOf('tabset.tmpl.override') >= 0) {
                url = 'template/tabs/tabset.html';
                return url;
            } else {
                return url;
            }
        }
    }
    return gulp.src('app/**/*.html', { base: 'app/' })
        .pipe($$.plumber())
        .pipe($$.debug({title:'Template Build:'}))
        .pipe($$.htmlmin({ collapseWhitespace: true }))
        .pipe($$.angularTemplatecache(options))
        .pipe(gulp.dest('./wwwroot/app/'));

});

gulp.task('buildApp', () => {
    return gulp.src([sourcePaths.appJs, sourcePaths.appHtml])
        .pipe($$.debug({title:'App Build:'}))
        .pipe($$.print())
        .pipe(gulp.dest(pubPaths.appLocation));
});

gulp.task('rebuildApp', gulp.series('buildClean',
    'buildScripts',
    'buildStyles',
    'buildIndexHtml',
    'buildFonts',
    'buildImages',
    'buildTemplates',
    'buildApp'));

gulp.task('buildAppWatch', gulp.series('rebuildApp', () => gulp.watch(['{app,content,scripts,views}/*.{js,html,less}', '!scripts/vendor/bower/**'], gulp.series('rebuildApp'))));
