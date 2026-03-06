import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stories - Tejas Naladala",
  description:
    "Engineering stories from the trenches. Solve a puzzle to get in.",
};

export default function StoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
