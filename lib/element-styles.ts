import type { SectionStyle, PageElementStyle } from './db';

function formatUnit(val: string | number | undefined, defaultUnit = 'px'): string | undefined {
  if (val === undefined || val === null || val === '') return undefined;
  if (typeof val === 'number') return `${val}${defaultUnit}`;
  if (!isNaN(Number(val))) return `${val}${defaultUnit}`;
  return String(val);
}

export function getElementStyle(
  sectionStyle?: SectionStyle,
  elementKey?: string,
  categoryFallback?: 'headingStyle' | 'bodyStyle' | 'accentStyle'
): React.CSSProperties {
  if (!sectionStyle) return {};
  const elStyle = elementKey ? sectionStyle.elements?.[elementKey] : undefined;
  const categoryStyle = categoryFallback ? sectionStyle[categoryFallback] : undefined;

  const fontFamily = elStyle?.fontFamily || categoryStyle?.fontFamily;
  const color = elStyle?.color || categoryStyle?.color;
  const rawFontSize = elStyle?.fontSize || categoryStyle?.fontSize;
  const letterSpacing = elStyle?.letterSpacing || categoryStyle?.letterSpacing;
  const lineHeight = elStyle?.lineHeight || categoryStyle?.lineHeight;

  // Margin / Spacing
  const marginTop = formatUnit(elStyle?.marginTop);
  const marginBottom = formatUnit(elStyle?.marginBottom);
  const marginLeft = formatUnit(elStyle?.marginLeft);
  const marginRight = formatUnit(elStyle?.marginRight);

  // Padding
  const paddingTop = formatUnit(elStyle?.paddingTop);
  const paddingBottom = formatUnit(elStyle?.paddingBottom);
  const paddingLeft = formatUnit(elStyle?.paddingLeft);
  const paddingRight = formatUnit(elStyle?.paddingRight);

  const styleObj: Record<string, string> = {};

  if (fontFamily) {
    styleObj.fontFamily = `'${fontFamily}', sans-serif`;
    styleObj['--font-heading'] = `'${fontFamily}', serif`;
    styleObj['--font-script'] = `'${fontFamily}', cursive`;
    styleObj['--font-body'] = `'${fontFamily}', sans-serif`;
  }

  if (color) {
    styleObj.color = color;
    styleObj['--color-text'] = color;
    styleObj['--color-primary'] = color;
    styleObj['--adaptive-text'] = color;
    styleObj['--heading-color'] = color;
    styleObj['--accent-color'] = color;
    styleObj['--body-color'] = color;
  }

  if (rawFontSize) {
    const formattedSize = formatUnit(rawFontSize) || String(rawFontSize);
    styleObj.fontSize = formattedSize;
    styleObj['--section-heading-size'] = formattedSize;
    styleObj['--section-accent-size'] = formattedSize;
    styleObj['--section-body-size'] = formattedSize;
    styleObj['--heading-size'] = formattedSize;
    styleObj['--accent-size'] = formattedSize;
    styleObj['--body-size'] = formattedSize;
  }

  if (letterSpacing) {
    styleObj.letterSpacing = formatUnit(letterSpacing) || String(letterSpacing);
  }

  if (lineHeight) {
    styleObj.lineHeight = String(lineHeight);
  }

  if (elStyle?.backgroundColor) {
    styleObj.backgroundColor = elStyle.backgroundColor;
  }
  if (elStyle?.borderColor) {
    styleObj.borderColor = elStyle.borderColor;
  }
  if (elStyle?.borderRadius) {
    styleObj.borderRadius = formatUnit(elStyle.borderRadius) || String(elStyle.borderRadius);
  }

  if (marginTop) styleObj.marginTop = marginTop;
  if (marginBottom) styleObj.marginBottom = marginBottom;
  if (marginLeft) styleObj.marginLeft = marginLeft;
  if (marginRight) styleObj.marginRight = marginRight;

  if (paddingTop) styleObj.paddingTop = paddingTop;
  if (paddingBottom) styleObj.paddingBottom = paddingBottom;
  if (paddingLeft) styleObj.paddingLeft = paddingLeft;
  if (paddingRight) styleObj.paddingRight = paddingRight;

  return styleObj as React.CSSProperties;
}
