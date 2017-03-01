const gulp = require('gulp');
const fs = require('fs-extra');

gulp.task('docs', () => {
    const pug = require('pug');
    const marked = require('marked');
    const renderer = new marked.Renderer();
    const defaultRenderer = renderer.code;
    const slugify = text => {
        const speakingUrl = require('speaking-url');
        return speakingUrl.getSlug(text, { lang: 'en' });
    };

    renderer.code = (text, level) => {
        return `${text}<code-demo :collapsed="true">${defaultRenderer.call(renderer, text, level)}</code-demo>`;
    };

    const compiledFunction = pug.compileFile('docs.pug', {
        filters: {
            test: (txt, opts) => {
                return `${marked(txt, { renderer })}`;
            }
        }
    });

    fs.ensureDirSync('dist');
    fs.writeFileSync('dist/docs2.html', compiledFunction());
});

gulp.task('docs:watch', () => {
    gulp.watch(['src/**/*', 'docs-tree.yml', 'docs.pug'], ['docs']);
});

gulp.task('serve', () => {
    const browserSync = require('browser-sync').create();
    browserSync.init({
        files: 'dist/**/*',
        open: false,
        server: {
            baseDir: "."
        }
    });
});

const scgulp = require('showcar-gulp')(gulp);

gulp.task('scss', scgulp.scss({
    entry: 'src/showcar-ui.scss',
    out: 'dist/showcar-ui.css'
}));

gulp.task('scss:docs', scgulp.scss({
    entry: 'src/docs.scss',
    out: 'dist/docs.css'
}));

gulp.task('scss:watch', () => {
    gulp.watch('src/**/*.scss', ['scss', 'scss:docs']);
});


gulp.task('js:docs', () => {
    const webpackStream = require('webpack-stream');
    const webpack = require('webpack');
    const ExtractTextPlugin = require("extract-text-webpack-plugin");
    let cache;

    return gulp.src('src/docs.js')
        .pipe(webpackStream({
            output: {
                filename: 'docs.js'
            },
            // cache,
            // module: {
            //     rules: [{
            //         test: /\.scss$/,
            //         use: ExtractTextPlugin.extract({
            //             use: ['css-loader', 'sass-loader']
            //         })
            //         // use: [{
            //         //     loader: "style-loader"
            //         // }, {
            //         //     loader: "css-loader"
            //         // }, {
            //         //     loader: "sass-loader",
            //         //     options: {
            //         //         includePaths: ["node_modules"],
            //         //         // importer: require('node-sass-importer')
            //         //         importer: require('node-sass-import')
            //         //     }
            //         // }]
            //     }]
            // },
            // plugins: [
            //     new ExtractTextPlugin('styles.css'),
            // ]
        }, webpack))
        .on('error', function(err) {
            console.error('WEBPACK ERROR', err);
            this.emit('end');
        })
        .pipe(gulp.dest('dist/'));
});

gulp.task('js:watch', () => {
    gulp.watch('src/**/*.js', ['js:docs']);
});


gulp.task('docs:dev', ['docs', 'scss:docs', 'js:docs', 'docs:watch', 'scss:watch', 'js:watch', 'serve']);
