'use strict';

const chalk = require('chalk'),
    JavaGenerator = require('yo-java-helper');

/**
 * Generator variables, available for templates:
 */
const questions = [
    'githubUser',                   // github user name
    'authorName',                   // author full name
    'authorEmail',                  // author email
    'projectName',                  // project name
    'projectGroup',                // maven artifact group
    'projectPackage',              // base package
    'projectVersion',              // plugin version
    'projectDesc',                  // short description
    'pluginPortalDesc',            // full description for plugin portal
    'targetJava',                   // target java version (lowest supported), it's not the jdk we build with
    'pluginPortalTags',            // tags for plugin portal
    'mirrorToJcenter',             // publish to bintray (and optionally maven central)
    'pluginPortalUseCustomGroup', // if true custom group used (requires approve on portal), true when jcenter mirror active
    'bintrayUser',                  // bintray user name
    'bintrayRepo',                  // target bintray maven repository name
    'bintrayTags',                  // tags for bintray package (array)
    'bintraySignFiles',            // true if files signing enabled
    'mavenCentralSync'             // true to sync with maven central (must be false on first release)
];

/* extra variables:
 *  - year                   // 2015
 *  - date                   // 02.12.2015
 *  - reverseDate            // 2015-12-02
 *  - pluginName             // most likely plugin name differs from project name (gradle-smth-plugin vs smt)
 *  - pluginFullName         // plugin full name (group.name)
 *  - pluginClassPrefix      // generated from project name to use for class prefixes
 *  - pluginExtensionName    // name for extension
 */

/*
 Templates syntax:
 - <%= %> html escaped value
 - <%- %> not escaped (raw) value
 - <% %> any logic (script block)
 */

const globals = [
    'githubUser',
    'authorName',
    'authorEmail',
    'projectGroup',
    'mirrorToJcenter',
    'pluginPortalUseCustomGroup',
    'bintrayUser',
    'bintrayRepo'
];


