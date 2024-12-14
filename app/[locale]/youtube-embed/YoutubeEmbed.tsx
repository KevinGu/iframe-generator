"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Input,
  Switch,
  Button,
  Select,
  SelectItem,
  Tooltip,
  Tabs,
  Tab,
  Card,
} from "@nextui-org/react";
import {
  HelpCircle,
  Zap,
  Copy,
  Check,
  Code2,
  Component,
  Settings,
  Play,
  Code as CodeIcon,
} from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";

interface YoutubeConfig {
  // Basic required parameters
  videoId: string; // Video or playlist ID
  title: string; // Video title, used for accessibility

  // Playback control
  autoplay: boolean; // Autoplay
  mute: boolean; // Mute playback
  controls: boolean; // Show player controls
  loop: boolean; // Loop playback
  startTime: string; // Start time (seconds)
  endTime: string; // End time (seconds)
  quality: string; // Video quality
  showAnnotations: boolean; // Show video annotations
  fs: boolean; // Show full screen button

  // Captions and language
  showCaptions: boolean; // Show captions
  ccLangPref: string; // Caption language preference (ISO 639-1 two-letter code)
  hl: string; // Interface language (ISO 639-1 two-letter code)

  // Appearance settings
  poster: "default" | "mqdefault" | "hqdefault" | "sddefault" | "maxresdefault"; // [Only for lite-youtube] Thumbnail quality
  webp: boolean; // [Only for lite-youtube] Use WebP format for thumbnails
  color: "red" | "white"; // Progress bar color

  // Playlist-related
  playlist: boolean; // Whether it's a playlist
  playlistCoverId: string; // Playlist cover video ID

  // Privacy and ads (only for lite-youtube)
  cookie: boolean; // [Only for lite-youtube] Whether to allow cookies
  adNetwork: boolean; // [Only for lite-youtube] Whether to preconnect to Google ad network

  // Accessibility and internationalization
  announce: string; // Play button text, default "Watch"

  // Layout (only for lite-youtube)
  aspectHeight: number; // [Only for lite-youtube] Aspect ratio height, default 9
  aspectWidth: number; // [Only for lite-youtube] Aspect ratio width, default 16

  // Other
  params: string; // Other URL parameters
  rel: string; // Preload strategy, default "preload"
}

const defaultConfig: YoutubeConfig = {
  videoId: "",
  title: "YouTube video player",
  autoplay: false,
  mute: false,
  controls: true,
  loop: false,
  startTime: "",
  endTime: "",
  quality: "auto",
  showAnnotations: true,
  fs: true,
  showCaptions: false,
  ccLangPref: "",
  hl: "",
  poster: "hqdefault",
  webp: true,
  color: "red",
  playlist: false,
  playlistCoverId: "",
  cookie: true,
  adNetwork: false,
  announce: "",
  aspectHeight: 9,
  aspectWidth: 16,
  params: "",
  rel: "",
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
  { label: "Default quality", value: "default" },
  { label: "Medium quality", value: "mqdefault" },
  { label: "High quality", value: "hqdefault" },
  { label: "Standard definition", value: "sddefault" },
  { label: "Maximum resolution", value: "maxresdefault" },
] as const;

// Constants
const HELP_ICON_CLASSES = "w-4 h-4 text-gray-400";

const liteYoutubeJsUrl =
  "https://cdnjs.cloudflare.com/ajax/libs/lite-youtube-embed/0.3.3/lite-yt-embed.min.js";
const liteYoutubeCssUrl =
  "https://cdnjs.cloudflare.com/ajax/libs/lite-youtube-embed/0.3.3/lite-yt-embed.min.css";

// Utility functions
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

