// @ts-nocheck
/**
 * Core components — every axis, every value.
 *
 * Values come from each doc's own `values` list, so a sample and the prop
 * table cannot disagree about what exists. Where the two DO disagree, the
 * comment says so rather than the sample quietly picking a side.
 */
import React from 'react';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { Badge } from '../components/Badge';
import { Alert } from '../components/Alert';
import { Avatar } from '../components/Avatar';
import { Icon } from '../components/Icon';
import { Swatch } from '../components/Swatch';
import { Tag } from '../components/Tag';
import { IconBadge } from '../components/IconBadge';
import { Link } from '../components/Link';
import { Divider } from '../components/Divider';
import { Loader } from '../components/Loader';
import { StateMessage } from '../components/StateMessage';
import { Fab } from '../components/Fab';
import { Rating } from '../components/Rating';
import { CodeBlock } from '../components/CodeBlock';
import { VStack, HStack } from '../components/Stack';
import { Caption, Body } from '../components/Typography';
import { PALETTES, SIZES, Axis, AxisStack, Toggle, Cell } from './samples';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import MailIcon from '@mui/icons-material/Mail';
import FavoriteIcon from '@mui/icons-material/Favorite';

const SNIPPET = 'npm install @omni-design/components';

export const CORE_SAMPLES = {
  Button: {
    /* Figma's TYPE axis is one dropdown of four exclusive values. Code splits
       it into booleans, so `selected` is not part of that axis at all — it is
       ButtonGroup's, where a segment is on or off.

       Figma has no Selected state on the Button set's State axis either
       (Default / Hover / Pressed / Disabled / Focus-Visible); it lives on
       Separated-Button-Segments, which does have one. */
    selected: () => (
      <Toggle
        offLabel="unselected"
        onLabel="selected"
        render={(on) => <Button variant="outline" selected={on}>Bold</Button>}
      />
    ),
    /* A bare <Avatar /> and no size: Figma binds the avatar inside an avatar
       button to Button-Height, so it fills the button edge to edge. */
    avatar: () => (
      <Toggle
        offLabel="text button"
        onLabel="avatar"
        render={(on) => on
          ? <Button avatar aria-label="Jane Doe"><Avatar /></Button>
          : <Button>Jane Doe</Button>}
      />
    ),
    letterNumber: () => (
      <Toggle
        offLabel="text button"
        onLabel="letterNumber"
        render={(on) => on
          ? <Button letterNumber aria-label="3 unread">3</Button>
          : <Button>3 unread</Button>}
      />
    ),
    /* Not one of Figma's four Types. A swatch button carries an arbitrary
       color rather than a palette, so it takes a --Border ring instead of
       the button's own border — the fill could be anything and its contrast
       cannot be known in advance. */
    swatch: () => (
      <Toggle
        offLabel="ordinary button"
        onLabel="swatch"
        render={(on) => on
          ? <Button swatch aria-label="Brand green" style={{ background: '#70947b' }} />
          : <Button>Brand green</Button>}
      />
    ),
  },

  Chip: {
    /* All nine. Chip's own COLORS list omits `default` and its variant
       defaults to `primary`, so the resting chip IS primary — unlike Button,
       which defaults to the brand's default palette. */
    variant: () => (
      <Axis
        values={PALETTES}
        defaultValue="primary"
        render={(v) => <Chip variant={v} label={v} />}
      />
    ),
    selected: () => (
      <Toggle render={(on) => <Chip label="Design" selected={on} clickable />}
              offLabel="unselected" onLabel="selected" />
    ),
    /* Clickable is what makes it a button rather than a label, so it is the
       difference between a filter and a tag. */
    clickable: () => (
      <Toggle render={(on) => <Chip label="Design" clickable={on} />}
              offLabel="static" onLabel="clickable" />
    ),
    disabled: () => (
      <Toggle render={(on) => <Chip label="Design" clickable disabled={on} />}
              offLabel="enabled" onLabel="disabled" />
    ),
  },

  Badge: {
    variant: () => (
      <Axis
        values={PALETTES}
        defaultValue="primary"
        render={(v) => <Badge variant={v} badgeContent={4}><Icon><MailIcon /></Icon></Badge>}
      />
    ),
    /* A dot drops the number entirely: "something changed" without saying how
       much, for cases where the count is not worth the glance. */
    dot: () => (
      <Toggle render={(on) => <Badge dot={on} badgeContent={4}><Icon><MailIcon /></Icon></Badge>}
              offLabel="count" onLabel="dot" />
    ),
    /* Zero is hidden by default, which is almost always right — an inbox with
       no unread mail should not be badged "0". */
    showZero: () => (
      <Toggle render={(on) => <Badge showZero={on} badgeContent={0}><Icon><MailIcon /></Icon></Badge>}
              offLabel="0 hidden" onLabel="0 shown" />
    ),
    invisible: () => (
      <Toggle render={(on) => <Badge invisible={on} badgeContent={4}><Icon><MailIcon /></Icon></Badge>}
              offLabel="visible" onLabel="invisible" />
    ),
    /* Where the badge sits depends on the SHAPE it is badging: a circular
       anchor needs the badge pulled further in, or it floats off the curve. */
    overlap: () => (
      <HStack gap="var(--Sizing-3)" style={{ flexWrap: 'wrap' }}>
        <Cell label="rectangular" emphasis>
          <Badge badgeContent={4} overlap="rectangular">
            <Avatar initials="JD" />
          </Badge>
        </Cell>
        <Cell label="circular">
          <Badge badgeContent={4} overlap="circular">
            <Avatar initials="JD" />
          </Badge>
        </Cell>
      </HStack>
    ),
  },

  Alert: {
    /* FOUR colors, not nine: an alert says something about status, so the
       accent palettes have no meaning here. */
    color: () => (
      <AxisStack
        values={['info', 'success', 'warning', 'error']}
        defaultValue="info"
        render={(v) => <Alert color={v}>{v} — something worth saying.</Alert>}
      />
    ),
    size: () => (
      <AxisStack
        values={SIZES}
        defaultValue="medium"
        render={(v) => <Alert color="info" size={v}>Size {v}.</Alert>}
      />
    ),
  },

  Avatar: {
    /* The default IS the photo — a bare <Avatar /> shows it, and `initials`
       or `icon` are the overrides. Turning it off leaves the fallback. */
    defaultPhoto: () => (
      <Toggle render={(on) => <Avatar defaultPhoto={on} />}
              offLabel="no photo" onLabel="default photo" />
    ),
    size: () => (
      <Axis values={SIZES} defaultValue="medium"
            render={(v) => <Avatar size={v} initials="JD" />} />
    ),
    clickable: () => (
      <Toggle render={(on) => <Avatar initials="JD" clickable={on}
                                     aria-label={on ? 'Jane Doe, open menu' : undefined} />}
              offLabel="static" onLabel="clickable" />
    ),
  },

  Icon: {
    /* Ten values: the nine palettes plus `quiet`. `default` is
       `currentColor`, so an icon with no color takes the color of whatever
       it sits in — which is why an icon inside a button needs nothing. */
    color: () => (
      <Axis
        values={['default', ...PALETTES, 'quiet']}
        defaultValue="default"
        render={(v) => <Icon color={v}><FavoriteIcon /></Icon>}
      />
    ),
    /* SEVEN sizes, not three. Icons span a wider range than anything else
       because they sit inside components of every size. */
    size: () => (
      <Axis
        values={['xxs', 'xs', 'small', 'medium', 'large', 'xl', 'xxl']}
        defaultValue="medium"
        render={(v) => <Icon size={v} color="primary"><FavoriteIcon /></Icon>}
      />
    ),
    /* Two-tone is one color at two opacities — a fixed 50% on the secondary
       pass — not a second color. So it stays within the palette it was given
       and needs no extra token. */
    twoTone: () => (
      <Toggle render={(on) => <Icon color="primary" twoTone={on} size="large"><FavoriteIcon /></Icon>}
              offLabel="solid" onLabel="twoTone" />
    ),
    disabled: () => (
      <Toggle render={(on) => <Icon color="primary" disabled={on}><FavoriteIcon /></Icon>}
              offLabel="enabled" onLabel="disabled" />
    ),
  },

  Swatch: {
    size: () => (
      <Axis values={SIZES} defaultValue="medium"
            render={(v) => <Swatch color="#70947b" size={v} label={v} />} />
    ),
    /* Selection is marked on the chip itself — a check on its disc, always
       drawn on --Background and never on the color, because the color is
       arbitrary and its contrast cannot be known. */
    selected: () => (
      <Toggle render={(on) => <Swatch color="#70947b" label="Primary" selected={on} />}
              offLabel="unselected" onLabel="selected" />
    ),
    disabled: () => (
      <Toggle render={(on) => <Swatch color="#70947b" label="Primary" disabled={on} />}
              offLabel="enabled" onLabel="disabled" />
    ),
    /* With a radio every state is delegated to the radio, so the chip stays a
       plain color. Without one the chip carries the state itself. The two
       mark selection differently, and that IS the design. */
    radio: () => (
      <Toggle render={(on) => <Swatch color="#70947b" label="Primary" radio={on} selected />}
              offLabel="chip carries it" onLabel="radio carries it" />
    ),
  },

  Tag: {
    color: () => (
      <Axis values={['default', ...PALETTES]} defaultValue="primary"
            render={(v) => <Tag color={v}>{v}</Tag>} />
    ),
    /* `fill` stretches to the container, so it means nothing without one —
       hence the bounded box. */
    width: () => (
      <VStack gap="var(--Sizing-2)" style={{ width: 200 }}>
        <VStack gap="var(--Sizing-Half)">
          <Caption color="standard">hug</Caption>
          <Tag color="primary">Beta</Tag>
        </VStack>
        <VStack gap="var(--Sizing-Half)">
          <Caption color="quiet">fill</Caption>
          <Tag color="primary" width="fill">Beta</Tag>
        </VStack>
      </VStack>
    ),
    allCaps: () => (
      <Toggle render={(on) => <Tag color="primary" allCaps={on}>Beta</Tag>}
              offLabel="as written" onLabel="allCaps" />
    ),
  },

  IconBadge: {
    color: () => (
      <Axis values={['default', ...PALETTES]} defaultValue="primary"
            render={(v) => <IconBadge color={v}><MailIcon /></IconBadge>} />
    ),
    /* The doc declares small / medium / large and the component WARNS on any
       of them — size was removed, and IconBadge is now one size. Shown as the
       one value it has rather than three that warn; the doc is the side that
       needs the edit. */
    size: () => (
      <VStack gap="var(--Sizing-1)">
        <IconBadge color="primary"><MailIcon /></IconBadge>
        <Body color="quiet">
          One size. `size` was removed and the component warns if you pass it —
          the prop table above still lists three values, which is a doc bug.
        </Body>
      </VStack>
    ),
  },

  Link: {
    disabled: () => (
      <Toggle render={(on) => <Link href="#" disabled={on}>Read the guide</Link>}
              offLabel="enabled" onLabel="disabled" />
    ),
  },

  Divider: {
    /* Ten values: the eight palettes plus the two border roles. `border` is
       the 3:1 one that outlines clickable things; `border-variant` is
       decorative and carries no contrast requirement, which is why a divider
       defaults to it. */
    color: () => (
      <AxisStack
        values={['border', 'border-variant', ...PALETTES]}
        defaultValue="border-variant"
        render={(v) => <Divider color={v} />}
      />
    ),
    orientation: () => (
      <HStack gap="var(--Sizing-3)" style={{ alignItems: 'flex-start' }}>
        <Cell label="horizontal" emphasis width={160}>
          <div style={{ width: 160 }}><Divider /></div>
        </Cell>
        <Cell label="vertical" width={60}>
          <div style={{ height: 60, display: 'flex' }}>
            <Divider orientation="vertical" style={{ alignSelf: 'stretch' }} />
          </div>
        </Cell>
      </HStack>
    ),
    size: () => (
      <AxisStack values={SIZES} defaultValue="small"
                 render={(v) => <Divider size={v} color="primary" />} />
    ),
    /* Only visible with indicator text — it styles the label's chip, not the
       rule. */
    indicatorStyle: () => (
      <AxisStack values={['outline', 'solid']} defaultValue="outline"
                 render={(v) => <Divider indicatorText="OR" indicatorStyle={v} color="primary" />} />
    ),
    textAlign: () => (
      <AxisStack values={['left', 'center', 'right']} defaultValue="center"
                 render={(v) => <Divider indicatorText="OR" textAlign={v} />} />
    ),
  },

  Loader: {
    color: () => (
      <Axis values={['default', ...PALETTES]} defaultValue="primary"
            render={(v) => <Loader color={v} size="small" message="" />} />
    ),
    size: () => (
      <Axis values={SIZES} defaultValue="medium"
            render={(v) => <Loader size={v} message="" />} />
    ),
  },

  StateMessage: {
    /* The doc declares three types and the component defines TWO — `empty`
       and `error`. `no-results` falls through to `empty`, so it renders
       something plausible and is not a real type. Shown as the two that
       exist; the prop table is the side that needs the edit. */
    type: () => (
      <VStack gap="var(--Sizing-3)" style={{ width: '100%', maxWidth: 360 }}>
        <VStack gap="var(--Sizing-Half)">
          <Caption color="standard">empty</Caption>
          <StateMessage type="empty" title="No projects yet" body="Create one to get started." />
        </VStack>
        <VStack gap="var(--Sizing-Half)">
          <Caption color="quiet">error</Caption>
          <StateMessage type="error" title="Could not load" body="Check your connection and try again." />
        </VStack>
        <Body color="quiet">
          The prop table lists a third, `no-results`. The component defines only
          these two, so it resolves to `empty` — a doc bug rather than a type.
        </Body>
      </VStack>
    ),
    size: () => (
      <AxisStack values={SIZES} defaultValue="medium"
                 render={(v) => <StateMessage type="empty" size={v} title="No projects yet"
                                              body="Create one to get started." />} />
    ),
  },

  Fab: {
    /* The three values of Figma's Style axis, as on Button. Separate from
       color, which the FAB takes from a Theme mode on an inner frame. */
    variant: () => (
      <Axis values={['solid', 'outline', 'ghost']} defaultValue="solid"
            render={(v) => <Fab variant={v} icon={<Icon size="medium"><AddIcon /></Icon>}
                                ariaLabel={'Add, ' + v} />} />
    ),
  },

  Rating: {
    color: () => (
      <Axis values={['default', ...PALETTES]} defaultValue="default"
            render={(v) => <Rating color={v} defaultValue={3} readOnly />} />
    ),
    size: () => (
      <Axis values={SIZES} defaultValue="medium"
            render={(v) => <Rating size={v} defaultValue={3} readOnly />} />
    ),
    /* Read-only is a DISPLAY of a rating rather than a control for setting
       one, so it leaves the tab order — there is nothing to operate. */
    readOnly: () => (
      <Toggle render={(on) => <Rating defaultValue={3} readOnly={on} />}
              offLabel="interactive" onLabel="readOnly" />
    ),
  },

  CodeBlock: {
    showCopy: () => (
      <AxisStack values={[true, false]} defaultValue={true}
                 render={(v) => <CodeBlock code={SNIPPET} language="bash" showCopy={v} />} />
    ),
    /* With the header off the copy button moves INTO the body — two copy
       buttons in one panel would read as two different actions, so there is
       always exactly one. */
    showHeader: () => (
      <AxisStack values={[true, false]} defaultValue={true}
                 render={(v) => <CodeBlock code={SNIPPET} language="bash" showHeader={v} />} />
    ),
    wrap: () => (
      <AxisStack values={[false, true]} defaultValue={false}
                 render={(v) => <CodeBlock language="bash" wrap={v}
                   code={'npx @omni-design/cli generate --theme primary --surface Surface-Bright --out ./tokens'} />} />
    ),
  },
};
