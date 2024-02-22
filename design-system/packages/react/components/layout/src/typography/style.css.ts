import { classes } from '@hyeon/themes';
import { recipe } from '@vanilla-extract/recipes';

export const textStyle = recipe({
  variants: {
    fontSize: {
      ...classes.typography.text,
    },
    defaultVariants: {
      //기본값은 fontSize: 'xl',
      fontSize: 'xl',
    },
  }
});


export const headingStyle = recipe({
  variants: {
    fontSize: {
      ...classes.typography.heading,
    },
  },
  defaultVariants: {
    fontSize: "4xl",
  },
});