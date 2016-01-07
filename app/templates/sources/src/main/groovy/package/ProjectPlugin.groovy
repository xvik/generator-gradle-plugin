package <%= projectPackage %>

import com.google.common.base.Preconditions
import org.gradle.api.Plugin
import org.gradle.api.Project

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
            Preconditions.checkNotNull(extension.foo, '<%= pluginExtensionName %>.foo configuration required')
            Preconditions.checkNotNull(extension.bar, '<%= pluginExtensionName %>.bar configuration required')
        }
    }
}
