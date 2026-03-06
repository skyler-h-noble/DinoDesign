// src/components/Backdrop/Backdrop.stories.js
import {
  Backdrop,
  DarkBackdrop,
  LightBackdrop,
  InvisibleBackdrop,
  BlurredBackdrop,
  ColoredBackdrop,
  AnimatedBackdrop,
} from './Backdrop';

export default {
  title: 'Feedback/Backdrop',
  component: Backdrop,
};

export const BasicBackdrop = {
  args: {
    open: true,
  },
};

export const DarkBackdropStory = {
  render: () => <DarkBackdrop open={true} />,
};

export const LightBackdropStory = {
  render: () => <LightBackdrop open={true} />,
};

export const InvisibleBackdropStory = {
  render: () => <InvisibleBackdrop open={true} />,
};

export const BlurredBackdropStory = {
  render: () => <BlurredBackdrop open={true} />,
};

export const BlurredBackdropCustom = {
  render: () => <BlurredBackdrop open={true} blur="8px" />,
};

export const ColoredBackdropStory = {
  render: () => (
    <ColoredBackdrop open={true} color="rgba(33, 150, 243, 0.5)" />
  ),
};

export const AnimatedBackdropStory = {
  render: () => <AnimatedBackdrop open={true} />,
};

export const AllBackdrops = {
  render: () => (
    <div>
      <h2>Basic Backdrop</h2>
      <Backdrop open={true} />
      
      <h2>Dark Backdrop</h2>
      <DarkBackdrop open={true} />
      
      <h2>Light Backdrop</h2>
      <LightBackdrop open={true} />
      
      <h2>Invisible Backdrop</h2>
      <InvisibleBackdrop open={true} />
      
      <h2>Blurred Backdrop</h2>
      <BlurredBackdrop open={true} />
      
      <h2>Colored Backdrop</h2>
      <ColoredBackdrop open={true} color="rgba(33, 150, 243, 0.5)" />
      
      <h2>Animated Backdrop</h2>
      <AnimatedBackdrop open={true} />
    </div>
  ),
};
