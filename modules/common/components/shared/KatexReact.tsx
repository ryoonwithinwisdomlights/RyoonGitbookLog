"use client";

import katex, { ParseError, type KatexOptions } from "katex";
import React, { useEffect, useState } from "react";
import type { ElementType, ReactNode } from "react";
export type KaTeXProps = {
  children?: string;
  math?: string;
  block?: boolean;
  errorColor?: string;
  renderError?: (error: Error) => ReactNode;
  settings?: KatexOptions;
  as?: ElementType;
  [key: string]: any; // 추가적인 prop 허용
};

export type InnerHtmlStateProps = {
  innerHtml: string | TrustedHTML;
  errorElement?: ReactNode;
};

const TeX: React.FC<KaTeXProps> = ({
  children,
  math,
  block = false,
  errorColor,
  renderError,
  settings,
  as: asComponent = "span", // 기본값 설정,
  ...props
}) => {
  const Component: ElementType = asComponent || (block ? "div" : "span");
  // const Component = asComponent; // JSX에서 사용할 컴포넌트 지정
  const content = children ?? math;

  // const [state, setState] = useState<{ innerHtml: string; errorElement?: ReactNode }>({ innerHtml: "" });
  const [state, setState] = useState<InnerHtmlStateProps>({ innerHtml: "" });

  useEffect(() => {
    try {
      if (!content) {
        setState({ innerHtml: "" });
        return;
      }

      const innerHtml = katex.renderToString(content, {
        displayMode: block,
        errorColor,
        throwOnError: !!renderError,
        ...settings,
      });

      setState({ innerHtml });
    } catch (error) {
      if (error instanceof ParseError || error instanceof TypeError) {
        if (renderError) {
          setState({ innerHtml: "", errorElement: renderError(error) });
        } else {
          setState({ innerHtml: error.message });
        }
      } else {
        throw error;
      }
    }
  }, [block, content, errorColor, renderError, settings]);

  if ("errorElement" in state) {
    return state.errorElement;
  }

  return (
    <Component
      {...props}
      dangerouslySetInnerHTML={{ __html: state.innerHtml }}
    />
  );
};

export default React.memo(TeX);
