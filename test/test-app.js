'use strict';

let path = require('path'),
    assert = require('yeoman-assert'),
    helpers = require('yeoman-test'),
    read = require('fs-readdir-recursive'),
    util = require('util'),
    execFile = util.promisify(require('child_process').execFile);

function remapFiles(dir, target = 'test-plugin/') {
    // append generated project sub-dir
    return read(dir).map(val => target + val)
}

function dotfile(file) {
    return file.replace(/^_|\/_|\\_/, '/.').replace(/^\//, '')
}

function sources(file) {
    return dotfile(file).replace(/(^|\/|\\)package(\/|\\|$)/, '$1com/johnd/testplugin$2')     // replace package
        .replace(/(\/|\\)Project/, '/Test')                                       // replace class prefix
        .replace(/(\/|\\)plugin\.properties/, '/com.johnd.test.properties');  // replace properties file
}

async function runGradle(targetDir, done) {
    const isWin = /^win/.test(process.platform),
        targetFile = 'gradlew' + (isWin ? '.bat' : '');
    const { stdout, stderr } = await execFile(targetFile, ['check'], {cwd: targetDir});
    console.log(stdout);
    console.log(stderr);
    done();
}

describe('check all options enabled', () => {
    const appPath = path.join(__dirname, '../app'),
        targetPath = path.join(__dirname, 'temp');
    let result


    before(async () => {
        result = await helpers.run(appPath)
            .inDir(targetPath)
            .withOptions({offline: true, noglobal: true})
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
                pluginPortalTags: 'java, sample,  plugin',
                centralPublish: true
            });
    });

    it('creates files on initial generation', () => {
        result.assertFile(remapFiles(appPath + '/templates/gradle-base'));
        result.assertFile(remapFiles(appPath + '/templates/project-base').map(dotfile));
        result.assertFile(remapFiles(appPath + '/templates/sources').map(sources));
    });

    it('creates valid project',  async () => {
        await runGradle(targetPath + '/test-plugin',  () => {
            result.assertFileContent(
                'test-plugin/build/resources/main/META-INF/gradle-plugins/com.johnd.test.properties',
                'implementation-class=com.johnd.testplugin.TestPlugin');
        });
    }).timeout(300000); //5 min should be enough to download everything
});

describe('check portal publishing only', () => {
    const appPath = path.join(__dirname, '../app'),
        targetPath = path.join(__dirname, 'temp');
    let result


    before(async () => {
        result = await helpers.run(appPath)
            .inDir(targetPath)
            .withOptions({offline: true, noglobal: true})
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
                pluginPortalTags: 'java, sample,  plugin',
                centralPublish: false,
                pluginPortalUseCustomGroup: false
            });
    });

    it('creates files on initial generation', () => {
        result.assertFile(remapFiles(appPath + '/templates/gradle-base'));
        result.assertFile(remapFiles(appPath + '/templates/project-base').map(dotfile));
        result.assertFile(remapFiles(appPath + '/templates/sources').map(sources));
    });

    it('creates valid project', async () => {
        await runGradle(targetPath + '/test-plugin', () => {
            result.assertFileContent(
                'test-plugin/build/resources/main/META-INF/gradle-plugins/com.johnd.test.properties',
                'implementation-class=com.johnd.testplugin.TestPlugin');
        });
    }).timeout(300000); //5 min should be enough to download everything
});

describe('check portal publishing with custom group', () => {
    const appPath = path.join(__dirname, '../app'),
        targetPath = path.join(__dirname, 'temp');
    let result


    before(async () => {
        result = await helpers.run(appPath)
            .inDir(targetPath)
            .withOptions({offline: true, noglobal: true})
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
                pluginPortalTags: 'java, sample,  plugin',
                centralPublish: false,
                pluginPortalUseCustomGroup: true
            });
    });

    it('creates files on initial generation', () => {
        result.assertFile(remapFiles(appPath + '/templates/gradle-base'));
        result.assertFile(remapFiles(appPath + '/templates/project-base').map(dotfile));
        result.assertFile(remapFiles(appPath + '/templates/sources').map(sources));
    });

    it('creates valid project',  async () => {
        await runGradle(targetPath + '/test-plugin', function () {
            result.assertFileContent(
                'test-plugin/build/resources/main/META-INF/gradle-plugins/com.johnd.test.properties',
                'implementation-class=com.johnd.testplugin.TestPlugin');
        });
    }).timeout(300000); //5 min should be enough to download everything
});

describe('check project name convention', () => {
    const appPath = path.join(__dirname, '../app'),
        targetPath = path.join(__dirname, 'temp');
    let result


    before(async () => {
        result = await helpers.run(appPath)
            .inDir(targetPath)
            .withOptions({offline: true, noglobal: true})
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
                pluginPortalTags: 'java, sample,  plugin',
                centralPublish: true
            });
    });

    it('creates files on initial generation', () => {
        result.assertFile(remapFiles(appPath + '/templates/gradle-base', 'gradle-test-plugin/'));
        result.assertFile(remapFiles(appPath + '/templates/project-base', 'gradle-test-plugin/').map(dotfile));
        result.assertFile(remapFiles(appPath + '/templates/sources', 'gradle-test-plugin/').map(sources));
    });

    it('creates valid project',  async () => {
        await runGradle(targetPath + '/gradle-test-plugin', () => {
            result.assertFileContent(
                'gradle-test-plugin/build/resources/main/META-INF/gradle-plugins/com.johnd.test.properties',
                'implementation-class=com.johnd.testplugin.TestPlugin');
        });
    }).timeout(300000); //5 min should be enough to download everything
});


describe('check complex project name convention', () => {
    const appPath = path.join(__dirname, '../app'),
        targetPath = path.join(__dirname, 'temp');
    let result


    before(async () => {
        result = await helpers.run(appPath)
            .inDir(targetPath)
            .withOptions({offline: true, noglobal: true})
            .withPrompts({
                githubUser: 'johnd',
                authorName: 'John Doe',
                authorEmail: 'johnd@somemail.com',
                projectName: 'gradle-test-subject-plugin',
                projectGroup: 'com.johnd',
                projectPackage: 'com.johnd.testplugin',
                projectVersion: '0.1.0',
                projectDesc: 'Test plugin',
                pluginPortalDesc: 'Test plugin for ...',
                pluginPortalTags: 'java, sample,  plugin',
                centralPublish: true
            });
    });

    it('creates files on initial generation', () => {

        function sources(file) {
            return dotfile(file).replace(/(^|\/|\\)package(\/|\\|$)/, '$1com/johnd/testplugin$2')     // replace package
                .replace(/(\/|\\)Project/, '/TestSubject')                                       // replace class prefix
                .replace(/(\/|\\)plugin\.properties/, '/com.johnd.test-subject.properties');  // replace properties file
        }

        result.assertFile(remapFiles(appPath + '/templates/gradle-base', 'gradle-test-subject-plugin/'));
        result.assertFile(remapFiles(appPath + '/templates/project-base', 'gradle-test-subject-plugin/').map(dotfile));
        result.assertFile(remapFiles(appPath + '/templates/sources', 'gradle-test-subject-plugin/').map(sources));
    });

    it('creates valid project', async () => {
       await runGradle(targetPath + '/gradle-test-subject-plugin', () => {
            result.assertFileContent(
                'gradle-test-subject-plugin/build/resources/main/META-INF/gradle-plugins/com.johnd.test-subject.properties',
                'implementation-class=com.johnd.testplugin.TestSubjectPlugin');
        });
    }).timeout(300000); //5 min should be enough to download everything
});
