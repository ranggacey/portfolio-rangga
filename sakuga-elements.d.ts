// Type declarations for Sakuga VFX custom elements (plain scripts loaded
// from public/sakuga-vfx/ — the files are used as-is, never rewritten).
// See https://github.com/finktheartist/sakuga-vfx (MIT).

import type React from "react";

export interface SakugaButtonElement extends HTMLElement {
  done(hold?: number): void;
  impact(): void;
  disabled: boolean;
}

export interface SakugaProgressElement extends HTMLElement {
  set(n: number, instant?: boolean): void;
  reset(): void;
  readonly value: number;
  readonly done: boolean;
}

export interface SakugaToastElement extends HTMLElement {
  show(message?: string): void;
  hide(): void;
  readonly open: boolean;
}

export interface SakugaTooltipElement extends HTMLElement {
  show(on?: boolean): void;
  hide(): void;
  readonly open: boolean;
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "sakuga-button": React.DetailedHTMLProps<
        React.HTMLAttributes<SakugaButtonElement>,
        SakugaButtonElement
      > & {
        variant?: "primary" | "secondary";
        type?: string;
        disabled?: boolean;
      };
      "sakuga-progress": React.DetailedHTMLProps<
        React.HTMLAttributes<SakugaProgressElement>,
        SakugaProgressElement
      > & {
        label?: string;
        value?: number;
        "done-label"?: string;
      };
      "sakuga-tooltip": React.DetailedHTMLProps<
        React.HTMLAttributes<SakugaTooltipElement>,
        SakugaTooltipElement
      > & {
        text?: string;
        label?: string;
      };
      "sakuga-toast": React.DetailedHTMLProps<
        React.HTMLAttributes<SakugaToastElement>,
        SakugaToastElement
      > & {
        duration?: number;
        message?: string;
      };
    }
  }
}

declare global {
  interface Window {
    SakugaFX?: {
      burst(
        x: number,
        y: number,
        opts?: { r?: number; spikes?: number; life?: number }
      ): void;
      sfx(
        word: string,
        x: number,
        y: number,
        opts?: { size?: number; rot?: number; life?: number }
      ): void;
      puff(
        x: number,
        y: number,
        opts?: Record<string, unknown>
      ): void;
    };
  }
}
