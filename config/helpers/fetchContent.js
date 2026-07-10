export async function fetchContent(content) {
  try {
    const res = await fetch(
      `../../contents/${content}.json`,
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
    return;
  }
}
