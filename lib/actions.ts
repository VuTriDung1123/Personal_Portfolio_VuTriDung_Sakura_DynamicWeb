"use server";

import prisma from "./prisma"; 
import { revalidatePath } from "next/cache";

// --- 1. ADMIN AUTH ---
export async function checkAdmin(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const VALID_USER = "admin"; 
  const VALID_PASS = "Dung2005";
  if (username?.trim() === VALID_USER && password?.trim() === VALID_PASS) {
    return { success: true };
  }
  return { success: false };
}

// --- 2. BLOG MANAGER ---
export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const tag = formData.get("tag") as string;
  const language = formData.get("language") as string;
  const images = (formData.get("images") as string) || "[]";

  try {
    await prisma.post.create({ data: { title, content, tag, language, images } });
    revalidatePath("/");
  } catch (error) { console.error("Create error:", error); }
}

export async function updatePost(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const tag = formData.get("tag") as string;
  const language = formData.get("language") as string;
  const images = (formData.get("images") as string) || "[]";

  try {
    await prisma.post.update({ where: { id }, data: { title, content, tag, language, images } });
    revalidatePath("/");
    return { success: true };
  } catch (error) { return { success: false, error }; }
}

export async function deletePost(id: string) {
    try { await prisma.post.delete({ where: { id } }); revalidatePath("/"); } catch (error) {}
}

export async function getAllPosts() {
  try { return await prisma.post.findMany({ orderBy: { createdAt: "desc" } }); } catch { return []; }
}

export async function getPostsByTag(tag: string) {
  try { return await prisma.post.findMany({ where: { tag }, orderBy: { createdAt: "desc" } }); } catch { return []; }
}

export async function getPostById(id: string) {
  try { return await prisma.post.findUnique({ where: { id } }); } catch { return null; }
}

// --- 3. SECTION CONTENT MANAGER ---
export async function getSectionContent(key: string) {
  try { return await prisma.pageSection.findUnique({ where: { sectionKey: key } }); } 
  catch (error) { return null; }
}

export async function saveSectionContent(formData: FormData) {
  const sectionKey = formData.get("sectionKey") as string;
  const contentEn = formData.get("contentEn") as string;
  const contentVi = formData.get("contentVi") as string;
  const contentJp = formData.get("contentJp") as string;

  try {
    await prisma.pageSection.upsert({
      where: { sectionKey: sectionKey },
      update: { contentEn, contentVi, contentJp },
      create: { sectionKey, contentEn, contentVi, contentJp },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) { return { success: false }; }
}
