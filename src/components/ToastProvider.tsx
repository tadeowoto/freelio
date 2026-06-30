import { Toaster } from "sonner";
import "sonner/dist/styles.css";

export default function ToastProvider() {
  return <Toaster position="bottom-right" theme="light" richColors />;
}
