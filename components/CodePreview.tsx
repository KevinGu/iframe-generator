import React, { useState } from 'react'
import { Card, CardBody, Button } from "@nextui-org/react"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { Copy, Check } from 'lucide-react'

interface CodePreviewProps {
  generateHTML: () => string
}

const CodePreview: React.FC<CodePreviewProps> = ({ generateHTML }) => {
  const [selectedTab, setSelectedTab] = useState<'html'>('html')
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateHTML())
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-gray-100">
      <CardBody className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">生成的代码</h2>
          <Button
            size="sm"
            variant="flat"
            color={copied ? "success" : "primary"}
            startContent={copied ? <Check size={16} /> : <Copy size={16} />}
            onClick={handleCopy}
          >
            {copied ? "已复制" : "复制代码"}
          </Button>
        </div>
        <div className="mt-4 rounded-lg overflow-hidden">
          <SyntaxHighlighter 
            language="html"
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: '1rem',
              fontSize: '0.875rem',
              maxHeight: '400px',
              overflowY: 'auto',
            }}
            showLineNumbers={true}
            wrapLines={true}
            wrapLongLines={true}
            lineNumberStyle={{
              minWidth: '2.5em',
              paddingRight: '1em',
              textAlign: 'right',
              userSelect: 'none',
            }}
          >
            {generateHTML()}
          </SyntaxHighlighter>
        </div>
      </CardBody>
    </Card>
  )
}

export default CodePreview
