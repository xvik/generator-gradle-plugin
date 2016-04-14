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