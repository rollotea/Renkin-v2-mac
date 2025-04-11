import { forwardRef } from 'react';
import { mergeClasses } from 'minimal-shared/utils';
import { styled } from '@mui/material/styles';

import { svgColorClasses } from './classes';

import type { SvgColorProps } from './types';
import { Box, SvgIcon } from '@mui/material';

// ----------------------------------------------------------------------

export const SvgColor = forwardRef<HTMLSpanElement, SvgColorProps>((props, ref) => {
  const { src, className, sx, ...other } = props;

  // return (
  //   <Box
  //     sx={{
  //       width: 24,
  //       height: 24,
  //       backgroundImage: `url(${src})`,
  //       backgroundRepeat: 'no-repeat',
  //       backgroundSize: 'cover',
  //       // backgroundColor: "currentcolor",
  //       color: ""
  //     }}/>
  // )

  return (
    <SvgRoot
      ref={ref}
      className={mergeClasses([svgColorClasses.root, className])}
      sx={[
        () => ({
          // mask: `url(${src}) no-repeat center / contain`,
          // WebkitMask: `url(${src}) no-repeat center / contain`,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    />
  );
});
// ----------------------------------------------------------------------

const SvgRoot = styled('span')(() => ({
  width: 24,
  height: 24,
  flexShrink: 0,
  display: 'inline-flex',
  backgroundColor: 'currentColor',
}));
