import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'URL diperlukan.' }, { status: 400 });
    }

    // Special handler: Shopee item API pricing
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
            if (apiData.data && apiData.data.price) {
              const rawPrice = apiData.data.price;
              const priceVal = (rawPrice / 100000).toFixed(2);
              return NextResponse.json({ ok: true, price: `RM ${priceVal}` });
            }
          }
        } catch (err) {
          console.error('Shopee pricing API failed', err);
        }
      }
    }

    // Generic HTML scraper for Lazada, Amazon, eBay, etc.
    try {
      const htmlRes = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        }
      });
      if (htmlRes.ok) {
        const html = await htmlRes.text();

        // 1. Try meta tags
        const priceMeta = 
          html.match(/<meta[^>]+property=["'](?:og|product):price:amount["'][^>]+content=["']([^"']+)["']/i) ||
          html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["'](?:og|product):price:amount["']/i) ||
          html.match(/<meta[^>]+name=["']twitter:data1["'][^>]+content=["']([^"']+)["']/i); // eBay price often lives here

        if (priceMeta && priceMeta[1]) {
          const val = parseFloat(priceMeta[1].replace(/[^0-9.]/g, ''));
          if (!isNaN(val)) {
            // Check for currency
            const isUSD = url.includes('amazon') || url.includes('ebay');
            return NextResponse.json({ ok: true, price: isUSD ? `$${val.toFixed(2)}` : `RM ${val.toFixed(2)}` });
          }
        }

        // 2. Try Schema JSON-LD
        const jsonLdMatch = html.match(/"price"\s*:\s*"?([0-9.,]+)"?/i);
        if (jsonLdMatch && jsonLdMatch[1]) {
          const val = parseFloat(jsonLdMatch[1].replace(/[^0-9.]/g, ''));
          if (!isNaN(val)) {
            const isUSD = url.includes('amazon') || url.includes('ebay');
            return NextResponse.json({ ok: true, price: isUSD ? `$${val.toFixed(2)}` : `RM ${val.toFixed(2)}` });
          }
        }

        // 3. Regex scan
        const priceRegexMatch = html.match(/(?:RM|\$|USD)\s*([0-9]+(?:\.[0-9]{2})?)/i);
        if (priceRegexMatch && priceRegexMatch[1]) {
          const symbol = priceRegexMatch[0].toUpperCase().includes('RM') ? 'RM ' : '$';
          return NextResponse.json({ ok: true, price: `${symbol}${priceRegexMatch[1]}` });
        }
      }
    } catch (err) {
      console.error('Generic HTML pricing failed', err);
    }

    return NextResponse.json({ error: 'System could not extract price from this URL. Please enter price manually.' }, { status: 422 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
