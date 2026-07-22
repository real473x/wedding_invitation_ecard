import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: 'Kueri carian diperlukan.' }, { status: 400 });
    }

    // Fetch Yahoo Web Search
    const searchUrl = `https://search.yahoo.com/search?p=${encodeURIComponent(query + ' price')}`;
    const res = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (res.ok) {
      const html = await res.text();
      // Match typical price formats (e.g. RM150, RM 150.00, $29.99, etc.) from the search results html
      const match = html.match(/(?:RM|\$)\s*(\d+(?:\.\d{2})?)/i);
      if (match) {
        const symbol = match[0].toUpperCase().includes('RM') ? 'RM ' : '$';
        return NextResponse.json({ ok: true, price: `${symbol}${match[1]}` });
      }
    }

    return NextResponse.json({ error: 'Tiada harga ditemui dalam carian awam.' }, { status: 422 });
  } catch (err) {
    return NextResponse.json({ error: 'Ralat dalaman pelayan.' }, { status: 500 });
  }
}
