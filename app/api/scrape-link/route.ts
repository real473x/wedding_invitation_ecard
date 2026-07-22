import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'URL diperlukan.' }, { status: 400 });
    }

    // Special handler: Shopee item API extraction
    if (url.includes('shopee.com.my')) {
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
              return NextResponse.json({ ok: true, imageUrl: `https://down-my.img.susercontent.com/file/${apiData.data.image}` });
            }
          }
        } catch (err) {
          console.error('Shopee API fallback failed', err);
        }
      }
    }

    // Generic fallback: fetch HTML and parse OpenGraph/Twitter image tags
    try {
      const htmlRes = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        }
      });
      if (htmlRes.ok) {
        const html = await htmlRes.text();
        const ogImageMatch = 
          html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
          html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) ||
          html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i) ||
          html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);

        if (ogImageMatch && ogImageMatch[1]) {
          let imageUrl = ogImageMatch[1];
          if (imageUrl.startsWith('//')) {
            imageUrl = 'https:' + imageUrl;
          } else if (imageUrl.startsWith('/')) {
            const urlObj = new URL(url);
            imageUrl = urlObj.origin + imageUrl;
          }
          return NextResponse.json({ ok: true, imageUrl });
        }
      }
    } catch (err) {
      console.error('Generic HTML scraping failed', err);
    }

    return NextResponse.json({ error: 'Sistem tidak dapat mengekstrak gambar secara automatik dari laman web ini. Sila muat naik gambar secara manual.' }, { status: 422 });
  } catch (err) {
    return NextResponse.json({ error: 'Ralat dalaman pelayan.' }, { status: 500 });
  }
}
