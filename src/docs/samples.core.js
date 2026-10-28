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
import { Player } from '../components/Player';
import { Box } from '../components/Box';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import { ToggleButton } from '../components/ToggleButton';
import { LinearProgress } from '../components/LinearProgress';
import { CircularProgress } from '../components/CircularProgress';
import { Icon } from '../components/Icon';
import { Swatch } from '../components/Swatch';
import { Tag } from '../components/Tag';
import { IconBadge } from '../components/IconBadge';
import { Shape } from '../components/Shape';
import { Quote } from '../components/Quote';
import { ShapeButton } from '../components/ShapeButton/ShapeButton';
import { Link } from '../components/Link';
import { Divider } from '../components/Divider';
import { Loader } from '../components/Loader';
import { StateMessage } from '../components/StateMessage';
import { Fab } from '../components/Fab';
import { Rating } from '../components/Rating';
import { CodeBlock } from '../components/CodeBlock';
import { VStack, HStack } from '../components/Stack';
import { Caption, Body, Typography } from '../components/Typography';
import { PALETTES, SIZES, Axis, AxisStack, Toggle, Cell } from './samples';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import MailIcon from '@mui/icons-material/Mail';

/* A stand-in photo for shape samples: image CONTENT, so its colors are its own. */
const SAMPLE_PHOTO = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" preserveAspectRatio="xMidYMid slice">'
  + '<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fc7d8"/><stop offset=".55" stop-color="#cfe2dc"/></linearGradient></defs>'
  + '<rect width="96" height="96" fill="url(#g)"/><circle cx="68" cy="28" r="10" fill="#f6d58a"/>'
  + '<path d="M0 62 L30 40 L52 58 L70 46 L96 64 V96 H0Z" fill="#5e8f7c"/><path d="M0 78 Q40 66 96 80 V96 H0Z" fill="#2f5a4c"/></svg>');
import FavoriteIcon from '@mui/icons-material/Favorite';

const SNIPPET = 'npm install @omni-design/components';

