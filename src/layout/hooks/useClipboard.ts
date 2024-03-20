// useClipboard.ts
import { ref } from "vue";

export function useClipboard() {
  const copiedText = ref("");

  const copyTextToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      copiedText.value = text;
      console.log("Text copied to clipboard");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return { copiedText, copyTextToClipboard };
}
