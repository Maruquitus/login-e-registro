"use client";
import { useEffect } from "react";

export default function Landing() {
  useEffect(() => {
    document.location.href = "/login";
  });
  return;
}
