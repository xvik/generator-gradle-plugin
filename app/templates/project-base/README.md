# <%= projectName %>
[![License](http://img.shields.io/badge/license-MIT-blue.svg)](http://www.opensource.org/licenses/MIT)
[![Build Status](http://img.shields.io/travis/<%= githubUser %>/<%= projectName %>.svg)](https://travis-ci.org/<%= githubUser %>/<%= projectName %>)

### About

<%= pluginPortalDesc %>

Features:
* Feature 1
* Feature 2

### Setup

Releases are published to <% if (mirrorToJcenter) { %>[bintray jcenter](https://bintray.com/<%= bintrayUser %>/<%= bintrayRepo %>/<%= projectName %>/), 
[maven central](https://maven-badges.herokuapp.com/maven-central/<%= projectGroup %>/<%= projectName %>) and <% } %>
[gradle plugins portal](https://plugins.gradle.org/plugin/<%= pluginFullName %>).

<% if (mirrorToJcenter) { %>
<!---
[![JCenter](https://img.shields.io/bintray/v/<%= bintrayUser %>/<%= bintrayRepo %>/<%= projectName %>.svg?label=jcenter)](https://bintray.com/<%= bintrayUser %>/<%= bintrayRepo %>/<%= projectName %>/_latestVersion)
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

-
[![gradle plugin generator](http://img.shields.io/badge/Powered%20by-%20Gradle%20plugin%20generator-green.svg?style=flat-square)](https://github.com/xvik/generator-gradle-plugin)
