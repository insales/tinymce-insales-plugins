module TinymceInsalesPlugins
  module Rails
    class Engine < ::Rails::Engine
      initializer 'tinymce_insales_plugins.assets.precompile' do |app|
        app.config.assets.paths << root.join('vendor', 'assets', 'javascripts').to_s
      end
    end
  end
end
