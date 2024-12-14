import YoutubeEmbed from "./YoutubeEmbed";

export async function generateMetadata() {
  return {
    title: "Optimized YouTube Embed Generator | Create YouTube Embed",
    description:
      "Free YouTube embed generator. Our YouTube embed loads 224% faster. Generate optimized YouTube embed with advanced features.",
    keywords:
      "youtube embed, youtube embed generator, youtube embed maker, youtube embed code",
  };
}

export default function YouTubePage() {
  return (
    <main
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8"
      aria-label="YouTube Embed Generator"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Section */}
        <section
          className="text-center space-y-6 py-12"
          aria-label="YouTube Embed Generator Tool"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Optimized YouTube Embed Generator: Create Fast YouTube Embed
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Free YouTube embed generator for your website. Our YouTube embed
            loads 224% faster than standard embeds. The ultimate YouTube embed
            solution with advanced customization options. Create the perfect
            YouTube embed for your needs.
          </p>
        </section>

        {/* Main Generator */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <YoutubeEmbed />
        </div>

        {/* Features Section */}
        <section
          className="py-12"
          aria-label="YouTube Embed Generator Features"
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            YouTube Embed Generator Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <article className="p-6 bg-white rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-3">
                Fast YouTube Embed Generator
              </h3>
              <p>
                Generate optimized YouTube embed that loads 224% faster than
                standard YouTube embed. Create the perfect YouTube embed for
                better performance.
              </p>
            </article>
            <article className="p-6 bg-white rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-3">
                Custom YouTube Embed Options
              </h3>
              <p>
                Create YouTube embed with custom parameters. The best YouTube
                embed for your website. Generate optimized YouTube embed with
                full control.
              </p>
            </article>
            <article className="p-6 bg-white rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-3">
                Responsive YouTube Embed
              </h3>
              <p>
                Generate mobile-friendly YouTube embed that adapts perfectly to
                any screen size. Create responsive YouTube embed for all
                devices.
              </p>
            </article>
          </div>
        </section>

        {/* Documentation Section */}
        <div className="space-y-12">
          {/* Quick Start Guide */}
          <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-2xl">🚀</span> Get Started in 4 Simple Steps
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                    1
                  </span>
                  <h3 className="font-semibold text-gray-900">Paste URL</h3>
                </div>
                <p className="text-gray-600">
                  Simply paste your YouTube video URL or ID - our smart system
                  handles both formats automatically
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                    2
                  </span>
                  <h3 className="font-semibold text-gray-900">Customize</h3>
                </div>
                <p className="text-gray-600">
                  Fine-tune your player settings with our intuitive controls for
                  the perfect viewing experience
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                    3
                  </span>
                  <h3 className="font-semibold text-gray-900">Preview</h3>
                </div>
                <p className="text-gray-600">
                  See your changes in real-time with our live preview feature -
                  what you see is what you get
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                    4
                  </span>
                  <h3 className="font-semibold text-gray-900">Deploy</h3>
                </div>
                <p className="text-gray-600">
                  Copy your optimized embed code and watch your website
                  transform with lightning-fast video playback
                </p>
              </div>
            </div>
          </section>

          {/* Key Features */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
              <span className="text-2xl">✨</span> Features That Set Us Apart
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg hover:shadow-md transition-all duration-300">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <span className="text-blue-600">⚡</span> Turbocharged
                  Performance
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Experience load times up to 224% faster than standard embeds.
                  Our optimized player ensures your visitors start watching
                  instantly, not waiting for loading screens.
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg hover:shadow-md transition-all duration-300">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <span className="text-indigo-600">🔒</span> Enhanced Privacy
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Built with GDPR compliance at its core. Our cookie-free mode
                  ensures your visitors&apos; privacy while delivering an
                  exceptional viewing experience.
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg hover:shadow-md transition-all duration-300">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <span className="text-green-600">📱</span> Universal
                  Compatibility
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Enjoy flawless playback across all devices and screen sizes.
                  Our responsive design ensures your videos look professional
                  everywhere, automatically.
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg hover:shadow-md transition-all duration-300">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <span className="text-yellow-600">🎨</span> Complete
                  Customization
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Take full control of your video presentation. From autoplay
                  and custom start times to advanced player controls - every
                  detail is yours to perfect.
                </p>
              </div>
            </div>
          </section>

          {/* Advanced Features */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2 mb-4">
                  <span className="text-3xl">🚀</span> Advanced Capabilities
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Unlock the full potential of your video content with our
                  advanced features, designed to provide the best possible
                  experience for both you and your viewers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Smart Loading */}
                <div className="group relative h-full">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                  <div className="relative h-full bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-500 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-teal-600 text-white text-xl shadow-lg">
                          🚀
                        </span>
                        <h3 className="text-xl font-bold text-gray-900">
                          Smart Loading
                        </h3>
                      </div>
                      <span className="text-blue-600">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed flex-grow">
                      Our innovative lazy-loading technology activates videos
                      only when needed, dramatically reducing initial page load
                      time and boosting overall site performance.
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-100">
                      <span className="inline-flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        540KB Reduced
                      </span>
                      <span className="inline-flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Instant Loading
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dynamic Thumbnails */}
                <div className="group relative h-full">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                  <div className="relative h-full bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-500 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white text-xl shadow-lg">
                          🖼️
                        </span>
                        <h3 className="text-xl font-bold text-gray-900">
                          Dynamic Thumbnails
                        </h3>
                      </div>
                      <span className="text-purple-600">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed flex-grow">
                      Select the perfect thumbnail resolution from 120p to
                      1280p, balancing visual quality with loading speed for
                      optimal user experience.
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-100">
                      <span className="inline-flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Multiple Resolutions
                      </span>
                      <span className="inline-flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Optimized Quality
                      </span>
                    </div>
                  </div>
                </div>

                {/* Universal Access */}
                <div className="group relative h-full">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                  <div className="relative h-full bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-500 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-600 text-white text-xl shadow-lg">
                          ♿
                        </span>
                        <h3 className="text-xl font-bold text-gray-900">
                          Universal Access
                        </h3>
                      </div>
                      <span className="text-green-600">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed flex-grow">
                      Inclusive by design with comprehensive support for screen
                      readers, keyboard navigation, and closed captions. Making
                      your content accessible to everyone.
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-100">
                      <span className="inline-flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        WCAG 2.1 Compliant
                      </span>
                      <span className="inline-flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Screen Reader Ready
                      </span>
                    </div>
                  </div>
                </div>

                {/* International Support */}
                <div className="group relative h-full">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                  <div className="relative h-full bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-500 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 text-white text-xl shadow-lg">
                          🌍
                        </span>
                        <h3 className="text-xl font-bold text-gray-900">
                          International Support
                        </h3>
                      </div>
                      <span className="text-yellow-600">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed flex-grow">
                      Reach your global audience effectively with built-in
                      support for multiple languages, regional preferences, and
                      localized captions.
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-100">
                      <span className="inline-flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Multiple Languages
                      </span>
                      <span className="inline-flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Regional Settings
                      </span>
                    </div>
                  </div>
                </div>

                {/* Playlist Excellence */}
                <div className="group relative h-full">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                  <div className="relative h-full bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-500 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-pink-600 text-white text-xl shadow-lg">
                          📺
                        </span>
                        <h3 className="text-xl font-bold text-gray-900">
                          Playlist Excellence
                        </h3>
                      </div>
                      <span className="text-red-600">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed flex-grow">
                      Create engaging playlist experiences with custom cover
                      videos, smart autoplay settings, and seamless navigation
                      between videos.
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-100">
                      <span className="inline-flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Custom Covers
                      </span>
                      <span className="inline-flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Smart Navigation
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
              <span className="text-2xl">💡</span> Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition-all duration-300">
                <h3 className="font-semibold text-lg mb-4 text-gray-900">
                  What makes our YouTube embed better?
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Think of it as upgrading from standard to premium class. Our
                  YouTube embed loads 224% faster, with advanced privacy
                  controls and extensive customization options. Plus, our smart
                  YouTube embed technology significantly boosts your site&apos;s
                  overall performance. Create the perfect YouTube embed today.
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition-all duration-300">
                <h3 className="font-semibold text-lg mb-4 text-gray-900">
                  How does your YouTube embed privacy protection work?
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Our YouTube embed implements specialized nocookie domain and
                  defers data collection until user interaction. This YouTube
                  embed approach ensures GDPR compliance and simplifies your
                  privacy policy management while protecting your visitors&apos;
                  data.
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition-all duration-300">
                <h3 className="font-semibold text-lg mb-4 text-gray-900">
                  Is this YouTube embed suitable for commercial projects?
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Absolutely! Our YouTube embed solution is fully compliant with
                  YouTube&apos;s terms of service and optimized for commercial
                  use. Our YouTube embed works seamlessly with any
                  HTML-compatible platform, making it perfect for client
                  projects and business websites.
                </p>
              </div>
            </div>
          </section>

          {/* SEO Benefits */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
              <span className="text-2xl">📈</span> SEO Benefits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Our YouTube embed solution doesn&apos;t just enhance your
                  videos - it elevates your entire website&apos;s performance
                  and search engine visibility:
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg
                      className="w-6 h-6 text-green-500 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      Exceptional Core Web Vitals scores that Google rewards
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-6 h-6 text-green-500 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      Optimized page performance through intelligent resource
                      loading
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-6 h-6 text-green-500 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      SEO-friendly semantic markup for better search visibility
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-6 h-6 text-green-500 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      Rich structured data support for enhanced search results
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-6 h-6 text-green-500 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      Improved user engagement metrics that boost rankings
                    </span>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4 text-gray-900">
                  Success Metrics
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Page Load Speed</span>
                    <span className="text-green-600 font-semibold">
                      224% Faster
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Initial Load Size</span>
                    <span className="text-green-600 font-semibold">
                      540KB Reduced
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Core Web Vitals</span>
                    <span className="text-green-600 font-semibold">
                      All Passed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
