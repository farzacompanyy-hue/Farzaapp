import React from 'react';
import { WaslaLogo, WaslaLogoProps } from './WaslaLogo';

export type FarzaLogoProps = WaslaLogoProps;

/**
 * Backward compatibility alias for the legacy FarzaLogo.
 * Automatically renders the official new WASLA (وَصْلَة) emblem.
 */
export const FarzaLogo: React.FC<FarzaLogoProps> = (props) => {
  return <WaslaLogo {...props} />;
};

export default FarzaLogo;
