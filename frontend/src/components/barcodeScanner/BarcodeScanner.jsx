import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function BarcodeScanner({ onScan, onClose }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: 250,
        rememberLastUsedCamera: true,
      },
      false
    );

    scanner.render(
      (decodedText) => {
        onScan(decodedText);
        scanner.clear();
      },
      (error) => {
        // ignore scan errors
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
      <div id="reader" className="w-full max-w-sm bg-white p-3 rounded" />

      <button
        onClick={onClose}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
      >
        Close Scanner
      </button>
    </div>
  );
}