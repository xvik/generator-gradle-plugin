# <%= projectName %>
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](http://www.opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/travis/<%= githubUser %>/<%= projectName %>.svg)](https://travis-ci.org/<%= githubUser %>/<%= projectName %>)
[![Appveyor build status](https://ci.appveyor.com/api/projects/status/github/<%= githubUser %>/<%= projectName %>?svg=true)](https://ci.appveyor.com/project/<%= githubUser %>/<%= projectName %>)
[![codecov](https://codecov.io/gh/<%= githubUser %>/<%= projectName %>/branch/master/graph/badge.svg)](https://codecov.io/gh/<%= githubUser %>/<%= projectName %>)

### About

<%= pluginPortalDesc %>

Features:
* Feature 1
* Feature 2

##### Summary

* Configuration: `<%= pluginName %>`
* Tasks:
    - `task1` - brief task description       

### Setup

Releases are published to <% if (mirrorToJcenter) { %>[bintray jcenter](https://bintray.com/<%= bintrayUser %>/<%= bintrayRepo %>/<%= projectName %>/), 
[maven central](https://maven-badges.herokuapp.com/maven-central/<%= projectGroup %>/<%= projectName %>) and <% } %>
[gradle plugins portal](https://plugins.gradle.org/plugin/<%= pluginFullName %>).

<% if (mirrorToJcenter) { %>
<!---
[![JCenter](https://api.bintray.com/packages/<%= bintrayUser %>/<%= bintrayRepo %>/<%= projectName %>/images/download.svg)](https://bintray.com/<%= bintrayUser %>/<%= bintrayRepo %>/<%= projectName %>/_latestVersion)
[![Maven Central](https://img.shields.io/maven-central/v/<%= projectGroup %>/<%= projectName %>.svg)](https://maven-badges.herokuapp.com/maven-central/<%= projectGroup %>/<%= projectName %>)
-->

```groovy
buildscript {
    repositories {
        jcenter()
    }
    dependencies {
        classpath '<%= projectGroup %>:<%= projectName %>:<%= projectVersion %>'
    }
}
apply plugin: '<%= pluginFullName %>'
```

OR <% } %>

```groovy
plugins {
    id '<%= pluginFullName %>' version '<%= projectVersion %>'
}
```

### Usage

---
[![gradle plugin generator](http://img.shields.io/badge/Powered%20by-%20Gradle%20plugin%20generator-green.svg?style=flat-square)](https://github.com/xvik/generator-gradle-plugin)
