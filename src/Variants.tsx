import { variants as SSVariant } from "styled-system";

interface Props {
  prop?: string;
  scale?: string;
  variants?: object;
}

export const variant = ({ prop = "variant", scale, variants = { primary: {} } }: Props) =>
  SsVariant({ prop, scale: scale ? `variants.${scale}` : undefined, variants });

export const IntentVariants = variant({ scale: "intents" });

export const TypographyVariants = variant({ scale: "typography" });

export default variant;
