// Generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> v<%= pkg.version %>

module.exports = function(grunt) {

  grunt.initConfig({
    jade: {
      src: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: '**/*.jade',
          dest: 'public/',
          ext: '.html',
          pretty: true
        }]
      }
    },
    stylus: {
      src: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: '**/*.styl',
          dest: 'public/',
          ext: '.css',
          compress: false
        }]
      }
    },
    watch: {
      src: {
        files: 'src/**',
        tasks: 'default'
      }
    },
    clean: {
      public: 'public/**/*'
    },
    copy: {
      src: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['**', '!**/*.jade', '!**/*.styl'],
          dest: 'public/'
        }]
      }
    },
    connect: {
      server: {
        options: {
          port: 8000,
          base: 'public',
          keepalive: true
        }
      }
    },
    concurrent: {
      compile: {
        tasks: ['jade', 'stylus', 'copy'],
        options: {
            logConcurrentOutput: false
        }
      },
      server: {
        tasks: ['connect', 'watch'],
        options: {
            logConcurrentOutput: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-concurrent');

  grunt.registerTask('default', ['clean', 'concurrent:compile']);
  grunt.registerTask('server', ['default', 'concurrent:server']);

};
