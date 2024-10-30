import IFrameGenerator from "./IFrameGenerator";

export async function generateMetadata({ params }: Props) {
  return {
    title: "IFrame Generator - Create Custom Embeds in Seconds",
    description:
      "The most powerful iframe code generator for creating secure, responsive and customizable embedded content. Perfect for websites, blogs and web applications.",
  };
}

type Props = {
  params: { locale: string };
};

export default async function Home({ params }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* 顶部标题区域 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            IFrame Generator - Create Custom Embeds in Seconds
          </h1>
          <p className="text-lg text-gray-600">
            The most powerful iframe code generator for creating secure,
            responsive and customizable embedded content. Perfect for websites,
            blogs and web applications.
          </p>
        </div>

        {/* 客户端组件 */}
        <IFrameGenerator />

        {/* 静态内容区域 */}
        <div className="mt-16 space-y-12 max-w-4xl mx-auto">
          {/* About Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              About IFrame Generator
            </h2>
            <p className="text-gray-600 leading-relaxed">
              IFrame Generator is the ultimate tool for creating professional
              iframe embeds. Whether you're embedding content, building
              responsive layouts, or integrating third-party services, our
              advanced iframe generator provides all the tools you need.
              Generate clean, secure, and optimized iframe code with features
              like custom styling, security controls, and responsive design -
              all through an intuitive interface that makes iframe creation
              effortless.
            </p>
          </section>

          {/* Features Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Advanced IFrame Generation Features
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="flex items-start space-x-3">
                <div className="mt-1 bg-blue-100 p-1 rounded">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Instant IFrame Preview</h3>
                  <p className="text-sm text-gray-600">
                    Live preview your iframe across multiple device sizes with
                    real-time updates
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="mt-1 bg-blue-100 p-1 rounded">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Security Controls</h3>
                  <p className="text-sm text-gray-600">
                    Comprehensive sandbox and referrer policy settings
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="mt-1 bg-blue-100 p-1 rounded">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Style Customization</h3>
                  <p className="text-sm text-gray-600">
                    Full control over borders, padding, colors, and more
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="mt-1 bg-blue-100 p-1 rounded">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Code Generation</h3>
                  <p className="text-sm text-gray-600">
                    Clean, optimized HTML code ready to use
                  </p>
                </div>
              </li>
            </ul>
          </section>

          {/* How to Use Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              How to Use IFrame Generator
            </h2>
            <ol className="space-y-4 text-gray-600">
              <li className="flex items-start space-x-3">
                <span className="font-bold text-blue-600">1.</span>
                <p>
                  Enter the URL of the website you want to embed in the URL
                  input field at the top.
                </p>
              </li>
              <li className="flex items-start space-x-3">
                <span className="font-bold text-blue-600">2.</span>
                <p>
                  Customize the appearance using the Style tab - adjust
                  dimensions, borders, colors, and more.
                </p>
              </li>
              <li className="flex items-start space-x-3">
                <span className="font-bold text-blue-600">3.</span>
                <p>
                  Configure security settings in the Security tab to control
                  iframe permissions and behavior.
                </p>
              </li>
              <li className="flex items-start space-x-3">
                <span className="font-bold text-blue-600">4.</span>
                <p>
                  Copy the generated code and paste it into your website's HTML.
                </p>
              </li>
            </ol>
          </section>

          {/* FAQ Section */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900">
                  Why use IFrame Generator?
                </h3>
                <p className="text-gray-600">
                  IFrame Generator simplifies the process of creating secure,
                  responsive iframes while providing advanced customization
                  options and real-time preview capabilities.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Can I embed any website?
                </h3>
                <p className="text-gray-600">
                  While IFrame Generator can generate code for any URL, some
                  websites may have X-Frame-Options headers that prevent them
                  from being embedded. Always ensure you have permission to
                  embed third-party content.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Is the generated iframe secure?
                </h3>
                <p className="text-gray-600">
                  IFrame Generator provides comprehensive security controls
                  through sandbox permissions and referrer policies. However,
                  always review security settings based on your specific needs
                  and the trusted level of embedded content.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  What browsers are supported?
                </h3>
                <p className="text-gray-600">
                  The iframes generated are compatible with all modern browsers.
                  The tool includes fallbacks and best practices to ensure broad
                  compatibility.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
