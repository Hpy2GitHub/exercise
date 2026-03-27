import React, { AnchorHTMLAttributes } from 'react';

/**
 * Define the specific props for the Anchor component.
 * We extend AnchorHTMLAttributes<HTMLAnchorElement> to inherit all
 * standard HTML <a> tag attributes (like onClick, style, id, etc.)
 */
export interface AnchorProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  // All standard <a> tag attributes (href, className, etc.) are inherited here.
  
  // You can optionally redefine 'children' if you want a specific type for the content,
  // but it's typically handled by the inherited attributes.
  // children?: ReactNode; 
}

/**
 * A reusable component for rendering an HTML <a> tag.
 * It automatically handles target and rel attributes for external links.
 * * @param {AnchorProps} props - The component properties.
 */
export const Anchor = ({ href, children, className, ...props }: AnchorProps) => {
  // The type of 'href' is inferred as string | undefined from AnchorProps.

  // Check if the link is external (starts with http or https)
  // We check for '!!href' to ensure 'href' is a truthy value (i.e., not undefined, null, or empty string)
  const isExternal = !!href && (href.startsWith('http://') || href.startsWith('https://'));

  // Define target and rel attributes for external links.
  // If the link is external, we explicitly set target="_blank" and rel="noopener noreferrer".
  // Otherwise, we fall back to any 'target' or 'rel' provided in the props.
  const target = isExternal ? '_blank' : props.target;
  const rel = isExternal ? 'noopener noreferrer' : props.rel;

  return (
    <a
      {...props}
      href={href}
      // Pass the determined target/rel, prioritizing the calculated external values
      target={target}
      rel={rel}
      className={className}
    >
      {children}
    </a>
  );
};
