### 1.9.0 (2020-01-26)
* Update ru.vyarus.java-lib 1.1.2 -> 2.1.0
* Update gradle-github-info-plugin 1.1.0 -> 1.2.0
* Update spock to 1.3

### 1.8.0 (2019-11-24)
* Fix node compatibility: minimal required node is 8.5.0
* Update gradle 4.8.1 -> 5.6.4
* Enable gradle build scan for failed builds
* Update plugin-publish plugin 0.9.10 -> 0.10.1
* Update et.researchgate.release 2.7.0 -> 2.8.1
* Update ru.vyarus.quality 3.1.1 -> 4.0.0
* Update com.github.ben-manes.versions 0.20.0 -> 0.27.0
* Update spock to 1.1 -> 1.2
* Add java11 travis and appveyor builds
* Add support for multi-module model tests (`AbstractTest`)
* Use GradleRunner's debug flag in TestKit tests to avoid manual debugger attachment (`AbstractKitTest`)
* Add plugin portal version badge
* Correct plugin declaration:
    - java-gradle-plugin applied before other plugins
    - Use gradlePlugin section to declare plugin (separate from pluginBundle)
    - Don't generate META-INF/gradle-plugins/gradle.properties file because it will be auto-generated

### 1.7.0 (2018-07-22)
* Update gradle 4.6 -> 4.8.1
* Update et.researchgate.release 2.6.0 -> 2.7.0
* Update com.jfrog.bintray 1.8.0 -> 1.8.4
* Update com.github.ben-manes.versions 0.17.0 -> 0.20.0
* Update ru.vyarus.java-lib 1.0.5 -> 1.1.2
* Update ru.vyarus.quality 3.0.0 -> 3.1.1
* Update pl.droidsonroids.jacoco.testkit 1.0.3 -> 1.0.5
* Apply sleep fix for windows builds (test failures workaround)

NOTE: gradle [STABLE_PUBLISHING](https://docs.gradle.org/4.8/userguide/publishing_maven.html#publishing_maven:deferred_configuration) option is enabled by default

### 1.6.0 (2018-03-27)
* Update gradle 4.1 -> 4.6
* Update plugin-publish plugin 0.9.7 -> 0.9.10
* Update gradle-quality-plugin 2.3.0 -> 3.0.0
* Update gradle-bintray-plugin 1.7.3 -> 1.8.0
* Update gradle-versions-plugin 0.15.0 -> 0.17.0
* Enable coverage support:
    - Add jacoco plugin
    - Add [jacoco-testkit](https://github.com/koral--/jacoco-gradle-testkit-plugin) plugin (get coverage from testkit launches)
    - Enable jacoco support in testkit base test (AbstractKitTest)
* Update travis config:
    - Enable coverage sending to [codecov](https://codecov.io/) (with linux tag)
    - Use openjdk8 for java 7 (older jdks can't be used on recent ubuntu image)
* Remove jdk 6 option (as gradle itself requires jdk 7)    
* Add windows build via [appveyor](https://www.appveyor.com/) 
    - New file .appveyor.yml
    - Coverage uploaded to codecov (with windows flag)
* Update README:
    - Add appveyor and codecov badges    
    - Replace jcenter badge from shields to bintray native badge (because shields bintray support not working)
    - Add summary section

### 1.5.0 (2017-08-17)
* Update gradle 3.3 -> 4.1
* Update gradle-release-plugin 2.5.0 -> 2.6.0
* Update gradle-quality-plugin 2.1.0 -> 2.3.0
* Update gradle-versions-plugin 0.13.0 -> 0.15.0
* Update gradle-java-lib-plugin 1.0.4 -> 1.0.5
* Update spock to 1.0 -> 1.1
* Update travis config: 
    - increase check task timeout to 20 min
    - disable gradle daemon ([recommended](https://docs.gradle.org/4.1/userguide/gradle_daemon.html#when_should_i_not_use_the_gradle_daemon))
    - remove TERM=dump (set automatically by travis)
    - update cache management 

### 1.4.0 (2017-01-24)
* Yeoman generator 1.0 compatibility
* Update gradle 3.0 -> 3.3
* Update gradle-bintray-plugin 1.7.1 -> 1.7.3
* Update gradle-release-plugin 2.4.1 -> 2.5.0
* Update plugin-publish plugin 0.9.5 -> 0.9.7
* Update gradle-quality-plugin 2.0.0 -> 2.1.0

### 1.3.0 (2016-09-06)
* Update gradle 2.14 -> 3.0
* Update com.gradle.plugin-publish plugin 0.9.4 -> 0.9.5
* Update gradle-bintray-plugin 1.6 -> 1.7.1
* Update gradle-versions-plugin 0.12.0 -> 0.13.0
* Update gradle-java-lib-plugin 1.0.2 -> 1.0.4
* Update gradle-quality-plugin 1.3.0 -> 2.0.0
* Update gradle-release-plugin 2.4.0 -> 2.4.1  
* Use @CompileStatic for generated sources

### 1.2.0 (2016-06-16)
* Update gradle 2.9 -> 2.14
  - build.gradle: removed test classpath task used to provide plugin classes for TestKit run (now gradle handle it)
  - build.gradle: use findProperty instead of hasProperty ? lookup : default
  - AbstractKitTest.java: removed classpath file resolution
  - Remove Preconditions usage in generated plugin (gradle transitive deps are not visible now)
* Update gradle-release-plugin 2.3.5 -> 2.4.0  
* Update gradle-java-lib-plugin 1.0.1 -> 1.0.2
* Fix plugin closure name in pluginPublish section (build.gradle)
* Update mode:
  - now able to overwrite travis,yml, .gitignore and gradle script files 
  - fix maven central sync logic

### 1.1.0 (2016-04-15)
* Update com.gradle.plugin-publish plugin 0.9.2 -> 0.9.4
    - Removed plugin portal credential properties hack from generated build.gradle (global properties fixed in plugin)
* Update gradle-versions-plugin 0.11.3 -> 0.12.0
* Update gradle-bintray-plugin 1.5 -> 1.6
* Update gradle-release-plugin 2.3.4 -> 2.3.5
* Update gradle-quality-plugin 1.2.0 -> 1.3.0
* Update gradle-github-info-plugin 1.0.0 -> 1.1.0
    - New plugin will [specify github repo and changelog file](https://github.com/xvik/gradle-github-info-plugin#comjfrogbintray) 
    (if recognize) for bintray package (useful for package creation)
* Improve travis cache configuration (according to [travis guide](https://docs.travis-ci.com/user/languages/java/#Caching))   

### 1.0.0 (2016-01-07)
* initial release 