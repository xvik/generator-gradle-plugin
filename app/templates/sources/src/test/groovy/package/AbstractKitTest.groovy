package <%= projectPackage %>

import org.apache.tools.ant.taskdefs.condition.Os
import org.gradle.testkit.runner.BuildResult
import org.gradle.testkit.runner.GradleRunner
import spock.lang.Specification
import spock.lang.TempDir

/**
 * Base class for Gradle TestKit based tests.
 * Useful for full-cycle and files manipulation testing.
 *
 * @author <%= authorName %>
 * @since <%= date %>
 */
abstract class AbstractKitTest extends Specification {

    boolean debug
    boolean isWin = Os.isFamily(Os.FAMILY_WINDOWS)

    @TempDir File testProjectDir
    File buildFile

    def setup() {
        buildFile = file('build.gradle')
        // jacoco coverage support
        fileFromClasspath('gradle.properties', 'testkit-gradle.properties')
    }

    def build(String file) {
        buildFile << file
    }

    File file(String path) {
        new File(testProjectDir, path)
    }

    File fileFromClasspath(String toFile, String source) {
        File target = file(toFile)
        target.parentFile.mkdirs()
        target << (getClass().getResourceAsStream(source) ?: getClass().classLoader.getResourceAsStream(source)).text
    }

    /**
     * Enable it and run test with debugger (no manual attach required). Not always enabled to speed up tests during
     * normal execution.
     */
    def debug() {
        debug = true
    }

    String projectName() {
        return testProjectDir.getName()
    }

    GradleRunner gradle(File root, String... commands) {
        GradleRunner.create()
                .withProjectDir(root)
                .withArguments((commands + ['--stacktrace']) as String[])
                .withPluginClasspath()
                .withDebug(debug)
                .forwardOutput()
    }

    GradleRunner gradle(String... commands) {
        gradle(testProjectDir, commands)
    }

    BuildResult run(String... commands) {
        return gradle(commands).build()
    }

    BuildResult runFailed(String... commands) {
        return gradle(commands).buildAndFail()
    }

    BuildResult runVer(String gradleVersion, String... commands) {
        println 'Running with GRADLE ' + gradleVersion
        return gradle(commands).withGradleVersion(gradleVersion).build()
    }

    BuildResult runFailedVer(String gradleVersion, String... commands) {
        println 'Running with GRADLE ' + gradleVersion
        return gradle(commands).withGradleVersion(gradleVersion).buildAndFail()
    }

    protected String unifyString(String input) {
        return input
                // cleanup win line break for simpler comparisons
                .replace("\r", '')
    }
}
