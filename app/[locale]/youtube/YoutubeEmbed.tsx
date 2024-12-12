"use client";

import React, { useState, useRef, useEffect } from "react";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { Input, Switch, Button, Select, SelectItem, Tooltip } from "@nextui-org/react";
import { HelpCircle } from "lucide-react";

interface YoutubeConfig {
  videoId: string;
  title: string;
  width: string;
  height: string;
  autoplay: boolean;
  mute: boolean;
  controls: boolean;
  loop: boolean;
  modestBranding: boolean;
  showCaptions: boolean;
  quality: string;
  startTime: string;
  endTime: string;
  noCookie: boolean;
  poster: 'default' | 'mqdefault' | 'hqdefault' | 'sddefault' | 'maxresdefault';
  adNetwork: boolean;
}

const defaultConfig: YoutubeConfig = {
  videoId: "",
  title: "YouTube video player",
  width: "100%",
  height: "400px",
  autoplay: false,
  mute: false,
  controls: true,
  loop: false,
  modestBranding: true,
  showCaptions: false,
  quality: "auto",
  startTime: "",
  endTime: "",
  noCookie: true,
  poster: "hqdefault",
  adNetwork: false,
};

const qualityOptions = [
  { label: "Auto", value: "auto" },
  { label: "4K (2160p)", value: "hd2160" },
  { label: "2K (1440p)", value: "hd1440" },
  { label: "HD (1080p)", value: "hd1080" },
  { label: "HD (720p)", value: "hd720" },
  { label: "Large (480p)", value: "large" },
  { label: "Medium (360p)", value: "medium" },
  { label: "Small (240p)", value: "small" },
];

const posterOptions = [
  { label: "默认质量", value: "default" },
  { label: "中等质量", value: "mqdefault" },
  { label: "高质量", value: "hqdefault" },
  { label: "标清", value: "sddefault" },
  { label: "最高质量", value: "maxresdefault" },
] as const;

