"use client";
import { createContext } from "react";
import { getFontClass } from "../font/fonts";

export type FontClassType = ReturnType<typeof getFontClass>;

export const FontContext = createContext<FontClassType | null>(null);
