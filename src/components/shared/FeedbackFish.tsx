import { FeedbackFish as Fish } from "@feedback-fish/react";

const FeedbackFish = () => {
  return (
    <div
      style={{ position: "fixed", bottom: 30, left: 75, fontWeight: "bold" }}
    >
      <Fish projectId="02aeff5aea8e7b">
        <button style={{ fontWeight: "bold" }}>Send feedback</button>
      </Fish>
    </div>
  );
};

export { FeedbackFish };
