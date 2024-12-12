import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import { Highlight, themes } from "prism-react-renderer";
import { Copy, Check } from "lucide-react";

interface CodePreviewProps {
  generateHTML: () => string;
}

const CodePreview: React.FC<CodePreviewProps> = ({ generateHTML }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateHTML());
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm" role="region" aria-label="Code preview area">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Generated Code</h2>
        <Button
          isIconOnly
          size="sm"
          variant="flat"
          color={copied ? "success" : "primary"}
          onPress={handleCopy}
          aria-label={copied ? "Code copied" : "Copy code"}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </Button>
      </div>
      <div 
        className="mt-4 rounded-lg overflow-hidden"
        role="presentation"
      >
        <Highlight
          theme={themes.vsDark}
          code={generateHTML()}
          language="html"
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={className} style={{
              ...style,
              margin: 0,
              padding: "1rem",
              fontSize: "0.875rem",
              maxHeight: "400px",
              overflowY: "auto",
            }}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
};

export default CodePreview;
