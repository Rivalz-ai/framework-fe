import React from "react";
import Typography from "../customs/typography";

export default function FallbackComponent() {
  return (
    <div className="flex min-h-screen flex-1 flex-col gap-y-4 bg-black/50 justify-center items-center">
      <Typography.Text>Loading...</Typography.Text>
    </div>
  );
}