export default function YoutubeEmbed() {
  const [config, setConfig] = useState<YoutubeConfig>(defaultConfig);
  const [url, setUrl] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);
  const resizeObserver = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    if (previewRef.current) {
      resizeObserver.current = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const width = Math.round(entry.contentRect.width);
          const height = Math.round(entry.contentRect.height);
          setConfig(prev => ({
            ...prev,
            width: `${width}px`,
            height: `${height}px`
          }));
        }
      });

      resizeObserver.current.observe(previewRef.current);
    }

    return () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
      }
    };
  }, []);

  const extractVideoId = (url: string) => {
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : "";
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    const videoId = extractVideoId(value);
    setConfig((prev) => ({ ...prev, videoId }));
  };

  const convertTimeToSeconds = (timeStr: string): number => {
    if (!timeStr) return 0;
    const parts = timeStr.split(":").map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    return Number(timeStr) || 0;
  };

  const getParams = () => {
    const params = [];
    if (config.autoplay) params.push("autoplay=1");
    if (config.mute) params.push("mute=1");
    if (!config.controls) params.push("controls=0");
    if (config.loop) params.push("loop=1&playlist=" + config.videoId);
    if (config.modestBranding) params.push("modestbranding=1");
    if (config.showCaptions) params.push("cc_load_policy=1");
    if (config.quality !== "auto") params.push("vq=" + config.quality);
    
    const startTime = convertTimeToSeconds(config.startTime);
    if (startTime > 0) params.push("start=" + startTime);
    
    const endTime = convertTimeToSeconds(config.endTime);
    if (endTime > 0) params.push("end=" + endTime);
    
    return params.join("&");
  };

  const generateIframeCode = () => {
    if (!config.videoId) return "";
    
    const params = getParams();
    const title = config.title || 'YouTube video player';
    
    const liteYoutubeHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <script type="module" src="https://cdn.jsdelivr.net/npm/@justinribeiro/lite-youtube@1.5.0/lite-youtube.js"></script>
  <style>
    body { margin: 0; }
    lite-youtube {
      width: 100%;
      height: 100vh;
      background-color: #000;
    }
  </style>
</head>
<body>
  <lite-youtube
    videoid="${config.videoId}"
    ${config.title ? `playlabel="${config.title}"` : ''}
    ${params ? `params="${params}"` : ''}
    ${config.noCookie ? 'nocookie="true"' : ''}
    poster="${config.poster}"
    ${config.adNetwork ? 'adnetwork="true"' : ''}
  ></lite-youtube>
</body>
</html>`;

    const base64Html = typeof window !== 'undefined' ? 
      btoa(liteYoutubeHtml) : 
      Buffer.from(liteYoutubeHtml).toString('base64');

    return `<iframe
  width="${config.width}"
  height="${config.height}"
  src="data:text/html;base64,${base64Html}"
  title="${title}"
  frameborder="0"
  allowfullscreen
></iframe>`;
  };

  const generateStandardIframeCode = () => {
    if (!config.videoId) return "";
    
    const params = getParams();
    const title = config.title || 'YouTube video player';
    const src = `https://www.youtube${config.noCookie ? '-nocookie' : ''}.com/embed/${config.videoId}${params ? '?' + params : ''}`;
    
    return `<iframe
  width="${config.width}"
  height="${config.height}"
  src="${src}"
  title="${title}"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowfullscreen
></iframe>`;
  };

  const generateLiteYoutubeCode = () => {
    if (!config.videoId) return "";
    
    const params = getParams();
    const attributes = [
      `videoid="${config.videoId}"`,
      `style="width:${config.width}; height:${config.height};"`,
      config.title && `playlabel="${config.title}"`,
      params && `params="${params}"`,
      `noCookie="${config.noCookie}"`,
      `poster="${config.poster}"`,
      `adNetwork="${config.adNetwork}"`,
    ].filter(Boolean).join('\n  ');

    return `<!-- Import the Lite YouTube Embed script -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@justinribeiro/lite-youtube@1.5.0/lite-youtube.js"></script>

<!-- Add the Lite YouTube Embed component -->
<lite-youtube 
  ${attributes}
></lite-youtube>`;
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <Input
          label="YouTube URL"
          placeholder="Enter YouTube video URL"
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
        />
        <Input
          label="Video Title (Optional)"
          placeholder="Enter video title"
          value={config.title}
          onChange={(e) => setConfig((prev) => ({ ...prev, title: e.target.value }))}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Width"
            placeholder="e.g., 100%, 800px"
            value={config.width}
            onChange={(e) => setConfig((prev) => ({ ...prev, width: e.target.value }))}
          />
          <Input
            label="Height"
            placeholder="e.g., 400px"
            value={config.height}
            onChange={(e) => setConfig((prev) => ({ ...prev, height: e.target.value }))}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="text-sm">开始时间</div>
              <Tooltip content="设置视频开始播放的时间点（格式：分:秒 或 秒数）">
                <HelpCircle className="w-4 h-4 text-gray-400" />
              </Tooltip>
            </div>
            <Input
              placeholder="例如：1:30 或 90"
              value={config.startTime}
              onChange={(e) => setConfig((prev) => ({ ...prev, startTime: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="text-sm">结束时间</div>
              <Tooltip content="设置视频结束播放的时间点（格式：分:秒 或 秒数）">
                <HelpCircle className="w-4 h-4 text-gray-400" />
              </Tooltip>
            </div>
            <Input
              placeholder="例如：2:30 或 150"
              value={config.endTime}
              onChange={(e) => setConfig((prev) => ({ ...prev, endTime: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="text-sm">视频质量</div>
              <Tooltip content="设置视频的播放质量，实际质量可能受限于视频源和网络条件">
                <HelpCircle className="w-4 h-4 text-gray-400" />
              </Tooltip>
            </div>
            <Select
              label="视频质量"
              placeholder="选择质量"
              selectedKeys={[config.quality]}
              onChange={(e) => setConfig((prev) => ({ ...prev, quality: e.target.value }))}
            >
              {qualityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Switch
              isSelected={config.autoplay}
              onValueChange={(value) => setConfig((prev) => ({ ...prev, autoplay: value }))}
            >
              自动播放
            </Switch>
            <Tooltip content="视频加载后自动开始播放">
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              isSelected={config.mute}
              onValueChange={(value) => setConfig((prev) => ({ ...prev, mute: value }))}
            >
              静音
            </Switch>
            <Tooltip content="视频开始播放时静音">
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              isSelected={config.controls}
              onValueChange={(value) => setConfig((prev) => ({ ...prev, controls: value }))}
            >
              播放控件
            </Switch>
            <Tooltip content="显示视频播放控制栏">
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              isSelected={config.loop}
              onValueChange={(value) => setConfig((prev) => ({ ...prev, loop: value }))}
            >
              循环播放
            </Switch>
            <Tooltip content="视频播放完成后自动循环播放">
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              isSelected={config.modestBranding}
              onValueChange={(value) => setConfig((prev) => ({ ...prev, modestBranding: value }))}
            >
              简洁界面
            </Switch>
            <Tooltip content="减少 YouTube 品牌标识的显示">
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              isSelected={config.showCaptions}
              onValueChange={(value) => setConfig((prev) => ({ ...prev, showCaptions: value }))}
            >
              显示字幕
            </Switch>
            <Tooltip content="显示视频的隐藏式字幕（如果可用）">
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              isSelected={config.noCookie}
              onValueChange={(value) => setConfig((prev) => ({ ...prev, noCookie: value }))}
            >
              隐私模式
            </Switch>
            <Tooltip content="使用 youtube-nocookie.com 域名以增强隐私保护">
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              isSelected={config.adNetwork}
              onValueChange={(value) => setConfig((prev) => ({ ...prev, adNetwork: value }))}
            >
              广告网络
            </Switch>
            <Tooltip content="预加载 Google 广告网络（可能影响加载速度）">
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </Tooltip>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="text-sm">封面质量</div>
              <Tooltip content="设置视频缩略图的质量，较高质量可能增加初始加载时间">
                <HelpCircle className="w-4 h-4 text-gray-400" />
              </Tooltip>
            </div>
            {/* <Select
              label="封面质量"
              placeholder="选择封面质量"
              selectedKeys={[config.poster]}
              onChange={(e) => setConfig((prev) => ({ ...prev, poster: e.target.value }))}
            >
              {posterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </Select> */}
          </div>
        </div>
      </div>

      {config.videoId && (
        <div className="space-y-8">
          {/* Preview Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-4">Preview:</div>
            <div style={{ maxWidth: '100%' }} className="overflow-hidden">
              <div
                ref={previewRef}
                style={{ 
                  width: config.width,
                  height: config.height,
                  maxWidth: '100%',
                  resize: 'both',
                  overflow: 'hidden'
                }}
                className="relative mx-auto border border-gray-200 bg-white"
              >
                {config.videoId && (
                  <LiteYouTubeEmbed
                    id={config.videoId}
                    title={config.title}
                    params={getParams()}
                    noCookie={config.noCookie}
                    poster={config.poster}
                    adNetwork={config.adNetwork}
                  />
                )}
              </div>
            </div>
          </div>
          
          {/* Code Section */}
          <div className="grid gap-6">
            {/* Lite YouTube iFrame Code */}
            <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="text-sm text-gray-600">Lite YouTube iFrame 代码</div>
                  <div className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">推荐</div>
                </div>
                <Button
                  size="sm"
                  variant="flat"
                  onClick={() => {
                    navigator.clipboard.writeText(generateIframeCode());
                  }}
                >
                  复制代码
                </Button>
              </div>
              <div className="bg-white p-4 rounded border border-gray-200 overflow-x-auto">
                <pre className="whitespace-pre-wrap break-words text-sm">
                  <code>{generateIframeCode()}</code>
                </pre>
              </div>
            </div>

            {/* Standard YouTube iFrame Code */}
            <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="text-sm text-gray-600">标准 YouTube iFrame 代码</div>
                  <div className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">原生</div>
                </div>
                <Button
                  size="sm"
                  variant="flat"
                  onClick={() => {
                    navigator.clipboard.writeText(generateStandardIframeCode());
                  }}
                >
                  复制代码
                </Button>
              </div>
              <div className="bg-white p-4 rounded border border-gray-200 overflow-x-auto">
                <pre className="whitespace-pre-wrap break-words text-sm">
                  <code>{generateStandardIframeCode()}</code>
                </pre>
              </div>
            </div>

            {/* Lite YouTube Component Code */}
            <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="text-sm text-gray-600">Lite YouTube 组件代码</div>
                  <div className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Web Component</div>
                </div>
                <Button
                  size="sm"
                  variant="flat"
                  onClick={() => {
                    navigator.clipboard.writeText(generateLiteYoutubeCode());
                  }}
                >
                  复制代码
                </Button>
              </div>
              <div className="bg-white p-4 rounded border border-gray-200 overflow-x-auto">
                <pre className="whitespace-pre-wrap break-words text-sm">
                  <code>{generateLiteYoutubeCode()}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
