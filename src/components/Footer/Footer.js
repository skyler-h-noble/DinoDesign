// src/components/Footer/Footer.js
import React, { useState } from 'react';
import { H4, BodySmall } from '../Typography';
import { Link } from '../Link/Link';
import { Button } from '../Button/Button';
/* TextInput, not TextField. The lib's own export list marks TextField
 * DEPRECATED — "new code should use TextInput" — because TextField is a
 * thin wrapper around MUI's, while TextInput is the design system's own
 * input with its variants, validation and surface awareness. A footer
 * shipping the deprecated one is the library declining to use itself. */
import { Input as TextInput } from '../Input/Input';
import { Copyright } from '../Copyright/Copyright';
import { BrandIcon } from '../BrandIcon/BrandIcon';

/**
 * Footer Component
 *
 * Configurable footer with 1–4 columns. First column is always the company
 * address / contact. Additional `columns` add link lists (max 3 more).
 * Optional `socialLinks` row and `subscribe` area sit above the copyright.
 *
 * Color presets (the `color` prop):
 *   default       — `--Primary-Color-2` body, `--Primary-Color-1` copyright.
 *                   The long-term plan is to auto-derive this from the brand;
 *                   hardcoded for now.
 *   primary       — `data-theme="Primary" data-surface="Surface"` — adopts the
 *                   user's Primary surface tone.
 *   primary-dark  — `data-theme="Primary" data-surface="Surface-Dimmest"` —
 *                   the deepest Primary surface.
 *   white         — Neutral Color-12 (pure white).
 *   black         — Neutral Color-1 (near-black).
 *
 * Props:
 *   color         — "default" (default) | "primary" | "primary-dark" |
 *                   "white" | "black".
 *   brand         — ReactNode, logo / brand icon slot rendered at the top.
 *   address       — { company, lines[], email, phone } — first column.
 *   columns       — [{ title, links: [{ label, href, onClick }] }] — up to 3.
 *   socialLinks   — [{ icon, url, label? }] — optional social icon row.
 *   subscribe     — { title?, description?, placeholder?, buttonLabel?,
 *                     onSubscribe(email) } — optional email subscribe form.
 *   copyright     — show the copyright line. Default true. Mirrors the
 *                   Boolean on Figma's Footer component.
 *   copyrightName — string passed to <Copyright companyName>.
 *   copyrightYear — number passed to <Copyright year>.
 *
 *   className, style, ...rest — forwarded to the <footer> element.
 */
const COLOR_PRESETS = {
  default:        { bg: 'var(--Primary-Color-2)', fg: 'var(--Primary-Color-12)' },
  primary:        { theme: 'Primary',      surface: 'Surface' },
  'primary-dark': { theme: 'Primary',      surface: 'Surface-Dimmest' },
  white:          { bg: 'var(--Neutral-Color-12)', fg: 'var(--Neutral-Color-2)' },
  black:          { bg: 'var(--Neutral-Color-1)',  fg: 'var(--Neutral-Color-12)' },
};

