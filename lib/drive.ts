/**
 * Google Drive integration (server-only).
 *
 * Reads a shared parent folder where each subfolder is one collection and the
 * images inside it are that collection's carousel. Authenticates with a Google
 * service account (JWT → access token, no external dependency) and serves images
 * via Drive's public thumbnail endpoint, which renders any source format
 * (including iPhone HEIC) as a web-safe JPEG.
 *
 * Required env vars (see .env.local):
 *   GOOGLE_SERVICE_ACCOUNT_KEY   service account JSON (raw or base64-encoded)
 *   DRIVE_COLLECTIONS_FOLDER_ID  ID of the shared parent folder
 *
 * This module must never be imported by a Client Component (it uses node:crypto
 * and a private key). It is reached only through the server `app/page.tsx`.
 */
import crypto from "node:crypto";
import type { Collection, CollectionImage } from "@/lib/types";

const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const DRIVE_FILES = "https://www.googleapis.com/drive/v3/files";
const SCOPE = "https://www.googleapis.com/auth/drive.readonly";

interface ServiceAccount {
  client_email: string;
  private_key: string;
}

interface DriveFile {
  id: string;
  name: string;
  imageMediaMetadata?: { width?: number; height?: number };
}

export function isDriveConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY &&
      process.env.DRIVE_COLLECTIONS_FOLDER_ID
  );
}

function getServiceAccount(): ServiceAccount {
  const raw = (process.env.GOOGLE_SERVICE_ACCOUNT_KEY ?? "").trim();
  // Accept either raw JSON or base64-encoded JSON (env-friendly single line).
  const json = raw.startsWith("{")
    ? raw
    : Buffer.from(raw, "base64").toString("utf8");
  const parsed = JSON.parse(json);
  return {
    client_email: parsed.client_email,
    private_key: parsed.private_key,
  };
}

// In-memory access token cache (per server instance).
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(sa: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.expiresAt - 60 > now) {
    return cachedToken.token;
  }

  const header = Buffer.from(
    JSON.stringify({ alg: "RS256", typ: "JWT" })
  ).toString("base64url");
  const claims = Buffer.from(
    JSON.stringify({
      iss: sa.client_email,
      scope: SCOPE,
      aud: TOKEN_ENDPOINT,
      iat: now,
      exp: now + 3600,
    })
  ).toString("base64url");
  const signingInput = `${header}.${claims}`;
  const signature = crypto
    .sign("RSA-SHA256", Buffer.from(signingInput), sa.private_key)
    .toString("base64url");
  const assertion = `${signingInput}.${signature}`;

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  if (!res.ok) {
    throw new Error(
      `Google token request failed: ${res.status} ${await res.text()}`
    );
  }
  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    token: data.access_token,
    expiresAt: now + (data.expires_in ?? 3600),
  };
  return cachedToken.token;
}

async function listFiles(
  token: string,
  query: string,
  fields: string
): Promise<DriveFile[]> {
  const files: DriveFile[] = [];
  let pageToken: string | undefined;

  do {
    const params = new URLSearchParams({
      q: query,
      fields: `nextPageToken, files(${fields})`,
      orderBy: "name_natural",
      pageSize: "1000",
    });
    if (pageToken) params.set("pageToken", pageToken);

    const res = await fetch(`${DRIVE_FILES}?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      throw new Error(`Drive list failed: ${res.status} ${await res.text()}`);
    }
    const data = (await res.json()) as {
      files?: DriveFile[];
      nextPageToken?: string;
    };
    files.push(...(data.files ?? []));
    pageToken = data.nextPageToken;
  } while (pageToken);

  return files;
}

// "01 Modern Masters" / "01_..." / "01-..." / "01. ..." -> "Modern Masters"
function titleFromFolderName(name: string): string {
  return name.replace(/^\s*\d+\s*[._)\-]?\s*/, "").trim() || name;
}

function toImage(file: DriveFile): CollectionImage {
  return {
    id: file.id,
    // Size (`sz=wN`) is appended per rendered width by lib/drive-image-loader.
    src: `https://drive.google.com/thumbnail?id=${file.id}`,
    alt: file.name.replace(/\.[^.]+$/, ""),
    // Real dimensions keep aspect ratios correct; fall back to portrait-ish.
    width: file.imageMediaMetadata?.width ?? 1200,
    height: file.imageMediaMetadata?.height ?? 1500,
  };
}

export async function getCollectionsFromDrive(): Promise<Collection[]> {
  const sa = getServiceAccount();
  const folderId = process.env.DRIVE_COLLECTIONS_FOLDER_ID as string;
  const token = await getAccessToken(sa);

  const subfolders = await listFiles(
    token,
    `'${folderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    "id, name"
  );

  const collections = await Promise.all(
    subfolders.map(async (folder): Promise<Collection> => {
      const images = await listFiles(
        token,
        `'${folder.id}' in parents and mimeType contains 'image/' and trashed = false`,
        "id, name, imageMediaMetadata(width, height)"
      );
      return {
        id: folder.id,
        title: titleFromFolderName(folder.name),
        images: images.map(toImage),
      };
    })
  );

  // Hide empty collections (a subfolder with no images yet).
  return collections.filter((collection) => collection.images.length > 0);
}