module.exports = class extends JavaGenerator {

    constructor(args, opts) {
        super(args, opts, require('../package.json'));

        this.option('offline', {
            desc: 'Disables github user lookup',
            type: Boolean,
            defaults: false
        });
        this.option('ask', {
            desc: 'Force questions even all answers available (during project update)',
            type: Boolean,
            defaults: false
        });

        this.option('noglobal', {
            desc: 'Don\'t store answers globally',
            type: Boolean,
            defaults: false
        });
    }

    initializing() {
        // init
        this.$initConfig(questions);
        this.$initDateVars();


        // read gradle config
        const done = this.async();
        this.context.gradleConfPath = this.$resolveFileFromUserHome('.gradle/gradle.properties');
        this.$readProperties(this.context.gradleConfPath, res => {
            this.context.gradleConf = res;
            done();
        });
    }

    prompting() {
        // greeting
        this.log(chalk.yellow(this.$readBanner('banner.txt')));
        this.log(`                                                                               v.${chalk.green(this.context.pkg.version)}`);
        this.log();
        if (this.context.updateMode) {
            this.log(`Updating plugin ${chalk.red(this.appname)}, generated with v.${chalk.green(this.context.usedGeneratorVersion)}`);
            if (this.context.allAnswered && !this.options.ask) {
                this.log();
                this.log('Using stored answers from .yo-rc.json. \n' +
                    'If you need to re-run questions use --ask generator option.');
            }
            this.log();
        }

        // ask for github
        const options = this.options;
        if (!options.ask && this.context.allAnswered) {
            return;
        }

        let githubData = {},
            gen = this,
            prompts = [
                {
                    type: 'input',
                    name: 'githubUser',
                    message: 'GitHub user name',
                    default: this.$defaultValue('githubUser'),
                    validate: function (input) {
                        return new Promise((resolve) => {
                            if (options.offline) {
                                if (input) {
                                    resolve(true);
                                } else {
                                    resolve('Github user required');
                                }
                                return;
                            }
                            gen.$getGithubData(input, (err, res) => {
                                if (err) {
                                    resolve(err);
                                } else {
                                    githubData = res;
                                    resolve(true);
                                }
                            });
                        });
                    }
                },
                {
                    type: 'input',
                    name: 'authorName',
                    message: 'Author name',
                    default: () => githubData.name || this.$defaultValue('authorName'),
                    validate: input => !input ? 'Author name required' : true
                },
                {
                    type: 'input',
                    name: 'authorEmail',
                    message: 'Author email',
                    default: () => githubData.email || this.$defaultValue('authorEmail'),
                    validate: input => !input ? 'Author email required' : true
                }
            ];

        let other = () => {
            if (this.context.allAnswered && !this.options.ask) {
                return;
            }

            const disableOnUpdate = () => !this.context.updateMode;

            prompts = [
                {
                    type: 'input',
                    name: 'projectGroup',
                    message: 'Maven artifact group',
                    validate: this.$validatePackage,
                    default: this.$defaultValue('projectGroup', 'com.mycompany')
                },
                {
                    type: 'input',
                    name: 'projectPackage',
                    message: 'Base package',
                    validate: this.$validatePackage,
                    when: disableOnUpdate,
                    default: props => this.projectPackage || props.projectGroup + '.' + this.projectName
                        .replace(/gradle-|-plugin/g, '').replace(/(\s+|-|_)/g, '.')
                },
                {type: 'input', name: 'projectDesc', message: 'Short description', default: this.projectDesc},
                {
                    type: 'input',
                    name: 'pluginPortalDesc',
                    message: 'Plugin portal description',
                    default: this.pluginPortalDesc
                },
                {
                    type: 'input',
                    name: 'pluginPortalTags',
                    message: 'Tags for plugin portal (comma separated list)',
                    default: this.pluginPortalTags
                },
                {
                    type: 'input',
                    name: 'projectVersion',
                    message: 'Version',
                    default: '0.1.0',
                    when: disableOnUpdate
                },
                {
                    type: 'list',
                    name: 'targetJava',
                    message: 'Target java version (the lowest version you want to be compatible with)',
                    default: this.targetJava || '1.7',
                    choices: [
                        {value: '1.7', name: 'Java 7'},
                        {value: '1.8', name: 'Java 8'}
                    ]
                },
                {
                    type: 'confirm',
                    name: 'mirrorToJcenter',
                    message: 'Should plugin aslo be published on bintray?',
                    default: this.mirrorToJcenter || true
                },
                {
                    type: 'confirm',
                    name: 'pluginPortalUseCustomGroup',
                    message: 'Should plugin use custom group?',
                    default: this.pluginPortalUseCustomGroup || true,
                    when: props => !props.mirrorToJcenter
                },
                {
                    type: 'input',
                    name: 'bintrayUser',
                    message: 'Bintray user name (used for badge generation only)',
                    default: this.$defaultValue('bintrayUser'),
                    validate: input => !input ? 'Bintray user name required' : true,
                    when: props => props.mirrorToJcenter
                },
                {
                    type: 'input',
                    name: 'bintrayRepo',
                    message: 'Bintray maven repository name',
                    default: this.$defaultValue('bintrayRepo'),
                    validate: input => !input ? 'Bintray repository name required' : true,
                    when: props => props.mirrorToJcenter
                },
                {
                    type: 'input',
                    name: 'bintrayTags',
                    message: 'Tags for bintray package (comma separated list)',
                    default: this.bintrayTags,
                    when: props => props.mirrorToJcenter
                },
                {
                    type: 'confirm',
                    name: 'bintraySignFiles',
                    message: 'Should bintray sign files on release (bintray must be configured accordingly)?',
                    default: this.bintraySignFiles || true,
                    when: props => props.mirrorToJcenter
                },
                {
                    type: 'confirm',
                    name: 'mavenCentralSync',
                    message: 'Should bintray publish to maven central on release?',
                    default: this.mavenCentralSync || true,
                    when: props => props.mirrorToJcenter
                }
            ];

            return this.$prompt(prompts, questions);
        };

        let askLibName = () => {
            if (this.context.updateMode) {
                // update must be started from project folder - no need to ask for name
                return;
            }

            this.log(`Accept default library name ${chalk.red(this.appname)} to generate in current folder, otherwise new folder will be created`);

            prompts = [{
                name: 'projectName',
                message: 'Project name (gradle-<plugin name>-plugin)',
                default: this.projectName || this.appname,
                filter: this.$folderName
            }];

            return this.$prompt(prompts, ['projectName']).then(props => {
                this.appname = props.projectName;
                return other();
            });
        };

        return this.$prompt(prompts, questions).then(askLibName);
    }

    configuring() {

        // configure
        if (!this.mirrorToJcenter) {
            this.bintraySignFiles = false;
            this.mavenCentralSync = false;
            this.bintrayUser = '';
            this.bintrayRepo = '';
            this.bintrayTags = '';
            this.bintraySignFiles = false;
            this.mavenCentralSync = false;
        } else {
            this.pluginPortalUseCustomGroup = true;
        }

        this.$selectTargetFolder();
        this.$saveConfiguration(questions, this.options.noglobal ? [] : globals);

        if (!this.context.updateMode) {
            // synchronization with maven central is impossible on first release, but later
            // it must be set to true (if required)
            // so always set it as false on initial generation
            this.mavenCentralSync = false;
        }

        this.bintrayTags = this.$quoteTagsList(this.bintrayTags);
        this.pluginPortalTags = this.$quoteTagsList(this.pluginPortalTags);
        this.pluginName = this.projectName.replace(/gradle-|-plugin/g, '');
        this.pluginClassPrefix = this.$generateProjectClassPrefix(this.pluginName);
        this.pluginFullName = `${this.projectGroup}.${this.pluginName}`;
        this.pluginExtensionName = this.pluginClassPrefix.substring(0, 1).toLowerCase() + this.pluginClassPrefix.substring(1);

        // select java version
        const travis = {
            '1.7': 'openjdk8',
            '1.8': 'openjdk8'
        };
        this.travisJdk = travis[this.targetJava];
    }

    writing() {
        // base
        const writeOnceFiles = [
            'CHANGELOG.md',
            'README.md',
            'gradle.properties',
            'LICENSE',
            'settings.gradle'
        ];
        this.gradlewExists = this.$exists('gradlew');
        this.$copy('gradle-base', {writeOnceFiles: writeOnceFiles});
        this.$copyTpl('project-base', {writeOnceFiles: writeOnceFiles});


        // sources
        if (!this.$exists('src/main')) {
            this.$copySources(this.projectPackage, 'sources', [
                {regex: /\/Project/, replace: '/' + this.pluginClassPrefix},
                {regex: /\/plugin\.properties/, replace: `/${this.pluginFullName}.properties`}
            ]);
        } else {
            this.log(chalk.yellow('     skip ') + 'sources generation');
        }
    }

    end() {
        // chmod
        // setting executable flag manually
        if (!this.gradlewExists) {
            this.$setExecutableFlag('gradlew');
        }

        // check gradle config
        let conf = this.context.gradleConf || {},
            warnBintray = this.mirrorToJcenter && (!conf.bintrayUser || !conf.bintrayKey),
            warnSign = this.bintraySignFiles && !conf.gpgPassphrase,
            warnCentral = this.config.get('mavenCentralSync') && (!conf.sonatypeUser || !conf.sonatypePassword),
            warnPortal = !conf['gradle.publish.key'] || !conf['gradle.publish.secret'];

        if (!warnBintray && !warnSign && !warnCentral && !warnPortal) {
            return;
        }

        this.log();
        this.log(chalk.red('IMPORTANT') + ' you need to add the following configurations to global gradle file (required for release): ' +
            '\n ' + chalk.green(this.context.gradleConfPath));
        if (warnPortal) {
            this.log();
            this.log(chalk.yellow('gradle.publish.key') + '=<plugins portal key>');
            this.log(chalk.yellow('gradle.publish.secret') + '=<plugins portal secret>');
        }
        if (warnBintray) {
            this.log();
            this.log(chalk.yellow('bintrayUser') + '=' + this.bintrayUser);
            this.log(chalk.yellow('bintrayKey') + '=<api key (go to bintray profile page, hit edit and access "api keys" section>');
        }
        if (warnSign) {
            this.log();
            this.log('If your gpg certificate requires passphrase you need to configure it (for automatic signing):');
            this.log(chalk.yellow('gpgPassphrase') + '=<gpgPassphrase>');
        }
        if (warnCentral) {
            this.log();
            this.log('If you going to automatically sync with maven central, you need to configure sonatype user:');
            this.log(chalk.yellow('sonatypeUser') + '=<sonatype user>');
            this.log(chalk.yellow('sonatypePassword') + '=<sonatype password>');
        }


        // maven central notice
        if (this.config.get('mavenCentralSync') && !this.context.updateMode) {
            this.log();
            this.log(chalk.red('IMPORTANT') + ' Maven central sync is impossible on first release, so ' +
                'it was set to false in build.gradle (read doc for more details).');
        }
    }
};
