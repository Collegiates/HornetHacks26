import { apiFetch } from "./api";
import type { FaceProfileStatus } from "../types";

export function submitFaceScan(image: Blob) {
  const formData = new FormData();
  formData.append("face", image, "face-scan.jpg");

  return apiFetch<FaceProfileStatus>("/api/account/face-profile", {
    method: "POST",
    body: formData,
  });
}
