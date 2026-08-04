import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'URL diperlukan.' }, { status: 400 });
    }

    // Try parsing Shopee URL for shopId and itemId
    const match = url.match(/-i\.(\d+)\.(\d+)/) || url.match(/product\/(\d+)\/(\d+)/);
    if (match) {
      const shopId = match[1];
      const itemId = match[2];
      try {
        const apiRes = await fetch(`https://shopee.com.my/api/v4/item/get?itemid=${itemId}&shopid=${shopId}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json',
          }
        });
        if (apiRes.ok) {
          const apiData = await apiRes.json();
          if (apiData.data && apiData.data.image) {
            const imageUrl = `https://down-my.img.susercontent.com/file/${apiData.data.image}`;
            return NextResponse.json({ ok: true, imageUrl });
          }
        }
      } catch (err) {
        console.error('Shopee API fetch failed', err);
      }
    }

    // Fallback: Scrape HTML for og:image
    try {
      const htmlRes = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      if (htmlRes.ok) {
        const html = await htmlRes.text();
        const ogImageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/) || 
                             html.match(/<meta\s+name="twitter:image"\s+content="([^"]+)"/);
        if (ogImageMatch && ogImageMatch[1]) {
          return NextResponse.json({ ok: true, imageUrl: ogImageMatch[1] });
        }
      }
    } catch (err) {
      console.error('Shopee HTML scraping failed', err);
    }

    return NextResponse.json({ error: 'Gagal mendapatkan gambar dari Shopee. Pastikan link sah.' }, { status: 422 });
  } catch (err) {
    return NextResponse.json({ error: 'Ralat dalaman pelayan.' }, { status: 500 });
  }
}
