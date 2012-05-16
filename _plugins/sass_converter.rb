require 'sass'

module Jekyll
  class SassConverter < Converter
    safe true
    priority :low

    def matches(ext)
      ext =~ /scss/i
    end

    def output_ext(ext)
      '.css'
    end

    def convert(content)
      begin
        engine = Sass::Engine.new content, :syntax     => :scss,
                                           :style      => :compressed,
                                           :load_paths => ["./css/"]
        engine.render
      rescue StandardError => e
        puts "Sass error:" + e.message
      end
    end
  end
end
