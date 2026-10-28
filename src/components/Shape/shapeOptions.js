// src/components/Shape/shapeOptions.js
import React from 'react';
import { Shape } from './Shape';
import { SHAPE_GROUPS } from './shapes';

const GROUP_LABEL = {
  radius: 'Radius', round: 'Round', polygon: 'Soft polygons', cookie: 'Cookies, suns and flowers',
  burst: 'Bursts', pixel: 'Pixel', cut: 'Cut',
};

/**
 * Options for a Select that picks a shape — each with a small picture of the
 * shape beside its name, grouped the way the gallery groups them. Pass the
 * names to offer (all of them, ICON_SHAPES, MORPHABLE_SHAPES…) and any extra
 * leading options such as { value: 'tile', label: 'tile' }.
 *
 *   <Select options={shapeOptions(MORPHABLE_SHAPES)} value={shape} onChange={setShape} />
 */
export function shapeOptions(names, { extra = [], size = 20, color = 'primary' } = {}) {
  const option = (n) => ({ value: n, label: n, icon: <Shape shape={n} color={color} width={size} decorative /> });
  const groups = [];
  for (const n of names) {
    const g = SHAPE_GROUPS[n] || 'round';
    let group = groups.find((x) => x.key === g);
    if (!group) groups.push(group = { key: g, label: GROUP_LABEL[g] || g, options: [] });
    group.options.push(option(n));
  }
  const grouped = groups.length > 1 ? groups.map(({ label, options }) => ({ label, options })) : groups.flatMap((g) => g.options);
  return [...extra, ...grouped];
}
