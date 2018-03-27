# Gradle plugin yeoman generator

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](http://www.opensource.org/licenses/MIT)
[![NPM version](https://img.shields.io/npm/v/generator-gradle-plugin.svg)](http://badge.fury.io/js/generator-gradle-plugin)
[![Build Status](https://secure.travis-ci.org/xvik/generator-gradle-plugin.png)](https://travis-ci.org/xvik/generator-gradle-plugin)

### About

Generates gradle plugin project configured to publish to plugins portal and (optionally) to jcenter (and maven central).
Project assumes hosting on github.

Features:
* [MIT](http://opensource.org/licenses/MIT) license (hardcoded)
* Plugin sample
* Tests samples with ProjectBuilder and TestKit
* Configured for publishing to plugins portal, jcenter and maven central
* CI: [travis](https://travis-ci.org/) (linux), [appveyor](https://www.appveyor.com/) (windows)
* Coverage with jacoco, merged from both win and linux builds in [codecov.io](https://codecov.io/)
* Code quality checks with CodeNarc
* [Release process](https://github.com/researchgate/gradle-release#introduction) (like maven release)

### Known issue

Gradle 2.13+ has a [bug with console input](https://issues.gradle.org/browse/GRADLE-3446). As a result, 
during release version confirm questions are [not visible](https://github.com/researchgate/gradle-release/issues/185).

Issue is not blocking and only affects release process: simply hit enter for questions (and be sure version in properties file is correct). 

### Example projects

* [gradle-quality-plugin](https://github.com/xvik/gradle-quality-plugin)
* [gradle-mkdocs-plugin](https://github.com/xvik/gradle-mkdocs-plugin)
* [gradle-use-python-plugin](https://github.com/xvik/gradle-use-python-plugin)
* [gradle-pom-plugin](https://github.com/xvik/gradle-pom-plugin)
* [gradle-java-lib-plugin](https://github.com/xvik/gradle-java-lib-plugin)
* [gradle-github-info-plugin](https://github.com/xvik/gradle-github-info-plugin)
* [gradle-animalsniffer-plugin](https://github.com/xvik/gradle-animalsniffer-plugin)

### Important

Gradle propose to publish plugins to [plugins portal](https://plugins.gradle.org). This would be ideal solution if
gradle plugins repository support indexes. Without indexes versions plugins (like ben-manes.versions) are useless 
(they are not able to resolve available versions).
That's why its better to publish plugin also to jcenter (repository with maven index).
  
By default, when plugin published to plugins portal, its group is prefixed with 'gradle.plugin' (so if your group was 'com.foo', 
real artifact group will be 'gradle.plugin.com.foo'). Such default behaviour grants immediate plugin publishing.
If you want to mirror plugin on jcenter its better to force your group name. In this case plugin will require manual approve
before it appears on portal (it should be approved within 1 day, but in my case it was two weeks). After approve you can
publish new plugins with the same group without approve (the same like in maven central).

Generator supports all possible options (based on your answers):
* publish to plugins portal only with default group (portal will prepended 'gradle.plugin' to your group)
* publish to plugins portal only with forced group (requires approve)
* publish to plugins portal with forced group and to jcenter (optionally to maven central) 

Note: plugin-publish plugin use its own tasks to prepare published artifacts. In order to upload to jcenter
project will use different tasks (defined by java-lib plugin). So artifacts published to plugin portal and to jcenter will be different (jars content will be 
almost identical, but they will be build by different tasks).

### Setup

Install [yeoman](http://yeoman.io/):

```bash
$ npm install -g yo
```

Install generator:

```bash
$ npm install -g generator-gradle-plugin
```

### Github setup

You will need [github](https://github.com) user. Create it if you don't have already.

### Gradle user

You will need [gradle user](https://login.gradle.org/user/login) to upload to plugins portal.

In your profile page go to API keys tab and generate api key.
Add key and secret to `~/.gradle/gradle.properties`

```
gradle.publish.key=
gradle.publish.secret=
```

### Bintray setup

Bintray automates files signing and maven central publishing.
Project already generates valid artifacts for maven central, you just need to configure bintray.

Sign up [bintray](https://bintray.com/) and create maven repository to upload artifacts to (it's name is one of generator questions).

[Follow instruction](https://medium.com/@vyarus/the-hard-way-to-maven-central-c9e16d163acc)

Add bintray user and key to `~/.gradle/gradle.properties`

```
bintrayUser=username
bintrayKey=secretkey
```

If you will use automatic signing and certificate requires passphrase:

```
gpgPassphrase=passphrase
```

If you will use automatic maven central publishing add:

```
sonatypeUser=username
sonatypePassword=password
```

Generator will check and warn you if something is not configured.

### Usage

> General convention: project name == github project name == bintray package page

Run generator:

```bash
$ yo gradle-plugin
```

Generator creates project in current folder if project name (question) is the same as current directory,
and will create subdirectory otherwise.

Generator calls github to validate user correctness and suggest your name and email. If there is a problem with it use offline mode:

```bash
$ yo gradle-plugin --offline
```

NOTE: even if you chose syncing with maven central, build.gradle will contain false on initial generation, because
it's impossible to use it on first release (package needs to be added to jcenter). See release section for more details.
Anyway, your answer will be stored and on update (next generation) correct value will be set to config.

Project setup ready, start coding!

#### Build upgrade

If you preserve `.yo-rc.json` file (your answers) in generated project root you will be able to use update mode.

Run generator project directory:

```bash
$ cd my-project
$ yo gradle-plugin 
```

Generator will work in update mode: it will use answers stored in .yo-rc.json and re-generate project files.
It will not generate sample sources again and also will not touch: CHANGELOG.md, README.md, gradle.properties, LICENSE and settings.gradle.

It updates:
* Project gradle (wrapper files, scripts and version in build.gradle)
* Plugin versions (build.gradle)
* Travis config
* gitignore

This mode is useful when project isn't changed much after generation. In case when you have multiple projects 
it greatly simplifies projects upgrade: doing all changes manually could lead to forgotten changes, 
but with generator its impossible to forget something because all changes are always done.

Start update without local changes and after generation look git changes and correct
(usually only main build.gradle requires modifications after update).

#### Global storage

Most likely, some answers will be the same for all your plugins, that's why they are stored in global config and
you will see more precise defaults on next generation.

Global config stored in `~/.config/configstore/generator-gradle-plugin.json`

### External services

Create [github](https://github.com) repo matching your plugin name and push project there (github will guide you).

In github project settings go to `Webhooks & services` and add `travis-ci` service.

Enable repository on services:
* [travis](https://travis-ci.org/)
* [appveyor](https://www.appveyor.com/) 

And after next commit windows and linux builds will be performed automatically and combined coverage report
will be available on [codecov](https://codecov.io/) (badges for all services are already generated in readme). 

Bintray and maven central badges are generated in readme, but commented (uncomment before release).

### Project usage

```bash
$ gradlew check
```

Runs code quality plugins. If quality checks were activated (asked during generation) do check before pushing to avoid
build failures on travis. Moreover, it's easy to always keep everything clean instead of doing it before release.

```bash
$ gradlew dependencyUpdates
```

Checks if your project dependencies are actual and prints versions analysis report to console.

```bash
$ gradlew dependencies
```

Prints dependencies tree into console

```bash
$ gradlew showDependenciesTree
```

Generates dependencies html report and launch it in default browser.
To analyze conflicts, click on dependency name to activate
[dependencyInsight](http://www.gradle.org/docs/current/groovydoc/org/gradle/api/tasks/diagnostics/DependencyInsightReportTask.html) popup.

```bash
$ gradlew install
```

Installs plugin to local maven repository. Useful for referencing by other projects (for testing without releasing plugin).
For example, to use not released but installed to local maven in gradle project:

```groovy
buildscript {
    repositories { mavenLocal() }
    classpath 'group:artifact:version-SNAPSHOT'
}
apply plugin: 'my.plugin'
```

```bash
$ gradlew release
```

Releases plugin. Read release process section below before performing first release.

### Project details

[Sample build file](https://github.com/xvik/generator-gradle-plugin/wiki/Build-file-annotated) with comments.

Note that gradle api dependencies are not specified directly, but project will implicitly have 
`localGroovy()`, `gradleApi()` and `gradleTestKit()` dependencies applied by [java-gradle-plugin](https://docs.gradle.org/current/userguide/javaGradle_plugin.html)

Used gradle plugins:
* [groovy](http://www.gradle.org/docs/current/userguide/groovy_plugin.html) as main used language
* [jacoco](https://docs.gradle.org/current/userguide/jacoco_plugin.html) for coverage recording
* [java-gradle-plugin](https://docs.gradle.org/current/userguide/javaGradle_plugin.html) assist plugin development
* [com.gradle.plugin-publish](https://plugins.gradle.org/docs/publish-plugin) to publish to gradle plugins portal
* [maven-publish](http://www.gradle.org/docs/current/userguide/publishing_maven.html) to generate pom and publish to maven repository
* [project-report](http://www.gradle.org/docs/current/userguide/project_reports_plugin.html) to generate dependency tree html report
* [codenarc](https://docs.gradle.org/current/userguide/codenarc_plugin.html) to check quality with [CodeNarc](http://codenarc.sourceforge.net/index.html)
* [com.jfrog.bintray](https://github.com/bintray/gradle-bintray-plugin) for bintray publishing
* [com.github.ben-manes.versions](https://github.com/ben-manes/gradle-versions-plugin) to check dependencies versions updates
* [net.researchgate.release](https://github.com/researchgate/gradle-release) for release (see [article](http://www.sosaywecode.com/gradle-release-plugin/) for additional plugin details)
* [ru.vyarus.pom](https://github.com/xvik/gradle-pom-plugin) for simpler pom generation
* [ru.vyarus.java-lib](https://github.com/xvik/gradle-java-lib-plugin) to prepare java artifacts setup
* [ru.vyarus.github-info](https://github.com/xvik/gradle-github-info-plugin) to fill in github specific data
* [ru.vyarus.quality](https://github.com/xvik/gradle-quality-plugin) to configure codenarc plugin and provide advanced reporting
* [pl.droidsonroids.jacoco.testkit](https://github.com/koral--/jacoco-gradle-testkit-plugin) to spport coverage recordings in testkit based tests

### Quality

CodeNarc quality plugin is configured by [ru.vyarus.quality plugin](https://github.com/xvik/gradle-quality-plugin).

Read more about [plugin specifics and how to suppress warnings](http://xvik.github.io/gradle-quality-plugin/3.0.0/tool/codenarc/)

By default, quality checks fail build if any violation found. In order to simply report violations do:

```groovy
quality {
    strict = false
}
```

### Testing

Generator will genarate sample plugin and two types of tests:
* With [ProjectBuilder](https://docs.gradle.org/current/javadoc/org/gradle/testfixtures/ProjectBuilder.html)
* Using [TestKit](https://docs.gradle.org/current/userguide/test_kit.html)

Project build tests are good for checking configuration. They run in the same vm and so they are fast.

TestKit tests are useful to validate tasks execution (especially if there are files operations involved). These tests use 
real gradle build run. TestKit tests may be launched even for [different gradle versions](https://docs.gradle.org/current/javadoc/org/gradle/testkit/runner/GradleRunner.html#withGradleVersion(java.lang.String)).

For more tests examples see [my plugins](#example-projects) sources. 

NOTE: if tests failed to run in your IDE, then run tests from gradle first (tests task). Gradle generates classpath file before running TestKit tests 
(tests can't work without this file). When tests run from IDE, file generation is not triggered automatically, so have to keep in mind this workaround.

### Release process

#### Before first release

When releasing first time it's better to do

```bash
$ gradlew install
```

And validate generated pom file and jars (in local maven repository ~/.m2/repository/..).

NOTE: Release plugin requires access to git repository without credentials, so it's
better to allow storing credentials when using git console.
Windows users with sysgit 1.8.1 and up could use:

```bash
$ git config --global credential.helper wincred
```

To [avoid problems](https://github.com/townsfolk/gradle-release/issues/81).

Bintray and maven central badges are commented in readme - uncomment them (remove maven badge if not going to publish there)

Automatic maven central publication is impossible on first release, because package is not yet in jcentral (we will enable it after).

#### General release process

Update `CHANGELOG.md`.

Push all changes before release and wait for `travis` to check build (wait for green badge).

Perform release:

```bash
$ gradlew release
```

Release will check that current copy is actual: no uncommitted/unversioned/unpushed changes, nothing newer is in remote repository.
You can start releasing either from snapshot version (1.0.0-SNAPSHOT) or from normal one (1.0.0).

During release, plugin will create tag (new github release appear) and update version in `gradle.properties`.

You may want to create github release: release will only create tag. To create release go to github releases, click on tag and press 'edit'.
I usually use text from changelog as release message, but you may expand it with other release specific notes.

#### After first release

Github repository name and changelog file will be [automatically configured](https://github.com/xvik/gradle-github-info-plugin#comjfrogbintray) 
for bintray plugin. If you renamed changelog file from CHANGELOG.md then you will have to [specify it's name](https://github.com/xvik/gradle-github-info-plugin#available-properties)
(or configure it manually on bintray package edit page).
Go to your bintray package page, click on 'readme' tab and select 'github page'.
Do the same on 'release notes' tab (to show CHANGELOG.md file).

After actual release press 'add to jcenter' button to request jcenter linking (required for maven central publication
and even if you don't want to sync to maven central, linking to jcenter will simplify library usage for end users).

After acceptance in jcenter (approve takes less than 1 day) do manual maven central synchronization in bintray ui.

Now automatic maven central publication could be enabled in project config `build.gradle`:

```
bintray {
        ...
        mavenCentralSync {
            sync = true
```

Note that maven publication requires files signing option active too (if you not choose it during project generation):

```
        gpg {
            sign = true
```

All future releases will publish to maven central automatically.

#### If release failed

Nothing bad could happen.

If bintray upload failed, you can always upload one more time.
If you uploaded bad version and want to re-release it, simply remove version files on bintray package version page and re-do release.

If release failed, but plugin already commit new version - you can release again from this state (no need to revert).

Release plugin changes only version in `gradle.properties` and creates git tag.
Version could be reverted manually (by correcting file) and git tag could be also removed like this:

```bash
git tag -d release01
git push origin :refs/tags/release01
```

