import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

/**
 * A component that can be used to show and hide content.
 * This component is based on the Radix UI Collapsible primitive.
 */
const Collapsible = CollapsiblePrimitive.Root

/**
 * The trigger that toggles the collapsible content.
 */
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

/**
 * The content that is shown or hidden by the collapsible trigger.
 */
const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
