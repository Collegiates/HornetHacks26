import { Camera, CameraOff, RefreshCw } from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
} from "react";
import { cn } from "../lib/cn";

interface FaceScanCaptureProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  onCapture: (image: Blob) => Promise<void> | void;
  onSkip?: () => Promise<void> | void;
  submitLabel?: string;
}

export function FaceScanCapture({
  className,
  title = "Set up your face profile",
  description = "This lets PictureMe automatically find photos of you at any event you join.",
  onCapture,
  onSkip,
  submitLabel = "Looks good →",
  ...rest
}: FaceScanCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [loading, setLoading] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canCapture = useMemo(
    () => !loading && !cameraError && !capturedBlob,
    [cameraError, capturedBlob, loading],
  );

  async function startCamera() {
    setLoading(true);
    setCameraError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: "user" },
        },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      setCameraError(
        error instanceof Error
          ? error.message
          : "PictureMe could not access your front-facing camera.",
      );
    } finally {
      setLoading(false);
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  useEffect(() => {
    void startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  async function handleTakePhoto() {
    if (!videoRef.current) {
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 1024;
    canvas.height = videoRef.current.videoHeight || 1024;
    const context = canvas.getContext("2d");

    if (!context) {
      setCameraError("PictureMe could not capture a photo from the camera.");
      return;
    }

    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", 0.95);
    });

    if (!blob) {
      setCameraError("PictureMe could not capture a photo from the camera.");
      return;
    }

    stopCamera();
    setCapturedBlob(blob);
    setPreviewUrl(URL.createObjectURL(blob));
  }

  async function handleRetake() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setCapturedBlob(null);
    setPreviewUrl(null);
    await startCamera();
  }

  async function handleConfirm() {
    if (!capturedBlob) {
      return;
    }

    setSubmitting(true);
    try {
      await onCapture(capturedBlob);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSkip() {
    if (!onSkip) {
      return;
    }

    setSubmitting(true);
    try {
      await onSkip();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={cn("surface-card space-y-5 p-5", className)} {...rest}>
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-seafoam-500">
          Face profile
        </p>
        <h2 className="text-3xl text-ink">{title}</h2>
        <p className="text-sm leading-6 text-slate">{description}</p>
      </div>

      <div className="overflow-hidden rounded-[28px] bg-ink">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Face scan preview"
            className="aspect-[3/4] w-full object-cover"
          />
        ) : (
          <div className="relative aspect-[3/4] w-full">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              autoPlay
              muted
              playsInline
            />
            <div className="pointer-events-none absolute inset-6 rounded-[32px] border border-white/60" />
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-ink/30 text-white">
                <RefreshCw className="h-6 w-6 animate-spin" />
              </div>
            ) : null}
            {cameraError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/80 px-6 text-center text-white">
                <CameraOff className="h-8 w-8" />
                <p className="text-sm leading-6">{cameraError}</p>
                <p className="text-xs uppercase tracking-[0.25em] text-white/60">
                  Camera access is required for face scan capture
                </p>
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        {!capturedBlob ? (
          <button
            type="button"
            className="primary-button flex-1"
            onClick={() => void handleTakePhoto()}
            disabled={!canCapture || submitting}
          >
            <Camera className="mr-2 h-4 w-4" />
            Take photo
          </button>
        ) : (
          <>
            <button
              type="button"
              className="secondary-button flex-1"
              onClick={() => void handleRetake()}
              disabled={submitting}
            >
              Retake
            </button>
            <button
              type="button"
              className="primary-button flex-1"
              onClick={() => void handleConfirm()}
              disabled={submitting}
            >
              {submitLabel}
            </button>
          </>
        )}
      </div>

      {onSkip ? (
        <button
          type="button"
          className="ghost-button w-full justify-center"
          onClick={() => void handleSkip()}
          disabled={submitting}
        >
          Skip for now
        </button>
      ) : null}
    </div>
  );
}
