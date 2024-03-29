# <%= projectName %>
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](http://www.opensource.org/licenses/MIT)
[![CI](https://github.com/<%= githubUser %>/<%= projectName %>/actions/workflows/CI.yml/badge.svg)](https://github.com/<%= githubUser %>/<%= projectName %>/actions/workflows/CI.yml)
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

<% if (centralPublish) { %>
[![Maven Central](https://img.shields.io/maven-central/v/<%= projectGroup %>/<%= projectName %>.svg)](https://maven-badges.herokuapp.com/maven-central/<%= projectGroup %>/<%= projectName %>)
<% } %>
[![Gradle Plugin Portal](https://img.shields.io/maven-metadata/v/https/plugins.gradle.org/m2/<%= projectGroup %>/<%= pluginName %>/<%= pluginFullName %>.gradle.plugin/maven-metadata.xml.svg?colorB=007ec6&label=plugins%20portal)](https://plugins.gradle.org/plugin/<%= pluginFullName %>)

```groovy
plugins {
    id '<%= pluginFullName %>' version '<%= projectVersion %>'
}
```

OR

```groovy
buildscript {
    repositories {
        gradlePluginPortal()
    }
    dependencies {
        classpath '<%= projectGroup %>:<%= projectName %>:<%= projectVersion %>'
    }
}
apply plugin: '<%= pluginFullName %>'
``` 

### Usage

---
[![gradle plugin generator](http://img.shields.io/badge/Powered%20by-%20Gradle%20plugin%20generator-green.svg?style=flat-square)](https://github.com/xvik/generator-gradle-plugin)
