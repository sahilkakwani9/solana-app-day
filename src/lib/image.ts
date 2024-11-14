export function getGoogleDriveDirectUrl(fileId: string) {
  return `https://drive.usercontent.google.com/download?id=${fileId}&export=view&authuser=0`;
}

export function getGoogleDriveThumbnailUrl(fileId: string) {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
}

export async function checkImageAccessibility(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getBestImageUrl(fileId: string): Promise<string> {
  const directUrl = getGoogleDriveDirectUrl(fileId);
  const thumbnailUrl = getGoogleDriveThumbnailUrl(fileId);

  if (await checkImageAccessibility(directUrl)) {
    return `https://ik.imagekit.io/9bxprqiqr3/tr:q-100/${directUrl}`;
  }

  if (await checkImageAccessibility(thumbnailUrl)) {
    return `https://ik.imagekit.io/9bxprqiqr3/tr:q-100/${thumbnailUrl}`;
  }

  return `https://ik.imagekit.io/9bxprqiqr3/tr:q-100/${directUrl}`;
}
