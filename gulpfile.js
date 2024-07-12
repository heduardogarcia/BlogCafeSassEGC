

const {src,dest,watch,series,parallel} =require('gulp');

//css y sass
const autoprefixer = require('autoprefixer');

const postcss=require('gulp-postcss');

const sass =require('gulp-sass')(require('sass'));

const sourcemaps=require('gulp-sourcemaps');

const cssnano= require('cssnano');


//imagenes

const imagemin=require('gulp-imagemin');
const webp=require('gulp-webp');
const avif=require('gulp-avif');


function css(done){

    //compilar sass
    //pasos:1 identificar archivo, 2 Compilar 3 guardar el .css
    /*crea el css comprimido */    
    //.pipe(sass({outputStyle:'compressed'}))
    src('src/scss/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([autoprefixer(),cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/css'));

    done();

}

function imagenes(done) {
    src('src/img/**/*')
        .pipe( imagemin({ optimizationLevel:3 }))
        .pipe(dest('build/img'));
    done();
}

function versionWebp(){
    return src('src/img/**/*.{png,jpg}')
        .pipe(webp())
        .pipe(dest('build/img'))
}

function versionAvif(){
    const opciones={
        quality:50
    }
    return src('src/img/**/*.{png,jpg,svg}')
        .pipe(avif(opciones))
        .pipe(dest('build/img'));
}


function dev(){
    watch('src/scss/**/*.scss',css);
    watch('src/img/**/*',imagenes);
    
}

exports.css=css;
exports.dev=dev;
exports.imagenes=imagenes;
exports.versionWebp=versionWebp;
exports.versionAvif=versionAvif;
exports.default=series( imagenes,versionWebp, versionAvif,css,dev);
// exports.default=series( imagenes,versionWebp,css,dev);

//series-- Se inicia una tarea y hasta que finaliza inicia la siguiente
//parallel.. Se inician en paralelo al mismo tiempo todas las funciones