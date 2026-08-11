import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: 'Kueri carian diperlukan.' }, { status: 400 });
    }

    // Fetch Yahoo Image Search
    const searchUrl = `https://images.search.yahoo.com/search/images?p=${encodeURIComponent(query)}`;
    const res = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (res.ok) {
      const html = await res.text();
      // Match the first "murl" which is the direct image URL from search results
      const match = html.match(/"murl":"(https?:[^"]+)"/);
      if (match && match[1]) {
        // Unescape backslashes if present
        const imageUrl = match[1].replace(/\\/g, '');
        return NextResponse.json({ ok: true, imageUrl });
      }
    }

    return NextResponse.json({ error: 'No image found in public search.' }, { status: 422 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
