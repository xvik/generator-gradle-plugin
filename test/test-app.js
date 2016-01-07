'use strict';

var path = require('path'),
    assert = require('yeoman-generator').assert,
    helpers = require('yeoman-generator').test,
    read = require('fs-readdir-recursive'),
    execFile = require('child_process').execFile;

function dotfile(file) {
    return file.replace(/^_|\/_|\\_/, '/.').replace(/^\//, '')
}

function sources(file) {
    return dotfile(file).replace(/(^|\/|\\)package(\/|\\|$)/, '$1com/johnd/testplugin$2')     // replace package
        .replace(/(\/|\\)Project/, '/Test')                                       // replace class prefix
        .replace(/(\/|\\)plugin\.properties/, '/com.johnd.test.properties');  // replace properties file
}

function runGradle(targetDir, done) {
    var isWin = /^win/.test(process.platform),
        targetFile = targetDir + '/gradlew' + (isWin ? '.bat' : '');
    execFile(targetFile, ['check'], function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        console.log(err);
        if (err instanceof Error)
            throw err;
        done();
    });
}

describe('check all options enabled', function () {
    var appPath = path.join(__dirname, '../app'),
        targetPath = path.join(__dirname, 'temp');


    before(function (done) {
        helpers.run(appPath)
            .inDir(targetPath)
            .withOptions({offline: true, noglobal:true})
            .withPrompts({
                githubUser: 'johnd',
                authorName: 'John Doe',
                authorEmail: 'johnd@somemail.com',
                projectName: 'test-plugin',
                projectGroup: 'com.johnd',
                projectPackage: 'com.johnd.testplugin',
                projectVersion: '0.1.0',
                projectDesc: 'Test plugin',
                pluginPortalDesc: 'Test plugin for ...',
                targetJava: '1.6',
                pluginPortalTags: 'java, sample,  plugin',
                mirrorToJcenter: true,
                bintrayUser: 'john',
                bintrayRepo: 'mvn',
                bintrayTags: 'java, sample,  lib',
                bintraySignFiles: true,
                mavenCentralSync: true
            })
            .on('end', done);
    });

    it('creates files on initial generation', function () {
        assert.file(read(appPath + '/templates/gradle-base'));
        assert.file(read(appPath + '/templates/project-base').map(dotfile));
        assert.file(read(appPath + '/templates/sources').map(sources));
    });

    it('creates valid plugin description', function () {
        assert.fileContent('src/main/resources/META-INF/gradle-plugins/com.johnd.test.properties',
            'implementation-class=com.johnd.testplugin.TestPlugin');
    });

    it('creates valid project', function (done) {
        this.timeout(300000); //5 min should be enough to download everything
        runGradle(targetPath + '/test-plugin', done);
    });
});

describe('check portal publishing only', function () {
    var appPath = path.join(__dirname, '../app'),
        targetPath = path.join(__dirname, 'temp');


    before(function (done) {
        helpers.run(appPath)
            .inDir(targetPath)
            .withOptions({offline: true, noglobal:true})
            .withPrompts({
                githubUser: 'johnd',
                authorName: 'John Doe',
                authorEmail: 'johnd@somemail.com',
                projectName: 'test-plugin',
                projectGroup: 'com.johnd',
                projectPackage: 'com.johnd.testplugin',
                projectVersion: '0.1.0',
                projectDesc: 'Test plugin',
                pluginPortalDesc: 'Test plugin for ...',
                targetJava: '1.6',
                pluginPortalTags: 'java, sample,  plugin',
                mirrorToJcenter: false,
                pluginPortalUseCustomGroup: false
            })
            .on('end', done);
    });

    it('creates files on initial generation', function () {
        assert.file(read(appPath + '/templates/gradle-base'));
        assert.file(read(appPath + '/templates/project-base').map(dotfile));
        assert.file(read(appPath + '/templates/sources').map(sources));
    });

    it('creates valid plugin description', function () {
        assert.fileContent('src/main/resources/META-INF/gradle-plugins/com.johnd.test.properties',
            'implementation-class=com.johnd.testplugin.TestPlugin');
    });

    it('creates valid project', function (done) {
        this.timeout(300000); //5 min should be enough to download everything
        runGradle(targetPath + '/test-plugin', done);
    });
});

describe('check portal publishing with custom group', function () {
    var appPath = path.join(__dirname, '../app'),
        targetPath = path.join(__dirname, 'temp');


    before(function (done) {
        helpers.run(appPath)
            .inDir(targetPath)
            .withOptions({offline: true, noglobal:true})
            .withPrompts({
                githubUser: 'johnd',
                authorName: 'John Doe',
                authorEmail: 'johnd@somemail.com',
                projectName: 'test-plugin',
                projectGroup: 'com.johnd',
                projectPackage: 'com.johnd.testplugin',
                projectVersion: '0.1.0',
                projectDesc: 'Test plugin',
                pluginPortalDesc: 'Test plugin for ...',
                targetJava: '1.6',
                pluginPortalTags: 'java, sample,  plugin',
                mirrorToJcenter: false,
                pluginPortalUseCustomGroup: true
            })
            .on('end', done);
    });

    it('creates files on initial generation', function () {
        assert.file(read(appPath + '/templates/gradle-base'));
        assert.file(read(appPath + '/templates/project-base').map(dotfile));
        assert.file(read(appPath + '/templates/sources').map(sources));
    });

    it('creates valid plugin description', function () {
        assert.fileContent('src/main/resources/META-INF/gradle-plugins/com.johnd.test.properties',
            'implementation-class=com.johnd.testplugin.TestPlugin');
    });

    it('creates valid project', function (done) {
        this.timeout(300000); //5 min should be enough to download everything
        runGradle(targetPath + '/test-plugin', done);
    });
});

describe('check project name convention', function () {
    var appPath = path.join(__dirname, '../app'),
        targetPath = path.join(__dirname, 'temp');


    before(function (done) {
        helpers.run(appPath)
            .inDir(targetPath)
            .withOptions({offline: true, noglobal:true})
            .withPrompts({
                githubUser: 'johnd',
                authorName: 'John Doe',
                authorEmail: 'johnd@somemail.com',
                projectName: 'gradle-test-plugin',
                projectGroup: 'com.johnd',
                projectPackage: 'com.johnd.testplugin',
                projectVersion: '0.1.0',
                projectDesc: 'Test plugin',
                pluginPortalDesc: 'Test plugin for ...',
                targetJava: '1.6',
                pluginPortalTags: 'java, sample,  plugin',
                mirrorToJcenter: true,
                bintrayUser: 'john',
                bintrayRepo: 'mvn',
                bintrayTags: 'java, sample,  lib',
                bintraySignFiles: true,
                mavenCentralSync: true
            })
            .on('end', done);
    });

    it('creates files on initial generation', function () {
        assert.file(read(appPath + '/templates/gradle-base'));
        assert.file(read(appPath + '/templates/project-base').map(dotfile));
        assert.file(read(appPath + '/templates/sources').map(sources));
    });

    it('creates valid plugin description', function () {
        assert.fileContent('src/main/resources/META-INF/gradle-plugins/com.johnd.test.properties',
            'implementation-class=com.johnd.testplugin.TestPlugin');
    });

    it('creates valid project', function (done) {
        this.timeout(300000); //5 min should be enough to download everything
        runGradle(targetPath + '/gradle-test-plugin', done);
    });
});