export const CORE_SAMPLES = {
  Typography: {
    /* Four of the 47, chosen to show the axis rather than catalogue it: the
       full ramp lives on the Typography foundation page, and a sample that
       reprints it is a second copy to keep in step. */
    textStyle: () => (
      <VStack gap="var(--Sizing-1)" style={{ alignItems: 'flex-start' }}>
        {[['h2', 'A heading'], ['subtitle', 'A subtitle'],
          ['body', 'Body copy'], ['caption', 'A caption']].map(([t, text]) => (
          <Cell key={t} label={t} emphasis={t === 'body'}>
            <Typography textStyle={t}>{text}</Typography>
          </Cell>
        ))}
      </VStack>
    ),
    color: () => (
      <HStack gap="var(--Sizing-2)" style={{ flexWrap: 'wrap' }}>
        {['standard', 'quiet', 'primary', 'success', 'error'].map((c) => (
          <Cell key={c} label={c} emphasis={c === 'standard'}>
            <Body color={c}>Body</Body>
          </Cell>
        ))}
      </HStack>
    ),
    noWrap: () => (
      <VStack gap="var(--Sizing-2)">
        {[false, true].map((on) => (
          <Cell key={String(on)} label={String(on)} emphasis={!on}>
            <div style={{ width: 180 }}>
              <Body noWrap={on}>A line long enough to need wrapping or an ellipsis.</Body>
            </div>
          </Cell>
        ))}
      </VStack>
    ),
    altMode: () => (
      <HStack gap="var(--Sizing-3)" style={{ flexWrap: 'wrap' }}>
        {['default', 'colored', 'gradient'].map((m) => (
          <Cell key={m} label={m} emphasis={m === 'default'}>
            <Typography textStyle="alt-display-small" altMode={m}>Alt</Typography>
          </Cell>
        ))}
      </HStack>
    ),
    width: () => (
      <VStack gap="var(--Sizing-2)">
        {['hug', 'fill'].map((w) => (
          <Cell key={w} label={w} emphasis={w === 'hug'}>
            <Box surface="Container" style={{ width: 240 }}>
              <Body width={w}>Text</Body>
            </Box>
          </Cell>
        ))}
      </VStack>
    ),
    gutterBottom: () => (
      <VStack gap="var(--Sizing-2)">
        {[false, true].map((on) => (
          <Cell key={String(on)} label={String(on)} emphasis={!on}>
            <div>
              <Body gutterBottom={on}>First line.</Body>
              <Body>Second line.</Body>
            </div>
          </Cell>
        ))}
      </VStack>
    ),
  },

  ToggleButton: {
    /* Both states side by side rather than one toggle you have to press: the
       difference between on and off IS the component, and a reader checking
       whether the selected state reads clearly should not have to interact to
       see it. */
    selected: () => (
      <HStack gap="var(--Sizing-3)" style={{ flexWrap: 'wrap' }}>
        <Cell label="false" emphasis>
          <ToggleButton aria-label="Bold"><FormatBoldIcon /></ToggleButton>
        </Cell>
        <Cell label="true">
          <ToggleButton selected aria-label="Bold"><FormatBoldIcon /></ToggleButton>
        </Cell>
      </HStack>
    ),
  },

  CircularProgress: {
    size: () => (
      <Axis values={SIZES} defaultValue="medium"
            render={(v) => <CircularProgress size={v} value={68} />} />
    ),
    showValue: () => (
      <Toggle offLabel="false" onLabel="true"
              render={(on) => <CircularProgress value={68} showValue={on} />} />
    ),
  },

  LinearProgress: {
    size: () => (
      <VStack gap="var(--Sizing-2)">
        {['small', 'medium', 'large'].map((v) => (
          <Cell key={v} label={v} emphasis={v === 'medium'}>
            <div style={{ width: 280 }}><LinearProgress size={v} value={68} /></div>
          </Cell>
        ))}
      </VStack>
    ),
  },

  Player: {
    /* Every sample is a real track with a real running time. A player showing
       0:00 of 0:00 is a picture of the parts rather than the thing. */
    size: () => (
      <Axis values={SIZES} defaultValue="medium"
            render={(v) => (
              <div style={{ width: 420 }}>
                <Player size={v} title="Weather Report" subtitle="The Mercury Lamps"
                        defaultPosition={42} duration={195}
                        onSeek={() => {}} onPlayPause={() => {}} />
              </div>
            )} />
    ),
    /* The two states side by side rather than a toggle: a player's resting
       state is the thing a reader is checking, and flipping one control hides
       the comparison. */
    'playing / defaultPlaying': () => (
      <VStack gap="var(--Sizing-2)">
        <Cell label="paused" emphasis>
          <div style={{ width: 420 }}>
            <Player title="Weather Report"
                    defaultPosition={42} duration={195}
                    onSeek={() => {}} onPlayPause={() => {}} />
          </div>
        </Cell>
        <Cell label="playing">
          <div style={{ width: 420 }}>
            <Player playing title="Weather Report"
                    defaultPosition={42} duration={195}
                    onSeek={() => {}} onPlayPause={() => {}} />
          </div>
        </Cell>
      </VStack>
    ),
    showTime: () => (
      <Toggle offLabel="true" onLabel="false" render={(off) => (
        <div style={{ width: 420 }}>
          <Player showTime={!off} title="Weather Report"
                  defaultPosition={42} duration={195}
                  onSeek={() => {}} onPlayPause={() => {}} />
        </div>
      )} />
    ),
    disabled: () => (
      <Toggle render={(on) => (
        <div style={{ width: 420 }}>
          <Player disabled={on} title="Weather Report"
                  defaultPosition={42} duration={195}
                  onSeek={() => {}} onPlayPause={() => {}} />
        </div>
      )} />
    ),
  },

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
    /* No `swatch` sample. It was retired as a Button type — a swatch uses
       neither of Button's axes, since its colour is arbitrary data from a
       picker rather than a palette, and it has no solid / outline / ghost
       shape. Figma draws it as its own component with its own clickable and
       Fit axes, so Button has no swatch to show. */
  },

  Chip: {
    /* All nine. Chip's own COLORS list omits `default` and its variant
       defaults to `primary`, so the resting chip IS primary — unlike Button,
       which defaults to the brand's default palette. */
    variant: () => (
      <Axis
        values={PALETTES}
        defaultValue="primary"
        render={(v) => <Chip variant={v} label="Label" />}
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
    /* FILL is what a picker needs: a row of fixed chips with a gap leaves a
       ragged right edge, while a filled row reads as a block of colour. The
       height stays on the ramp either way. */
    fit: () => (
      <VStack gap="var(--Sizing-3)">
        <Cell label="fixed" emphasis width={300}>
          <HStack gap="var(--Sizing-1)">
            {['#505b45', '#8a9a7b', '#c9d4bd'].map((c) => (
              <Swatch key={c} color={c} />
            ))}
          </HStack>
        </Cell>
        <Cell label="fill" width={300}>
          <HStack gap="var(--Sizing-1)" style={{ width: 300 }}>
            {['#505b45', '#8a9a7b', '#c9d4bd'].map((c) => (
              <div key={c} style={{ flex: 1 }}><Swatch color={c} fit="fill" /></div>
            ))}
          </HStack>
        </Cell>
      </VStack>
    ),
    size: () => (
      <Axis values={SIZES} defaultValue="medium"
            render={(v) => <Swatch color="#70947b" size={v} />} />
    ),
    /* Selection is marked on the chip itself — a check on its disc, always
       drawn on --Background and never on the color, because the color is
       arbitrary and its contrast cannot be known. */
    selected: () => (
      <Toggle render={(on) => <Swatch color="#70947b" label="Primary" selected={on} onClick={() => {}} />}
              offLabel="unselected" onLabel="selected" />
    ),
    disabled: () => (
      <Toggle render={(on) => <Swatch color="#70947b" label="Primary" disabled={on} onClick={() => {}} />}
              offLabel="enabled" onLabel="disabled" />
    ),
    /* With a radio every state is delegated to the radio, so the chip stays a
       plain color. Without one the chip carries the state itself. The two
       mark selection differently, and that IS the design.
       
       Clickable, or neither shows: a swatch with no onClick is a plain color
       sample, which draws no radio and no check — so this sample, and
       `selected` above, rendered two identical bare circles. */
    radio: () => (
      <Toggle render={(on) => <Swatch color="#70947b" label="Primary" radio={on} selected onClick={() => {}} />}
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
  },

  Shape: {
    /* A cross-section of the seven groups, each framing the same photo. */
    shape: () => (
      <Axis values={['circle', 'arch', 'cookie-9', 'flower', 'gem', 'burst', 'cut-corners', 'scallop']} defaultValue="circle"
            render={(v) => <Shape shape={v} width={72}><img src={SAMPLE_PHOTO} alt="" /></Shape>} />
    ),
    /* With a color the shape is a themed surface — a sticker's label has a
       known contrast against it. */
    color: () => (
      <Axis values={['primary', 'secondary', 'tertiary', 'neutral', 'warning']} defaultValue="primary"
            render={(v) => <Shape shape="soft-burst" color={v} width={64}><Caption component="span" style={{ fontWeight: 700 }}>NEW</Caption></Shape>} />
    ),
    variant: () => (
      <Axis values={['solid', 'light', 'dark']} defaultValue="solid"
            render={(v) => <Shape shape="cookie-9" color="primary" variant={v} width={64} decorative />} />
    ),
    decorative: () => (
      <Toggle render={(on) => <Shape shape="flower" color="tertiary" width={64} decorative={on} />}
              offLabel="announced" onLabel="aria-hidden" />
    ),
  },

  ShapeButton: {
    shape: () => (
      <Axis values={['circle', 'cookie-9', 'sunny', 'flower', 'clover-4', 'soft-burst']} defaultValue="circle"
            render={(v) => <ShapeButton shape={v} aria-label="Add to favourites"><FavoriteIcon /></ShapeButton>} />
    ),
    morphOn: () => (
      <Axis values={['selected', 'hover', 'press']} defaultValue="selected"
            render={(v) => <ShapeButton shape="circle" morphTo="cookie-9" morphOn={v} selected={v === 'selected'} aria-label="Add to favourites"><FavoriteIcon /></ShapeButton>} />
    ),
    selected: () => (
      <Toggle render={(on) => <ShapeButton shape="circle" morphTo="cookie-9" selected={on} aria-label="Add to favourites"><FavoriteIcon /></ShapeButton>}
              offLabel="rest" onLabel="selected — morphed" />
    ),
    color: () => (
      <Axis values={['default', 'primary', 'secondary', 'tertiary', 'neutral']} defaultValue="primary"
            render={(v) => <ShapeButton shape="cookie-9" color={v} aria-label="Add to favourites"><FavoriteIcon /></ShapeButton>} />
    ),
    size: () => (
      <Axis values={SIZES} defaultValue="medium"
            render={(v) => <ShapeButton shape="cookie-9" size={v} aria-label="Add to favourites"><FavoriteIcon /></ShapeButton>} />
    ),
  },

  Quote: {
    size: () => (
      <AxisStack values={SIZES} defaultValue="medium"
                 render={(v) => <Quote size={v} cite="Priya Shah" detail="Studio Lead, Northwind" avatarInitials="PS">Set up in an afternoon.</Quote>} />
    ),
    align: () => (
      <AxisStack values={['start', 'center']} defaultValue="start"
                 render={(v) => <Quote align={v} size="small" cite="Priya Shah" detail="Studio Lead">Set up in an afternoon.</Quote>} />
    ),
    mark: () => (
      <Toggle render={(on) => <Quote mark={on} size="small" cite="Priya Shah">Set up in an afternoon.</Quote>}
              offLabel="no mark" onLabel="mark" />
    ),
  },

  IconBadge: {
    color: () => (
      <Axis values={['default', ...PALETTES]} defaultValue="primary"
            render={(v) => <IconBadge color={v}><MailIcon /></IconBadge>} />
    ),
    variant: () => (
      <Axis values={['solid', 'light', 'dark']} defaultValue="solid"
            render={(v) => <IconBadge color="primary" variant={v}><MailIcon /></IconBadge>} />
    ),
    size: () => (
      <Axis values={SIZES} defaultValue="medium"
            render={(v) => <IconBadge color="primary" size={v}><MailIcon /></IconBadge>} />
    ),
    /* One shape for every tile on a page — that is what makes it the brand's.
       Shown across the icon-safe set, the drawn 8px corner first. */
    shape: () => (
      <Axis values={['rounded', 'squircle', 'circle', 'gem', 'cookie-9', 'flower', 'cut-corners']} defaultValue="rounded"
            render={(v) => <IconBadge color="primary" shape={v === 'rounded' ? undefined : v}><MailIcon /></IconBadge>} />
    ),
  },

  Link: {
    disabled: () => (
      <Toggle render={(on) => <Link href="#" disabled={on}>Read the guide</Link>}
              offLabel="enabled" onLabel="disabled" />
    ),
  },

  Divider: {
    /* Figma's Color axis: Default (Border-Variant — decorative, no contrast
       requirement) or Colored (Buttons › Border). Colored's palette is the
       Buttons mode, which in code is `color`. */
    color: () => (
      <AxisStack
        values={['default', ...PALETTES]}
        defaultValue="default"
        render={(v) => (v === 'default' ? <Divider /> : <Divider colored color={v} />)}
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
    type: () => (
      <Axis values={['spinner', 'orbit', 'bounce', 'ripple', 'dual-ring', 'bars']} defaultValue="spinner"
            render={(v) => <Loader type={v} message="" />} />
    ),
    multicolor: () => (
      <Toggle render={(on) => (
        <HStack gap="var(--Sizing-3)">
          {['orbit', 'bounce', 'ripple', 'dual-ring', 'bars'].map((t) => <Loader key={t} type={t} multicolor={on} message="" />)}
        </HStack>
      )} />
    ),
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
