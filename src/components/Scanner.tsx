import { useEffect, useRef, useState } from "react";
import {
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
  type QrcodeErrorCallback,
  type QrcodeSuccessCallback,
} from "html5-qrcode";

interface Props {
  onResult: (text: string) => void;
  onClose: () => void;
}

const REGION_ID = "kashef-qr-region";

export default function Scanner({ onResult, onClose }: Props) {
  const instanceRef = useRef<Html5Qrcode | null>(null);
  const doneRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(true);

  useEffect(() => {
    let cancelled = false;
    doneRef.current = false;

    const onSuccess: QrcodeSuccessCallback = (decodedText) => {
      if (doneRef.current) return;
      doneRef.current = true;
      void stop().then(() => onResult(decodedText));
    };

    const onError: QrcodeErrorCallback = () => {
      // تجاهل أخطاء الإطارات المتكررة أثناء البحث
    };

    async function stop() {
      const inst = instanceRef.current;
      if (inst) {
        try {
          if (inst.isScanning) await inst.stop();
          inst.clear();
        } catch {
          /* ignore */
        }
      }
    }

    async function start() {
      try {
        const html5 = new Html5Qrcode(REGION_ID, {
          formatsToSupport: [
            Html5QrcodeSupportedFormats.QR_CODE,
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.CODE_93,
            Html5QrcodeSupportedFormats.ITF,
          ],
          verbose: false,
        });
        instanceRef.current = html5;

        await html5.start(
          { facingMode: "environment" },
          { fps: 12, qrbox: { width: 270, height: 170 }, aspectRatio: 1.4 },
          onSuccess,
          onError,
        );
        if (cancelled) void stop();
        else setStarting(false);
      } catch (e) {
        setStarting(false);
        const msg = (e as Error)?.message || "";
        if (msg.includes("Permission") || msg.includes("NotAllowed")) {
          setError("تم رفض إذن الكاميرا. فعّل الكاميرا من إعدادات المتصفح.");
        } else if (msg.includes("NotFound") || msg.includes("device")) {
          setError("لا توجد كاميرا متاحة على هذا الجهاز.");
        } else {
          setError("تعذّر تشغيل الكاميرا. جرّب إدخال الكود يدويًا.");
        }
      }
    }

    void start();

    return () => {
      cancelled = true;
      doneRef.current = true;
      void stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleClose() {
    const inst = instanceRef.current;
    if (inst && inst.isScanning) {
      try {
        await inst.stop();
        inst.clear();
      } catch {
        /* ignore */
      }
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* منطقة الفيديو */}
      <div id={REGION_ID} className="absolute inset-0" />

      {/* تعتيم + إطار */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="relative h-[44%] w-[78%] max-w-sm">
          <span className="absolute right-0 top-0 h-8 w-8 border-r-4 border-t-4 border-[#22c55e]" />
          <span className="absolute left-0 top-0 h-8 w-8 border-l-4 border-t-4 border-[#22c55e]" />
          <span className="absolute bottom-0 right-0 h-8 w-8 border-b-4 border-r-4 border-[#22c55e]" />
          <span className="absolute bottom-0 left-0 h-8 w-8 border-b-4 border-l-4 border-[#22c55e]" />
          <div className="scanbeam animate-scanline absolute inset-x-0 top-0 h-16" />
        </div>
      </div>

      {/* الشريط العلوي */}
      <div className="relative z-10 flex items-center justify-between p-4">
        <div className="rounded-lg bg-black/60 px-3 py-1.5 font-cairo text-sm font-bold text-white">
          🎯 وجّه الكاميرا نحو الكود
        </div>
        <button
          onClick={handleClose}
          className="btn-press rounded-xl border-2 border-white bg-white px-4 py-1.5 font-cairo text-sm font-extrabold text-black"
        >
          إغلاق ✕
        </button>
      </div>

      {/* الحالة السفلية */}
      <div className="relative z-10 mt-auto p-5 text-center">
        {starting && (
          <div className="mx-auto flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-2 font-cairo text-sm font-bold text-black">
            <span className="inline-block h-4 w-4 animate-spin-slow rounded-full border-2 border-black border-t-transparent" />
            جارٍ تشغيل الكاميرا…
          </div>
        )}
        {error && (
          <div className="mx-auto max-w-sm rounded-xl border-2 border-red-500 bg-white p-4 font-cairo text-sm font-bold text-red-600">
            {error}
            <div className="mt-3">
              <button
                onClick={handleClose}
                className="btn-press rounded-lg bg-red-600 px-4 py-1.5 text-white"
              >
                العودة للكتابة اليدوية
              </button>
            </div>
          </div>
        )}
        {!starting && !error && (
          <p className="font-cairo text-xs font-semibold text-white/80">
            ندعم QR و EAN-13 و CODE128 ومعظم الباركودات
          </p>
        )}
      </div>
    </div>
  );
}
