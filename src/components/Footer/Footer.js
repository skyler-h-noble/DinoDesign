// src/components/Footer/Footer.js
import React, { useState } from 'react';
import { H4, BodySmall } from '../Typography';
import { Link } from '../Link/Link';
import { Button } from '../Button/Button';
import { TextField } from '../TextField/TextField';
import { Copyright } from '../Copyright/Copyright';

/**
 * Footer Component
 *
 * Configurable footer with 1–4 columns. First column is always the company
 * address / contact. Additional `columns` add link lists (max 3 more).
 * Optional `socialLinks` row and `subscribe` area sit above the copyright.
 *
 * Color: hardcoded to `--Primary-Color-2` body and `--Primary-Color-1`
 * copyright strip for now (per the studio's first-pass spec). Long term these
 * should derive from the user's brand background. Text is `--Primary-Color-12`
 * so it stays readable on the dark brand bg.
 *
 * Props:
 *   brand         — ReactNode, logo / brand icon slot rendered at the top.
 *   address       — { company, lines[], email, phone } — first column.
 *   columns       — [{ title, links: [{ label, href, onClick }] }] — up to 3.
 *   socialLinks   — [{ icon, url, label? }] — optional social icon row.
 *   subscribe     — { title?, description?, placeholder?, buttonLabel?,
 *                     onSubscribe(email) } — optional email subscribe form.
 *   copyrightName — string passed to <Copyright companyName>.
 *   copyrightYear — number passed to <Copyright year>.
 *
 *   className, style, ...rest — forwarded to the <footer> element.
 */
export function Footer({
  brand,
  address,
  columns = [],
  socialLinks = [],
  subscribe,
  copyrightName,
  copyrightYear,
  className,
  style,
  ...rest
}) {
  const visibleColumns = columns.slice(0, 3);
  const columnCount = 1 + visibleColumns.length;

  return (
    <footer
      className={['dino-footer', className].filter(Boolean).join(' ')}
      style={{
        background: 'var(--Primary-Color-2)',
        color: 'var(--Primary-Color-12)',
        ...style,
      }}
      {...rest}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 24px 32px' }}>
        {brand && <div style={{ marginBottom: 36 }}>{brand}</div>}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(' + columnCount + ', minmax(0, 1fr))',
            gap: 40,
          }}
        >
          <AddressColumn address={address} />
          {visibleColumns.map((col, i) => (
            <LinksColumn key={i} {...col} />
          ))}
        </div>

        {(socialLinks.length > 0 || subscribe) && (
          <div
            style={{
              marginTop: 48,
              paddingTop: 32,
              borderTop: '1px solid rgba(255, 255, 255, 0.10)',
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

      <Copyright companyName={copyrightName} year={copyrightYear} />
    </footer>
  );
}

function AddressColumn({ address }) {
  if (!address) return <div />;
  const { company, lines = [], email, phone } = address;
  return (
    <div>
      {company && (
        <H4 style={{ color: 'inherit', marginBottom: 12 }}>{company}</H4>
      )}
      {lines.map((line, i) => (
        <BodySmall
          key={i}
          style={{ color: 'inherit', opacity: 0.85, display: 'block' }}
        >
          {line}
        </BodySmall>
      ))}
      {(email || phone) && (
        <div style={{ marginTop: 12 }}>
          {email && (
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
          )}
          {phone && (
            <BodySmall
              style={{ color: 'inherit', opacity: 0.85, display: 'block' }}
            >
              {phone}
            </BodySmall>
          )}
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
      {links.map((s, i) => (
        <a
          key={i}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label || 'Social link'}
          style={{
            color: 'inherit',
            opacity: 0.85,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            textDecoration: 'none',
            transition: 'opacity 150ms ease, border-color 150ms ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.85'; }}
        >
          {s.icon}
        </a>
      ))}
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
        <TextField
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          size="small"
          fullWidth
          aria-label="Email address"
        />
        <Button
          type="submit"
          variant="primary"
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
