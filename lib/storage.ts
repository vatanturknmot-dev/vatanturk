import { supabase } from "./supabase";

export async function uploadSiteAsset(
  file: File,
  folder: string
) {
  const extension = file.name.split(".").pop();

  const fileName =
    Date.now() +
    "-" +
    Math.random().toString(36).substring(2) +
    "." +
    extension;

  const path = `${folder}/${fileName}`;

  const { error } = await supabase.storage
    .from("site-assets")
    .upload(path, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from("site-assets")
    .getPublicUrl(path);

  return {
    url: data.publicUrl,
    path,
  };
}

export async function deleteSiteAsset(path: string) {
  if (!path) return;

  await supabase.storage
    .from("site-assets")
    .remove([path]);
}