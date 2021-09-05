# Gradle plugin yeoman generator

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](http://www.opensource.org/licenses/MIT)
[![NPM version](https://img.shields.io/npm/v/generator-gradle-plugin.svg)](http://badge.fury.io/js/generator-gradle-plugin)
[![Build Status](https://travis-ci.com/xvik/generator-gradle-plugin.svg?branch=master)](https://travis-ci.com/xvik/generator-gradle-plugin)

### About

Generates gradle plugin project configured to publish to plugins portal and (optionally) to jcenter (and maven central).
Project assumes hosting on github.

Features:
* [MIT](http://opensource.org/licenses/MIT) license (hardcoded)
* Plugin sample
* Tests samples with ProjectBuilder and TestKit
* Configured for publishing to plugins portal and maven central
* CI: github actions (linux), [appveyor](https://www.appveyor.com/) (windows)
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

Gradle propose publishing plugins to [plugins portal](https://plugins.gradle.org),
but some users prefer using plugins only from maven central (for security reasons), so it
is a good idea to publish into both.
  
By default, when plugin published to plugins portal, its group is prefixed with 'gradle.plugin' (so if your group was 'com.foo', 
real artifact group will be 'gradle.plugin.com.foo'). Such default behaviour grants immediate plugin publishing.
If you want to mirror plugin on maven central it's better to force your group name. In this case plugin will require manual approve
before it appears on portal (it should be approved within 1 day, but in my case it was two weeks). After approve you can
publish new plugins with the same group without approve (the same as in maven central).

Generator supports all possible options (based on your answers):
* publish to plugins portal only with default group (portal will prepend 'gradle.plugin' to your group)
* publish to plugins portal only with forced group (requires approve)
* publish to plugins portal with forced group and to jcenter (optionally to maven central) 

Note: plugin-publish plugin use its own tasks to prepare published artifacts. In order to upload to maven central
project will use different tasks (defined by java-lib plugin). So artifacts published to plugin portal and maven central 
will be different (jars content will be almost identical, but they will be build by different tasks).

NOTE: you can also publish plugins into local repository (e.g. internal nexus), but 
you'll have to manually modify generated project (generate with maven central publication) - read below.

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

### Maven central setup

For maven central publication you must first register in sonatype and approve your group.
Read this a bit [outdated article](https://medium.com/@vyarus/the-hard-way-to-maven-central-c9e16d163acc)
for getting started.

For certificate generation see [java-lib plugin docs](https://github.com/xvik/gradle-java-lib-plugin#signing)
Note that signing configuration required only for release (otherwise its ignored)

After all you'll need to put the following properties into `~/.gradle/gradle.properties`

```
sonatypeUser =
sonatypePassword =

signing.keyId = 78065050
signing.password =
signing.secretKeyRingFile = /path/to/certs.gpg
```

Generator will check and warn you if something is not configured.

### Publishing plugin to local repository only

If plugin is assumed to be used as internal plugin with local (corporate) maven repo, manual modifications required. 

Generate project for maven central publication.

Remove `com.gradle.plugin-publish` (no need to publish to portal) and `io.github.gradle-nexus.publish-plugin`.

Remove `ru.vyarus.github-info` (I assume your source would not be in github). And remove related
`github` configuration block. 

Remove `signing` plugin if you don't need to sign artifacts for your repository.

Configure repository:

```groovy
publishing {
    repositories {
        maven {
            url project.version.contains("SNAPSHOT")
                    ? "https://my-private-nexus.com/nexus/content/repositories/my-snapshots"
                    : "https://my-private-nexus.com/nexus/content/repositories/my-releases"
            credentials {
                username = project.findProperty('myRepoUser')
                password = project.findProperty('myRepoPass')
            }
        }
    }
}
```

Disable gradle-plugin publication (normally used for portal publication):

```groovy
tasks.withType(AbstractPublishToMaven) { Task task ->
    if (task.name.startsWith("publishPluginMaven")) {
        task.enabled(false)
    }
}
```

NOTE: there is still an additional publication used: gradle would publish 
[marker artifact](https://docs.gradle.org/current/userguide/plugins.html#sec:plugin_markers) required for plugins syntax.

Change releasing task:

```groovy
afterReleaseBuild {
    dependsOn = [publish]
```

Now simple `publish` task deploys snapshot version and `release` task would perform complete release
(with version change and tagging git).

To use plugins from custom repo add to settings.gradle (in project requiring published plugin):

```groovy
pluginManagement {
    repositories {
        maven {
            // usually root repo combining releases and snapshots
            url 'https://my-private-nexus.com/nexus/content/groups/my/'
        }
        gradlePluginPortal()
    }
}
```

With it plugin from custom repo could be enabled in `plugins` section the same way as plugin
from gradle portal (thanks to additionally published marker artifact).

### Usage

> General convention: project name == github project name

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
* Gradle configs: build.gradle, settings.gradle
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

Enable repository on [appveyor](https://www.appveyor.com/) 

And after next commit windows and linux builds will be performed automatically and combined coverage report
will be available on [codecov](https://codecov.io/) (badges for all services are already generated in readme). 

Maven central and gradle portal badges are generated in readme.

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
$ gradlew openDependencyReport
```

Generates dependencies html report and launch it in default browser.
To analyze conflicts, click on dependency name to activate
[dependencyInsight](http://www.gradle.org/docs/current/groovydoc/org/gradle/api/tasks/diagnostics/DependencyInsightReportTask.html) popup.

```bash
$ gradlew install
```

Installs plugin to local maven repository. Useful for referencing by other projects (for testing without releasing plugin).

NOTE: gradle will complain about multiple publications with the same coordinates - that's fine
(install publish all publications - one prepared for central and another used by gradle portal publication)

For example, to use not released but installed to local maven in gradle project:

```groovy
buildscript {
    repositories { mavenLocal() }
    classpath 'group:artifact:version-SNAPSHOT'
}
apply plugin: 'my.plugin'
```

(or just puty snapshot version in plugins section if settings.gradle contains mavenLocal for plugins resolution)

```bash
$ gradlew release
```

Releases plugin. Read release process section below before performing first release.

### Project details

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
* [o.github.gradle-nexus.publish-plugin](https://github.com/gradle-nexus/publish-plugin) to simplify maven central publication
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
