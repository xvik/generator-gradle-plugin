package <%= projectPackage %>

import org.gradle.testkit.runner.BuildResult
import org.gradle.testkit.runner.TaskOutcome

/**
 * @author <%= authorName %>
 * @since <%= date %>
 */
class <%= pluginClassPrefix %>PluginKitTest extends AbstractKitTest {

    def "Check plugin execution"() {
        setup:
        build """
            plugins {
                id '<%= pluginFullName %>'
            }

            <%= pluginExtensionName %> {
                foo '1'
                bar '2'
            }

            task printFoo() {
                doLast {
                    println "fooo: \$<%= pluginExtensionName %>.foo"
                }
            }

        """

        when: "run task"
        BuildResult result = run('printFoo')

        then: "task successful"
        result.task(':printFoo').outcome == TaskOutcome.SUCCESS
        result.output.contains('fooo: 1')
    }
}