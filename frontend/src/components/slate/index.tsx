/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode, Ref, PropsWithChildren } from "react";
import ReactDOM from "react-dom";
import { cx, css } from "@emotion/css";

// Base Props for components
interface BaseProps {
  className?: string;
  [key: string]: unknown;
}

type OrNull<T> = T | null;

interface ButtonProps extends BaseProps {
  active: boolean;
  reversed: boolean;
}

// Button Component
export const Button = React.forwardRef<HTMLSpanElement, ButtonProps>(
  ({ className, active, reversed, ...props }, ref) => (
    <span
      {...props}
      ref={ref}
      className={cx(
        className as string,
        css`
          cursor: pointer;
          color: ${reversed
            ? active
              ? "white"
              : "#aaa"
            : active
            ? "black"
            : "#ccc"};
        `
      )}
    />
  )
);
Button.displayName = "Button";

// EditorValue Component
interface EditorValueProps extends BaseProps {
  value: { document: { nodes: { text: string }[] } };
}

export const EditorValue = React.forwardRef<
  HTMLDivElement,
  PropsWithChildren<EditorValueProps>
>(({ className, value, ...props }, ref) => {
  const textLines = (
    value as { document: { nodes: { text: string }[] } }
  ).document.nodes
    .map((node: any) => node.text) // If using Slate, this could be more specific
    .join("\n");
  return (
    <div
      ref={ref}
      {...props}
      className={cx(
        className as string,
        css`
          margin: 30px -20px 0;
        `
      )}
    >
      <div
        className={css`
          font-size: 14px;
          padding: 5px 20px;
          color: #404040;
          border-top: 2px solid #eeeeee;
          background: #f8f8f8;
        `}
      >
        Slate value as text
      </div>
      <div
        className={css`
          color: #404040;
          font: 12px monospace;
          white-space: pre-wrap;
          padding: 10px 20px;
          div {
            margin: 0 0 0.5em;
          }
        `}
      >
        {textLines}
      </div>
    </div>
  );
});
EditorValue.displayName = "EditorValue";

// Icon Component
export const Icon = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<OrNull<HTMLSpanElement>>
  ) => (
    <span
      {...props}
      ref={ref}
      className={cx(
        "material-icons",
        className,
        css`
          font-size: 18px;
          vertical-align: text-bottom;
        `
      )}
    />
  )
);
Icon.displayName = "Icon";

// Instruction Component
export const Instruction = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<OrNull<HTMLDivElement>>
  ) => (
    <div
      {...props}
      ref={ref}
      className={cx(
        className,
        css`
          white-space: pre-wrap;
          margin: 0 -20px 10px;
          padding: 10px 20px;
          font-size: 14px;
          background: #f8f8e8;
        `
      )}
    />
  )
);
Instruction.displayName = "Instruction";

// Menu Component
export const Menu = React.forwardRef<
  HTMLDivElement,
  PropsWithChildren<BaseProps>
>(({ className, ...props }, ref) => (
  <div
    {...props}
    data-test-id="menu"
    ref={ref}
    className={cx(
      className as string,
      css`
        & > * {
          display: inline-block;
        }

        & > * + * {
          margin-left: 15px;
        }
      `
    )}
  />
));
Menu.displayName = "Menu";

// Portal Component
export const Portal = ({ children }: { children?: ReactNode }) => {
  return ReactDOM.createPortal(children, document.body);
};

// Toolbar Component
export const Toolbar = React.forwardRef<
  HTMLDivElement,
  PropsWithChildren<BaseProps>
>(({ className, ...props }, ref) => (
  <Menu
    {...props}
    ref={ref}
    className={cx(
      className as string,
      css`
        position: relative;
        padding: 1px 18px 17px;
        margin: 0 -20px;
        border-bottom: 2px solid #eee;
        margin-bottom: 20px;
      `
    )}
  />
));
Toolbar.displayName = "Toolbar";
