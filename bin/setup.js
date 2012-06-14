/*jslint node:true*/

var fs = require('fs'),
	path = require('path'),
	util = require('util'),
	colors = require('colors'), // https://github.com/marak/colors.js
	mkdirp = require('mkdirp'), // https://github.com/substack/node-mkdirp
	i,
	total,
	tmp,
	parent_dir,
	source,
	destination,
	type;

colors.setTheme({
	status: 'green',
	error: 'red',
	info: 'cyan',
	warning: 'yellow',
	note: 'grey',
	field: 'bold'
});

function fileExists(filePath) {
    try {
		fs.statSync(filePath);
		return true;
    } catch (e) {
        try {
            fs.readlinkSync(filePath);
            return true;
        } catch (e) {
            return false;
        }
    }
}

function isDirectory(dirPath) {
    try {
		return !!fs.statSync(dirPath).isDirectory();
    } catch (e) {
		return false;
    }
}

try {
	var config = JSON.parse(fs.readFileSync(__dirname + '/config.json', 'ascii'));
} catch (e) {
	console.error(('Invalid configuration: ' + e).error + '\n');
	process.exit(1);
}


console.log('\nCreating default dirs\n'.status);

total = config.setup_dirs.length;
for (i = 0; i < total; i = i + 1) {
	destination = path.resolve(__dirname, config.setup_dirs[i]);
	tmp = destination.field + ': ';

	if (!fileExists(destination)) {
		mkdirp.sync(destination, 0744);
		console.log(tmp + 'OK'.blue);
	} else {
		console.log(tmp + 'Skipped'.warning);
	}
}



console.log('\nGenerating symbolic links...\n'.status);

total = config.setup_symlinks.length;
for (i = 0; i < total; i = i + 1) {

	source = path.resolve(__dirname, config.setup_symlinks[i].src);
	destination = path.resolve(__dirname, config.setup_symlinks[i].dst);
	type = config.setup_symlinks[i].type;
	tmp = config.setup_symlinks[i].title.field + ' (' + destination.note + '): ';

//	console.log('checking for ' + destination.red, fileExists(destination));
	if (!fileExists(destination)) {

		parent_dir = destination.match(/(.+)[\/\\]/);
		if (!isDirectory(parent_dir)) {
//			console.log('going to create: ' + parent_dir[1]);
			mkdirp.sync(parent_dir[1], 0744);
		}
		fs.symlinkSync(source, destination, type);
		console.log(tmp + 'OK'.blue);
	} else {
		console.log(tmp + 'Skipped'.warning);
	}
}


console.log('\nSetup finished successfuly'.status + "\n");