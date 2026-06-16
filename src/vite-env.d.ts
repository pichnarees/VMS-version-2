/// <reference types="vite/client" />

import * as _React from 'react';

declare global {
  const React: typeof _React;
  namespace React {
    type ReactNode = _React.ReactNode;
    type ElementType = _React.ElementType;
    type ComponentType<P = {}> = _React.ComponentType<P>;
    type HTMLAttributes<T> = _React.HTMLAttributes<T>;
    type ButtonHTMLAttributes<T> = _React.ButtonHTMLAttributes<T>;
    type InputHTMLAttributes<T> = _React.InputHTMLAttributes<T>;
    type ForwardRefExoticComponent<P> = _React.ForwardRefExoticComponent<P>;
    type RefAttributes<T> = _React.RefAttributes<T>;
    type PropsWithoutRef<P> = _React.PropsWithoutRef<P>;
    type ComponentPropsWithoutRef<T extends _React.ElementType> = _React.ComponentPropsWithoutRef<T>;
    type CSSProperties = _React.CSSProperties;
    type ComponentProps<T extends _React.ElementType> = _React.ComponentProps<T>;
  }
}

declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.jpg" {
  const value: string;
  export default value;
}

declare module "*.svg" {
  const value: string;
  export default value;
}

