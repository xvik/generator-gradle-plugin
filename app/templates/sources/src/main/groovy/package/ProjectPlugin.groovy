package <%= projectPackage %>

import org.gradle.api.Plugin
import org.gradle.api.Project
import org.gradle.api.GradleException

/**
 * <%= pluginName %> plugin.
 *
 * @author <%= authorName %>
 * @since <%= date %>
 */
class <%= pluginClassPrefix %>Plugin implements Plugin<Project> {

    @Override
    void apply(Project project) {
        <%= pluginClassPrefix %>Extension extension = project.extensions.create('<%= pluginExtensionName %>', <%= pluginClassPrefix %>Extension)

        project.afterEvaluate {
            if (extension.bar == null) {
                throw new GradleException('<%= pluginExtensionName %>.bar configuration required')
            }
        }
    }
}
