module.exports = function(grunt) {
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		replace: {
			clearBanner: {
				src: ['src/jquery.mixitup.js'],
				dest: ['src/jquery.mixitup.js'],
				replacements: [{
					from: /\/\*([\s\S]*?)\*\//,
					to: ''
				}]
			}
		},
		jshint: {
			ignore_warning: {
				options: {
					'-W032': true,
					'-W030': true,
					'-W103': true,
					'-W004': true,
					'-W122': true,
					'-W084': true
				},
				src: ['src/*.js']
			}
		},
		uglify: {
			build: {
				options: {
					preserveComments: 'some'
				},
		    	src: 'src/jquery.mixitup.js',
				dest: 'build/jquery.mixitup.min.js'
		  	}
		},
		bump: {
			options: {
				files: ['package.json'],
				updateConfigs: ['pkg'],
				commit: false,
				push: false,
				createTag: true
			}
		},
		usebanner: {
			addBanner:{
				options: {
					position: 'top',
					banner: '/**!\n' + 
							' * MixItUp v<%= pkg.version %>\n' +
							' *\n' +
							' * @copyright Copyright '+(new Date().getFullYear())+' KunkaLabs Limited.\n' +
							' * @author    KunkaLabs Limited.\n' +
							' * @link      https://mixitup.kunkalabs.com\n' +
							' *\n' +
							' * @license   Commercial use requires a commercial license.\n' + 
							' *            https://mixitup.kunkalabs.com/licenses/\n' +
							' *\n' +
							' *            Non-commercial use permitted under terms of CC-BY-NC license.\n' +
							' *            http://creativecommons.org/licenses/by-nc/3.0/\n' +
							' */',
					linebreak: false
				},
				files: {
					src: ['src/jquery.mixitup.js']
				}
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-bump');
	grunt.loadNpmTasks('grunt-banner');

	grunt.registerTask('build', [
		'jshint',
		'uglify:build'
	]);
	
	grunt.registerTask('release', function(target){
		if(!target){
			target = 'patch';
		}
		return grunt.task.run(
			'bump-only:'+target, 
			'replace:clearBanner',
			'usebanner:addBanner',
			'build',
			'bump-commit'
		);
	});
	
	grunt.registerTask('default', 'build');
}
