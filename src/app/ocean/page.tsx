import { Metadata } from "next";
import OceanClient from "./OceanClient";

export const metadata: Metadata = {
  title: "Ocean - Tejas Naladala",
  description:
    "Pilot an underwater ROV through the deep sea. Use WASD to explore, ENTER to dock at stations, SPACE to shoot.",
};

export default function OceanPage() {
  return <OceanClient />;
}