const extractVideoInfo = (input: string): { videoId: string } => {
  if (!input) return { videoId: "" };

  // If input is a URL
  try {
    const url = new URL(input);
    let videoId = "";
    const params: { [key: string]: string } = {};

    // Handle standard YouTube URL
    if (url.hostname.includes("youtube.com")) {
      // Handle watch link
      if (url.pathname === "/watch") {
        videoId = url.searchParams.get("v") || "";
      }
      // Handle embed link
      else if (url.pathname.startsWith("/embed/")) {
        videoId = url.pathname.split("/")[2];
      }
      // Handle other YouTube short links
      else if (url.pathname.startsWith("/v/")) {
        videoId = url.pathname.split("/")[2];
      }
    }
    // Handle youtu.be short link
    else if (url.hostname === "youtu.be") {
      videoId = url.pathname.slice(1);
    }

    if (videoId) {
      return { videoId };
    }
  } catch {
    // If not a valid URL, assume it's a direct video ID input
    // Remove any spaces and special characters
    const cleanId = input.trim().replace(/[^a-zA-Z0-9_-]/g, "");
    return { videoId: cleanId };
  }
  return { videoId: input };
};

const generateEmbedUrl = (config: YoutubeConfig) => {
  const { videoId } = config;
  if (!videoId) return "";

  // Choose base URL based on cookie setting
  const baseUrl = config.cookie
    ? "https://www.youtube.com"
    : "https://www.youtube-nocookie.com";

  const params = new URLSearchParams();

  // Basic parameters
  params.set("rel", "0");
  params.set("enablejsapi", "1");

  // Player controls
  params.set("controls", config.controls ? "1" : "0");

  // Loop playback requires both loop=1 and playlist=VIDEO_ID
  if (config.loop) {
    params.set("loop", "1");
    params.set("playlist", videoId);
  }

  // Other parameter settings
  if (config.autoplay) params.set("autoplay", "1");
  if (config.showCaptions) params.set("cc_load_policy", "1");
  if (config.quality !== "auto") params.set("quality", config.quality);
  if (config.startTime)
    params.set("start", convertTimeToSeconds(config.startTime).toString());
  if (config.endTime)
    params.set("end", convertTimeToSeconds(config.endTime).toString());
  if (config.ccLangPref) params.set("cc_lang_pref", config.ccLangPref);
  if (config.hl) params.set("hl", config.hl);
  if (!config.showAnnotations) params.set("iv_load_policy", "3");
  if (config.adNetwork) params.set("preconnect_ads", "1");
  if (!config.fs) params.set("fs", "0");

  return `${baseUrl}/embed/${videoId}?${params.toString()}`;
};

// Unified lite-youtube HTML generation function
const generateLiteYoutubeHtml = (config: YoutubeConfig) => {
  if (!config.videoId) return "";

  const params = Object.entries({
    controls: config.controls ? "1" : "0",
    playsinline: "1",
    cc_load_policy: config.showCaptions ? "1" : "0",
    cc_lang_pref: config.ccLangPref,
    hl: config.hl,
    color: config.color,
    autoplay: config.autoplay ? "1" : "0",
    disablekb: !config.controls ? "1" : "0",
    rel: config.rel === "preload" ? "1" : "0",
    iv_load_policy: config.showAnnotations ? "1" : "3",
    start: config.startTime,
    end: config.endTime,
    loop: config.loop ? "1" : "0",
    mute: config.mute ? "1" : "0",
  })
    .filter(([_, value]) => value !== undefined && value !== "")
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return ` <lite-youtube
    videoid="${config.videoId}"
    ${config.title ? `title="${config.title}"` : ""}
    cookie=${config.cookie}
    adNetwork=${config.adNetwork}
    webp=${config.webp}
    aspectHeight=${config.aspectHeight}
    aspectWidth=${config.aspectWidth}
    ${config.poster ? `poster="${config.poster}"` : ""}
    params="${params}"
  ></lite-youtube>`;
};

const generateWebComponentCode = (config: YoutubeConfig) => {
  const dependencies = `
<link rel="stylesheet" href="${liteYoutubeCssUrl}" />
<script src="${liteYoutubeJsUrl}"></script>
`;
  return dependencies + generateLiteYoutubeHtml(config);
};

