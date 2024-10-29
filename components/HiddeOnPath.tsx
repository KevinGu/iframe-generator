"use client";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface HideOnPathsProps {
  children: ReactNode;
  exactHideOn?: string[]; // 完全匹配的路径数组
  startsWithHideOn?: string[]; // 前缀匹配的路径数组
}

const HideOnPaths = ({
  children,
  exactHideOn,
  startsWithHideOn,
}: HideOnPathsProps) => {
  const pathname = usePathname();
  const isExactPath = exactHideOn!.includes(pathname);
  const isStartsWithPath = startsWithHideOn!.some((path) =>
    pathname.startsWith(path)
  );
  const isVisible = !isExactPath && !isStartsWithPath;
  return isVisible ? <>{children}</> : null;
};

export default HideOnPaths;