export function Footer({
  color = 'default',
  brand,
  address,
  columns = [],
  socialLinks = [],
  /* Figma carries this as a Boolean on the Footer. Default true: a
     footer almost always has the line, and the cases that do not are
     app shells rather than pages. Kept as a prop rather than left
     unconditional so the two sides can express the same thing — a
     toggle in the file that code cannot honour is how a design and
     its implementation drift without either looking wrong. */
  copyright = true,
  children,
  subscribe,
  copyrightName,
  copyrightYear,
  className,
  style,
  ...rest
}) {
  const visibleColumns = columns.slice(0, 3);
  const preset = COLOR_PRESETS[color] || COLOR_PRESETS.default;
  // When the preset declares a theme/surface, we rely on the cascade to
  // resolve --Background. Otherwise we paint the explicit hex from the preset.
  const themeAttrs = preset.theme
    ? { 'data-theme': preset.theme, 'data-surface': preset.surface || 'Surface' }
    : {};
  const paintStyle = preset.theme
    ? { background: 'var(--Background)', color: 'var(--Text)' }
    : { background: preset.bg, color: preset.fg };

  return (
    <footer
      {...themeAttrs}
      className={['dino-footer', className].filter(Boolean).join(' ')}
      style={{
        ...paintStyle,
        ...style,
      }}
      {...rest}
    >
      {/* Bottom padding runs slightly heavier than top so the copyright /
          fine-print row below the columns has clear breathing room from the
          edge — mirrors the classic footer rhythm where the visual base is
          weightier than the top hairline. */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 56px' }}>
        {brand && <div style={{ marginBottom: 36 }}>{brand}</div>}

        <div
          style={{
            display: 'grid',
            // Auto-fit + minmax(280px, 1fr) gives each column a 280px floor
            // (so the address column has room for two address lines + contact
            // info) and lets columns wrap onto new rows on narrower screens.
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 40,
          }}
        >
          {/* `children` IS Figma's Slot (Slot#9250:92), which wraps exactly this
              region. A slot means the columns are the consumer's to fill with
              whatever they have — so children, when given, replace the built-in
              address + link columns rather than sitting beside them. The props
              stay as the convenient path for the ordinary case. */}
          {children || (
            <>
              <AddressColumn address={address} />
              {visibleColumns.map((col, i) => (
                <LinksColumn key={i} {...col} />
              ))}
            </>
          )}
        </div>

        {(socialLinks.length > 0 || subscribe) && (
          <div
            style={{
              marginTop: 48,
              paddingTop: 32,
              borderTop: '1px solid var(--Border-Variant)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 32,
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            }}
          >
            {socialLinks.length > 0 && <SocialRow links={socialLinks} />}
            {subscribe && <SubscribeArea {...subscribe} />}
          </div>
        )}
      </div>

      {copyright && (
        <Copyright color={color} companyName={copyrightName} year={copyrightYear} />
      )}
    </footer>
  );
}

function AddressColumn({ address }) {
  if (!address) return <div />;
  const { company, lines = [], email, phone } = address;
  // Company / address lines / phone are all rendered as plain body copy at the
  // same weight. The brand identity already lives in the `brand` slot above
  // the columns — repeating it as a header here would be redundant.
  const addressLines = [
    ...(company ? [company] : []),
    ...lines,
    ...(phone ? [phone] : []),
  ];
  return (
    <div>
      {addressLines.map((line, i) => (
        <BodySmall
          key={i}
          style={{ color: 'inherit', opacity: 0.85, display: 'block' }}
        >
          {line}
        </BodySmall>
      ))}
      {email && (
        <div style={{ marginTop: 12 }}>
          <BodySmall
            style={{ color: 'inherit', opacity: 0.85, display: 'block' }}
          >
            <Link
              href={'mailto:' + email}
              color="standard"
              style={{ color: 'inherit' }}
            >
              {email}
            </Link>
          </BodySmall>
        </div>
      )}
    </div>
  );
}

function LinksColumn({ title, links = [] }) {
  return (
    <div>
      {title && (
        <H4 style={{ color: 'inherit', marginBottom: 12 }}>{title}</H4>
      )}
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {links.map((l, i) => (
          <li key={i} style={{ marginBottom: 8 }}>
            <Link
              href={l.href}
              onClick={l.onClick}
              color="standard"
              style={{ color: 'inherit', opacity: 0.85 }}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialRow({ links }) {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      {links.map((s, i) => {
        /* A name that exists but says nothing passes every automated checker
           AND silences the warnings — `aria-label="Social link"` on six links
           in a row announces six identical controls. The default is gone; a
           missing name now warns in development, because a MISSING name at
           least trips something while a meaningless one does not. */
        const name = s.label || s.name;
        if (process.env.NODE_ENV !== 'production' && !name) {
          console.warn(
            '[Footer] a socialLinks entry has no `label`. Each one needs the '
            + 'service it points at ("GitHub", "LinkedIn") — the icon carries no '
            + 'text, so without it a screen reader announces only "link".',
          );
        }
        return (
          <a
            key={i}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={name}
            className="footer-social-link"
            style={{
              color: 'inherit',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              /* No ring. Figma's SocialLinks row is three Brand-Icons
                 instances at their natural glyph widths (24, 21, 21) with a
                 Sizing-2 gap and nothing drawn around them. The 36px bordered
                 circle here was invented, and it is the kind of invention that
                 sticks: it reads as deliberate, so nobody checks it. The hit
                 area is kept at 36 via padding, since 24px of glyph is under
                 the 24x24 floor once you account for the glyph's own bearing. */
              padding: 6,
              /* --Border-Variant, not a hardcoded white at 18%. The literal
                 assumed a dark footer: on a light surface it painted an
                 invisible border, and it could not follow a theme at all.
                 Border-Variant is the decorative tier, which is right here —
                 this ring outlines a link but carries no meaning of its own. */
              textDecoration: 'none',
              transition: 'opacity var(--Motion-Duration-Fast, 150ms) var(--Motion-Easing-Standard, ease)',
            }}
          >
            {/* `brand` takes a Font Awesome brand icon and renders the real
                mark; `icon` stays supported for anything already passing its
                own node. */}
            {s.brand ? <BrandIcon name={s.brand} size="24px" /> : s.icon}
          </a>
        );
      })}
    </div>
  );
}

function SubscribeArea({
  title = 'Stay in the loop',
  description,
  placeholder = 'your@email.com',
  buttonLabel = 'Subscribe',
  onSubscribe,
}) {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    try {
      await onSubscribe?.(email);
      setEmail('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ minWidth: 260, maxWidth: 360, flex: '1 1 260px' }}
    >
      <H4 style={{ color: 'inherit', marginBottom: 6 }}>{title}</H4>
      {description && (
        <BodySmall
          style={{
            color: 'inherit',
            opacity: 0.85,
            marginBottom: 12,
            display: 'block',
          }}
        >
          {description}
        </BodySmall>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        <TextInput
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          size="small"
          fullWidth
          aria-label="Email address"
        />
        {/* No variant. Controls take the brand's `default` colour unless a
            design explicitly marks them primary — this one was marked primary
            by nobody, and a footer's newsletter signup is not the primary
            action on the page it sits at the bottom of. */}
        <Button
          type="submit"
          size="small"
          disabled={submitting || !email}
        >
          {buttonLabel}
        </Button>
      </div>
    </form>
  );
}

export default Footer;
