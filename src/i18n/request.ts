export async function getLocaleMessages(locale: string) {
  const normalized = (locale || "en").split("-")[0];
  try {
    return (await import(`../messages/${normalized}.json`)).default;
  } catch {
    return (await import(`../messages/en.json`)).default;
  }
}

export default getLocaleMessages;
