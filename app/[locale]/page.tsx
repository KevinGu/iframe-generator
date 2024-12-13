import IFrameGenerator from "./IFrameGenerator";

export async function generateMetadata({ params }: Props) {
  return {
    title: "IFrame Generator - Free HTML IFrame Maker",
    description:
      "Free online IFrame Generator tool for creating secure, responsive and customizable iframe embeds. Generate HTML iframe code with advanced features like sandbox security, responsive sizing, and custom styling. Perfect for embedding content in websites, blogs and web applications.",
    keywords:
      "iframe generator, iframe code generator, html iframe maker, responsive iframe, secure iframe generator, custom iframe generator, iframe builder, iframe creator, embed generator",
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home(props: Props) {
  const params = await props.params;
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* Header section */}
        <header className="text-center mb-12" role="banner">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            IFrame Generator - Free HTML IFrame Maker
          </h1>
          <p className="text-lg text-gray-600">
            The most powerful and user-friendly IFrame Generator for creating
            secure, responsive and customizable iframe embeds. Our professional
            IFrame Maker tool provides advanced features like sandbox
            security, responsive sizing, and custom styling. Try our free IFrame
            Generator today - perfect for websites, blogs, and web applications.
          </p>
        </header>

        {/* Main content */}
        <main role="main">
          <IFrameGenerator />
        </main>

        {/* SEO Content Sections */}
        <div className="mt-16 space-y-12 max-w-4xl mx-auto">
          {/* About Section */}
          <section className="space-y-4" aria-labelledby="about-section">
            <h2 id="about-section" className="text-2xl font-bold text-gray-900">
              About Our Professional IFrame Generator Tool
            </h2>
            <p className="text-gray-600 leading-relaxed">
              The IFrame Generator is your ultimate solution for creating
              professional iframe embeds. As the web&apos;s leading IFrame Generator
              tool, we provide everything you need for seamless iframe
              integration. The IFrame Generator&apos;s advanced features enable
              secure embedding and responsive design. Whether you&apos;re embedding
              content, building responsive layouts, or integrating third-party
              services, our IFrame Generator ensures perfect implementation
              every time.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8" role="list">
              <div className="bg-blue-50 p-6 rounded-lg" role="listitem">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">
                  Secure IFrame Generator
                </h3>
                <p className="text-gray-700">
                  Our IFrame Generator creates secure iframes with built-in
                  protection against vulnerabilities. Trust our IFrame Generator
                  for implementing all security best practices.
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg" role="listitem">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">
                  Responsive IFrame Generator
                </h3>
                <p className="text-gray-700">
                  Create fluid and responsive iframes with our IFrame Generator
                  that adapt perfectly to any screen size. Experience optimal
                  viewing across all devices.
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg" role="listitem">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">
                  Easy-to-Use IFrame Generator
                </h3>
                <p className="text-gray-700">
                  The IFrame Generator provides ready-to-use iframe code with
                  all necessary attributes and styling. Experience seamless
                  integration with our IFrame Generator.
                </p>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="space-y-4" aria-labelledby="features-section">
            <h2 id="features-section" className="text-2xl font-bold text-gray-900">
              Advanced IFrame Generator Features
            </h2>
            <p className="text-gray-600 mb-6">
              Discover why developers choose our IFrame Generator for their
              embedding needs. The IFrame Generator comes packed with
              professional features for every use case.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  IFrame Generator Security Features
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600" role="list" aria-label="Security features list">
                  <li>Advanced sandbox controls in our IFrame Generator</li>
                  <li>Cross-origin resource policy management</li>
                  <li>Content Security Policy (CSP) implementation</li>
                  <li>Protection against clickjacking attacks</li>
                  <li>Secure cross-origin communication</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  IFrame Generator Customization Options
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600" role="list" aria-label="Customization options list">
                  <li>Responsive width and height controls</li>
                  <li>Custom border and styling options</li>
                  <li>Advanced IFrame Generator settings</li>
                  <li>Loading optimization features</li>
                  <li>Complete attribute customization</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Technical Guide Section */}
          <section className="bg-gray-50 p-8 rounded-lg" aria-labelledby="tech-guide-section">
            <h2 id="tech-guide-section" className="text-2xl font-bold text-gray-900 mb-6">
              IFrame Generator Technology Guide
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Why Choose Our IFrame Generator?
                </h3>
                <p className="text-gray-600">
                  The IFrame Generator is built on powerful HTML technology that
                  enables seamless content embedding within web pages. Our
                  professional IFrame Generator optimizes this technology for
                  modern web development, ensuring secure and efficient content
                  integration while maintaining performance and accessibility.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  IFrame Generator Best Practices
                </h3>
                <p className="text-gray-600 mb-4">
                  Our IFrame Generator implements current web standards and best
                  practices:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600" role="list" aria-label="Best practices list">
                  <li>Advanced IFrame Generator security features</li>
                  <li>Responsive design with our IFrame Generator</li>
                  <li>Performance optimization with lazy loading</li>
                  <li>Enhanced accessibility in the IFrame Generator</li>
                  <li>Cross-browser compatibility features</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Use Cases Section */}
          <section aria-labelledby="use-cases-section">
            <h2 id="use-cases-section" className="text-2xl font-bold text-gray-900 mb-6">
              IFrame Generator Applications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Content Integration
                </h3>
                <p className="text-gray-600">
                  Perfect for embedding external content such as maps, videos,
                  and social media feeds. Our IFrame Generator creates
                  responsive iframes that maintain perfect aspect ratios and
                  adapt to any screen size, ensuring your embedded content looks
                  great everywhere.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Application Integration
                </h3>
                <p className="text-gray-600">
                  Seamlessly integrate third-party applications and widgets
                  using secure iframe implementations. Our IFrame Generator
                  provides proper content isolation and smooth cross-origin
                  communication, making it perfect for complex web applications.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="space-y-6" aria-labelledby="faq-section">
            <h2 id="faq-section" className="text-2xl font-bold text-gray-900">
              Frequently Asked Questions About IFrame Generator
            </h2>
            <div className="space-y-4" role="list">
              <div role="listitem">
                <h3 className="font-semibold text-gray-900">
                  What makes this IFrame Generator special?
                </h3>
                <p className="text-gray-600">
                  Our IFrame Generator stands out with its combination of
                  professional features, including real-time preview, advanced
                  security controls, responsive design options, and clean code
                  generation. It&apos;s designed for both beginners and professional
                  developers.
                </p>
              </div>
              <div role="listitem">
                <h3 className="font-semibold text-gray-900">
                  How secure are the generated iframes?
                </h3>
                <p className="text-gray-600">
                  Our IFrame Generator implements comprehensive security
                  measures including sandbox permissions, content security
                  policies, and cross-origin controls. Every iframe is generated
                  with security best practices built-in.
                </p>
              </div>
              <div role="listitem">
                <h3 className="font-semibold text-gray-900">
                  Can I create responsive iframes?
                </h3>
                <p className="text-gray-600">
                  Yes! Our IFrame Generator automatically includes responsive
                  design features. You can set percentage-based widths, aspect
                  ratios, and max-width constraints to ensure your iframes look
                  perfect on all devices.
                </p>
              </div>
              <div role="listitem">
                <h3 className="font-semibold text-gray-900">
                  What browsers are supported?
                </h3>
                <p className="text-gray-600">
                  The iframes generated by our tool are compatible with all
                  modern browsers. We include fallbacks and best practices to
                  ensure broad compatibility and consistent behavior across
                  different platforms.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
