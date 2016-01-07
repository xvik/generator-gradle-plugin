package <%= projectPackage %>

import org.gradle.api.Project
import org.gradle.api.ProjectConfigurationException
import org.gradle.testfixtures.ProjectBuilder

/**
 * @author <%= authorName %>
 * @since <%= date %>
 */
class <%= pluginClassPrefix %>PluginTest extends AbstractTest {

    def "Check extension registration"() {

        when: "plugin applied"
        Project project = ProjectBuilder.builder().build()
        project.plugins.apply "<%= pluginFullName %>"

        then: "extension registered"
        project.extensions.findByType(<%= pluginClassPrefix %>Extension)

    }

    def "Check extension validation"() {

        when: "plugin configured"
        Project project = project {
            apply plugin: "<%= pluginFullName %>"

            <%= pluginExtensionName %> {
                foo '1'
                bar '2'
            }
        }

        then: "validation pass"
        def <%= pluginExtensionName %> = project.extensions.<%= pluginExtensionName %>;
        <%= pluginExtensionName %>.foo == '1'
        <%= pluginExtensionName %>.bar == '2'
    }


    def "Check extension validation failure"() {

        when: "plugin configured"
        Project project = project {
            apply plugin: "<%= pluginFullName %>"

            <%= pluginExtensionName %> {
                foo '1'
            }
        }

        then: "validation failed"
        def ex = thrown(ProjectConfigurationException)
        ex.cause.message == '<%= pluginExtensionName %>.bar configuration required'
    }

}