import { Text, type Theme } from "@sanity/ui";
import type { BlockStyleProps } from "sanity";
import styled from "styled-components";

const Quote = styled.blockquote`
  position: relative;
  display: block;
  margin: 0;
  padding-left: ${({ theme }) => (theme as Theme).sanity.space[3]}px;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: -4px;
    bottom: -4px;
    width: 3px;
    background: var(--card-border-color);
  }
`;

function BlockquoteStyle({ children }: BlockStyleProps) {
  return (
    <Quote>
      <Text as="div">{children}</Text>
    </Quote>
  );
}

export const quoteStyle = {
  title: "Quote",
  value: "blockquote",
  component: BlockquoteStyle,
};

export const defaultBlockStyles = [
  { title: "Normal", value: "normal" },
  { title: "Heading 1", value: "h1" },
  { title: "Heading 2", value: "h2" },
  { title: "Heading 3", value: "h3" },
  { title: "Heading 4", value: "h4" },
  { title: "Heading 5", value: "h5" },
  { title: "Heading 6", value: "h6" },
  quoteStyle,
];
