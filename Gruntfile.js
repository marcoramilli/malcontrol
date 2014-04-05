module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      options: {
               banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
               compress: true
      },
      build: {
        expand: true,
        cwd: 'frontend/',
        src: 'js/*.js',
        dest: 'frontend_c/'
      }
    },

    copy: {
      main: {
        expand: true,
        cwd: 'frontend/',
        src: '**',
        dest: 'frontend_c/',
        flatten: false,
      }
    },

    plato: {
      your_task: {
        options : {
          complexity : {
            logicalor : false,
            switchcase : false,
            forin : true,
            trycatch : true
          }
      },
      files: {
        'reports': ['frontend/js/*.js', './server.js', './routes/*.js', './scrapers/*.js', './test/*.js']
      }
      }
    },

    changelog: {
      options: {
        // Task-specific options go here.
      }
    },

    apidoc: {
      myapp: {
          src: "routes/",
          dest: "doc/"
       }
    }

  });

  // Load the plugin 
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-plato');
  grunt.loadNpmTasks('grunt-conventional-changelog');
  grunt.loadNpmTasks('grunt-apidoc');


  // Default task(s).
  grunt.registerTask('default', ['plato', 'copy', 'uglify', 'apidoc',  'changelog']);

};//Wrapping Function
