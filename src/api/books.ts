export async function fetchBooksByAuthors(authors: string[]) {
  const query = authors.map(a => `inauthor:${a}`).join('+');
  const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=20`);
  const { items } = await res.json();
  return (items || []) as Book[];
}