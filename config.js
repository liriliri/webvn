// Global configuration

var config = {};

// Files that is loaded when initialize
config.loadFiles = {
	// Css files
	css: {
		ui: [
			'background'
		]
	},
	// Js files
	js: {
		// Engine core
	    core: [
	        'log',
	        'util',
	        'class',
	        'promise', 
	        'ajax', 
	        'storage',
	        'config', 
	        'script', 
	        'audio',
	        'event', 
	        'select', 
	        'template', 
	        'ui'
	    ],
	    // Engine extension
	    ext: [
	    ],
	    // Third library
	    lib: [
	    	'TweenMax'
	    ],
	    // Ui components
	    ui: [
	    	'background', 
	    	'rain'
	    ],
	    // Command
		cmd: [
	        'console'
	    ]
	},
	prefix: {
		css: {
			ui: '/engine/ui/'
		},
		js: {
			core: '/engine/core/',
			lib: '/engine/lib/',
			ui: '/engine/ui/',
			cmd: '/engine/cmd/'
		}
	}
};

// Exports config to be read by nodejs program
if (typeof module === "object" && typeof module.exports === "object") {
	module.exports = config;
}