const generateLiteIFrameCode = (config: YoutubeConfig) => {
  if (!config.videoId) return "";

  const liteYoutubeHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="${liteYoutubeCssUrl}" />
<script src="${liteYoutubeJsUrl}"></script>
</head>
<body>
  ${generateLiteYoutubeHtml(config)}
</body>
</html>`;

  const iframeCode = `<iframe
  src="data:text/html;charset=UTF-8,${encodeURIComponent(liteYoutubeHtml)}"
  frameborder="0"
  allowfullscreen
  width="640"
  height="360"
  style="max-width: 100%;"
></iframe>`;

  return iframeCode;
};

const CodeBlock = ({ code, language }: { code: string; language: string }) => {
  return (
    <Highlight theme={themes.vsDark} code={code} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={`${className} whitespace-pre-wrap rounded-lg`}
          style={{
            ...style,
            margin: 0,
            padding: "1rem",
            fontSize: "0.875rem",
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })} className="break-all">
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};

const LiteYoutubeTag = () => (
  <Tooltip content="Only for Lite YouTube mode" placement="right">
    <Zap className="w-4 h-4 text-primary/60" />
  </Tooltip>
);

export default function YoutubeEmbed() {
  const [config, setConfig] = useState<YoutubeConfig>(defaultConfig);
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);
  const resizeObserver = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    // Dynamically load lite-youtube-embed script and style
    const loadLiteYoutube = async () => {
      // Add style
      const style = document.createElement("link");
      style.rel = "stylesheet";
      style.href = liteYoutubeCssUrl;
      document.head.appendChild(style);

      // Add script
      const script = document.createElement("script");
      script.src = liteYoutubeJsUrl;
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.head.removeChild(style);
        document.body.removeChild(script);
      };
    };

    loadLiteYoutube();
  }, []);

  useEffect(() => {
    if (previewRef.current) {
      resizeObserver.current = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const width = Math.round(entry.contentRect.width);
          const height = Math.round(entry.contentRect.height);
          setConfig((prev) => ({
            ...prev,
            aspectWidth: width,
            aspectHeight: height,
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

  const handleCopyCode = (type: "lite" | "iframe" | "component") => {
    let code = "";
    switch (type) {
      case "lite":
        code = generateLiteIFrameCode(config);
        break;
      case "component":
        code = generateWebComponentCode(config);
        break;
    }
    const textArea = document.createElement("textarea");
    textArea.value = code;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
    document.body.removeChild(textArea);
  };

  const addUnit = (value: string, unit: string) => {
    const numValue = value.replace(/[^0-9]/g, "");
    return numValue + unit;
  };

  const removeUnit = (value: string) => {
    return value.replace(/[^0-9]/g, "");
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Settings */}
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Settings className="w-5 h-5 text-primary" />
              </div>
              <div className="text-xl font-semibold text-gray-900">
                Settings
              </div>
            </div>
            <div className="flex flex-col gap-6 p-6">
              {/* Basic settings */}
              <div className="space-y-4">
                <div className="text-lg font-bold text-gray-800 border-l-4 border-primary pl-2">
                  Basic settings
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Video URL or ID"
                    labelPlacement="outside"
                    placeholder="Enter YouTube video URL or ID"
                    value={config.videoId}
                    onChange={(e) => {
                      const { videoId } = extractVideoInfo(e.target.value);
                      setConfig((prev) => ({
                        ...prev,
                        videoId,
                      }));
                    }}
                    classNames={{
                      label: "text-sm font-medium text-gray-700",
                      input: "bg-white",
                      description: "text-xs text-gray-500",
                    }}
                  />
                  <Input
                    label="Title"
                    labelPlacement="outside"
                    placeholder="Video title"
                    value={config.title}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, title: e.target.value }))
                    }
                    classNames={{
                      label: "text-sm font-medium text-gray-700",
                      input: "bg-white",
                    }}
                  />
                </div>
              </div>

              {/* Playback control */}
              <div className="space-y-4">
                <div className="text-lg font-bold text-gray-800 border-l-4 border-primary pl-2">
                  Playback control
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2 p-4 rounded-xl bg-default-50 border border-default-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">
                          Autoplay
                        </span>
                      </div>
                      <Tooltip content="Autoplay the video" placement="right">
                        <HelpCircle className="w-4 h-4 text-default-400" />
                      </Tooltip>
                    </div>
                    <Switch
                      size="sm"
                      isSelected={config.autoplay}
                      onValueChange={(value) =>
                        setConfig((prev) => ({ ...prev, autoplay: value }))
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2 p-4 rounded-xl bg-default-50 border border-default-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">
                          Mute playback
                        </span>
                      </div>
                      <Tooltip content="Mute the video" placement="right">
                        <HelpCircle className="w-4 h-4 text-default-400" />
                      </Tooltip>
                    </div>
                    <Switch
                      size="sm"
                      isSelected={config.mute}
                      onValueChange={(value) =>
                        setConfig((prev) => ({ ...prev, mute: value }))
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2 p-4 rounded-xl bg-default-50 border border-default-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">
                          Loop playback
                        </span>
                      </div>
                      <Tooltip
                        content="Loop the video playback"
                        placement="right"
                      >
                        <HelpCircle className="w-4 h-4 text-default-400" />
                      </Tooltip>
                    </div>
                    <Switch
                      size="sm"
                      isSelected={config.loop}
                      onValueChange={(value) =>
                        setConfig((prev) => ({ ...prev, loop: value }))
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2 p-4 rounded-xl bg-default-50 border border-default-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">
                          Show player controls
                        </span>
                      </div>
                      <Tooltip
                        content="Show the player controls"
                        placement="right"
                      >
                        <HelpCircle className="w-4 h-4 text-default-400" />
                      </Tooltip>
                    </div>
                    <Switch
                      size="sm"
                      isSelected={config.controls}
                      onValueChange={(value) =>
                        setConfig((prev) => ({ ...prev, controls: value }))
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2 p-4 rounded-xl bg-default-50 border border-default-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">
                          Show video annotations
                        </span>
                      </div>
                      <Tooltip
                        content="Show the video annotations"
                        placement="right"
                      >
                        <HelpCircle className="w-4 h-4 text-default-400" />
                      </Tooltip>
                    </div>
                    <Switch
                      size="sm"
                      isSelected={config.showAnnotations}
                      onValueChange={(value) =>
                        setConfig((prev) => ({
                          ...prev,
                          showAnnotations: value,
                        }))
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2 p-4 rounded-xl bg-default-50 border border-default-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">
                          Show full screen button
                        </span>
                      </div>
                      <Tooltip
                        content="Show the full screen button"
                        placement="right"
                      >
                        <HelpCircle className="w-4 h-4 text-default-400" />
                      </Tooltip>
                    </div>
                    <Switch
                      size="sm"
                      isSelected={config.fs}
                      onValueChange={(value) =>
                        setConfig((prev) => ({ ...prev, fs: value }))
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Start time"
                    labelPlacement="outside"
                    placeholder="e.g. 1:30"
                    value={config.startTime}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        startTime: e.target.value,
                      }))
                    }
                    classNames={{
                      label: "text-sm font-medium text-gray-700",
                      input: "bg-white",
                    }}
                  />
                  <Input
                    label="End time"
                    labelPlacement="outside"
                    placeholder="e.g. 2:30"
                    value={config.endTime}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        endTime: e.target.value,
                      }))
                    }
                    classNames={{
                      label: "text-sm font-medium text-gray-700",
                      input: "bg-white",
                    }}
                  />
                </div>
              </div>

              {/* Captions and language */}
              <div className="space-y-4">
                <div className="text-lg font-bold text-gray-800 border-l-4 border-primary pl-2">
                  Captions and language
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2 p-4 rounded-xl bg-default-50 border border-default-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">
                          Show captions
                        </span>
                      </div>
                      <Tooltip content="Show the captions" placement="right">
                        <HelpCircle className="w-4 h-4 text-default-400" />
                      </Tooltip>
                    </div>
                    <Switch
                      size="sm"
                      isSelected={config.showCaptions}
                      onValueChange={(value) =>
                        setConfig((prev) => ({
                          ...prev,
                          showCaptions: value,
                        }))
                      }
                    />
                  </div>
                  <Input
                    label="Caption language"
                    labelPlacement="outside"
                    placeholder="e.g. en, zh"
                    value={config.ccLangPref}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        ccLangPref: e.target.value,
                      }))
                    }
                    classNames={{
                      label: "text-sm font-medium text-gray-700",
                      input: "bg-white",
                    }}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Interface language"
                    labelPlacement="outside"
                    placeholder="e.g. en, zh"
                    value={config.hl}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, hl: e.target.value }))
                    }
                    classNames={{
                      label: "text-sm font-medium text-gray-700",
                      input: "bg-white",
                    }}
                  />
                </div>
              </div>

              {/* Appearance settings */}
              <div className="space-y-4">
                <div className="text-lg font-bold text-gray-800 border-l-4 border-primary pl-2">
                  Appearance settings
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label={
                      <div className="flex items-center gap-2">
                        <span>Thumbnail quality</span>
                        <LiteYoutubeTag />
                      </div>
                    }
                    labelPlacement="outside"
                    placeholder="Select thumbnail quality"
                    selectedKeys={[config.poster]}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        poster: e.target.value as YoutubeConfig["poster"],
                      }))
                    }
                    classNames={{
                      label: "text-sm font-medium text-gray-700",
                      trigger: "bg-white",
                    }}
                  >
                    <SelectItem key="default" value="default">
                      Default quality (120x90)
                    </SelectItem>
                    <SelectItem key="mqdefault" value="mqdefault">
                      Medium quality (320x180)
                    </SelectItem>
                    <SelectItem key="hqdefault" value="hqdefault">
                      High quality (480x360)
                    </SelectItem>
                    <SelectItem key="sddefault" value="sddefault">
                      Standard definition (640x480)
                    </SelectItem>
                    <SelectItem key="maxresdefault" value="maxresdefault">
                      Maximum resolution (1280x720)
                    </SelectItem>
                  </Select>
                  <div className="flex flex-col gap-2 p-4 rounded-xl bg-default-50 border border-default-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">
                          Use WebP format
                        </span>
                        <LiteYoutubeTag />
                      </div>
                      <Tooltip content="Use WebP format for thumbnails" placement="right">
                        <HelpCircle className="w-4 h-4 text-default-400" />
                      </Tooltip>
                    </div>
                    <Switch
                      size="sm"
                      isSelected={config.webp}
                      onValueChange={(value) =>
                        setConfig((prev) => ({ ...prev, webp: value }))
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Progress bar color"
                    labelPlacement="outside"
                    placeholder="Select progress bar color"
                    selectedKeys={[config.color]}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        color: e.target.value as any,
                      }))
                    }
                    classNames={{
                      label: "text-sm font-medium text-gray-700",
                      trigger: "bg-white",
                    }}
                  >
                    <SelectItem key="red" value="red">
                      Red
                    </SelectItem>
                    <SelectItem key="white" value="white">
                      White
                    </SelectItem>
                  </Select>
                </div>
              </div>

              {/* Privacy and ads */}
              <div className="space-y-4">
                <div className="text-lg font-bold text-gray-800 border-l-4 border-primary pl-2">
                  Privacy and ads
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2 p-4 rounded-xl bg-default-50 border border-default-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">
                          Allow cookies
                        </span>
                        <LiteYoutubeTag />
                      </div>
                      <Tooltip
                        content="Allow cookies for better performance"
                        placement="right"
                      >
                        <HelpCircle className="w-4 h-4 text-default-400" />
                      </Tooltip>
                    </div>
                    <Switch
                      size="sm"
                      isSelected={config.cookie}
                      onValueChange={(value) =>
                        setConfig((prev) => ({ ...prev, cookie: value }))
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2 p-4 rounded-xl bg-default-50 border border-default-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">
                          Preconnect to ad network
                        </span>
                        <LiteYoutubeTag />
                      </div>
                      <Tooltip
                        content="Preconnect to Google ad network for better performance"
                        placement="right"
                      >
                        <HelpCircle className="w-4 h-4 text-default-400" />
                      </Tooltip>
                    </div>
                    <Switch
                      size="sm"
                      isSelected={config.adNetwork}
                      onValueChange={(value) =>
                        setConfig((prev) => ({ ...prev, adNetwork: value }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Other settings */}
              <div className="space-y-4">
                <div className="text-lg font-bold text-gray-800 border-l-4 border-primary pl-2">
                  Other settings
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <Input
                    label="Parameters"
                    labelPlacement="outside"
                    placeholder="e.g. rel=0&enablejsapi=1"
                    value={config.params}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, params: e.target.value }))
                    }
                    classNames={{
                      label: "text-sm font-medium text-gray-700",
                      input: "bg-white",
                    }}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      label={
                        <div className="flex items-center gap-2">
                          <span>Aspect ratio width</span>
                          <LiteYoutubeTag />
                        </div>
                      }
                      labelPlacement="outside"
                      value={config.aspectWidth.toString()}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          aspectWidth: parseInt(e.target.value) || 16,
                        }))
                      }
                      classNames={{
                        label: "text-sm font-medium text-gray-700",
                        input: "bg-white",
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      label={
                        <div className="flex items-center gap-2">
                          <span>Aspect ratio height</span>
                          <LiteYoutubeTag />
                        </div>
                      }
                      labelPlacement="outside"
                      value={config.aspectHeight.toString()}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          aspectHeight: parseInt(e.target.value) || 9,
                        }))
                      }
                      classNames={{
                        label: "text-sm font-medium text-gray-700",
                        input: "bg-white",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Preview and Code */}
        <div className="flex-1">
          <div className="sticky top-4 space-y-4">
            {/* Preview Section */}
            <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Play className="w-5 h-5 text-primary" />
                </div>
                <div className="text-xl font-semibold text-gray-900">Preview</div>
              </div>
              <div
                key={JSON.stringify(config)} // Add key property to force re-render when config changes
                className="w-full aspect-video bg-gray-100 rounded-xl overflow-hidden"
                dangerouslySetInnerHTML={{
                  __html: generateLiteYoutubeHtml(config),
                }}
              />
            </div>

            {/* Code Section */}
            <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <CodeIcon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-xl font-semibold text-gray-900">
                  Generated Code
                </div>
              </div>
              <Tabs
                aria-label="Code options"
                color="primary"
                variant="underlined"
                classNames={{
                  tabList: "gap-6 overflow-x-auto",
                  cursor: "w-full bg-primary",
                  tab: "max-w-fit px-0 h-12",
                  tabContent: "group-data-[selected=true]:text-primary",
                }}
              >
                <Tab
                  key="lite"
                  title={
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <Zap className="w-4 h-4" />
                      <span>Lite iFrame</span>
                      <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                        Recommended
                      </span>
                    </div>
                  }
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        Lightweight embed code with better performance
                      </span>
                      <Tooltip content="Uses lite-youtube-embed for faster loading">
                        <HelpCircle className={HELP_ICON_CLASSES} />
                      </Tooltip>
                    </div>
                    <Button
                      size="sm"
                      variant={copied ? "solid" : "flat"}
                      className={`${
                        copied
                          ? "bg-success text-white hover:bg-success-500"
                          : "bg-default-100 hover:bg-default-200"
                      }`}
                      onPress={() => handleCopyCode("lite")}
                      startContent={
                        copied ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )
                      }
                    >
                      {copied ? "Copied!" : "Copy code"}
                    </Button>
                  </div>
                  <div className="rounded-lg overflow-hidden">
                    <CodeBlock
                      code={generateLiteIFrameCode(config)}
                      language="html"
                    />
                  </div>
                </Tab>
                <Tab
                  key="component"
                  title={
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <Component className="w-4 h-4" />
                      <span>Web Component</span>
                    </div>
                  }
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        Modern web component implementation
                      </span>
                      <Tooltip content="Custom element that can be used in any HTML page">
                        <HelpCircle className={HELP_ICON_CLASSES} />
                      </Tooltip>
                    </div>
                    <Button
                      size="sm"
                      variant={copied ? "solid" : "flat"}
                      className={`${
                        copied
                          ? "bg-success text-white hover:bg-success-500"
                          : "bg-default-100 hover:bg-default-200"
                      }`}
                      onPress={() => handleCopyCode("component")}
                      startContent={
                        copied ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )
                      }
                    >
                      {copied ? "Copied!" : "Copy code"}
                    </Button>
                  </div>
                  <div className="rounded-lg overflow-hidden">
                    <CodeBlock
                      code={generateWebComponentCode(config)}
                      language="html"
                    />
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
