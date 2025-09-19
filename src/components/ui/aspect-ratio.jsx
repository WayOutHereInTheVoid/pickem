import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"

/**
 * @typedef {Object} AspectRatioProps
 * @property {number} [ratio] - The desired aspect ratio.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * A component that maintains a consistent aspect ratio.
 * This component is based on the Radix UI Aspect Ratio primitive.
 * @param {AspectRatioProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const AspectRatio = AspectRatioPrimitive.Root

export { AspectRatio }
