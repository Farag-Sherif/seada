
import { get, postFormData } from "./../server/api";

export async function getTestimonials() {
  const response = await get("/testimonials");
  return response;
}
export async function getBlogs() {
  const response = await get("/blogs");
  return response;
}
export async function getBlog(id) {
  const response = await get(`/blog/${id}`);
  return response;
}
export async function getSocialLinks() {
  const response = await get("/socails");
  return response;
}

export async function getAddress() {
  const response = await get("/addresse");
  return response;
}

export async function getEmail() {
  const response = await get("/emails");
  return response;
}

export async function getPhone() {
  const response = await get("/mobiles");
  return response;
}

export async function getImages() {
  const response = await get("/images");
  return response;
}
export async function getCity(id) {
  if (!id) return null;
  const response = await get(`/cities/${id}`);
  return response; // يُتوقّع أن يحتوي على states داخلها
}
export async function getCities() {
  const response = await get("/cities");
  return response;
}
export async function getStates() {
  const response = await get("/states");
  return response;
}

export async function getOrders() {
  const response = await get("/orders");
  return response;
}

export async function getChoices() {
  const response = await get("/choices");
  return response;
}

export async function getSettings() {
  const response = await get("/settings");
  return response;
}

export async function sendContact(data) {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("subject", data.subject);
  formData.append("message", data.message);
  const response = await postFormData("/contact", formData);
  return response;
}

export async function getQuestions() {
  const response = await get("/questions");
  return response;
}

export async function getTermsAndConditions() {
  const response = await get("/conditions");
  return response;
}
