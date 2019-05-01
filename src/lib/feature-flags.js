import { useMemo } from 'react';
export const FEATURE_GAMESPREVIEW = 'gamesPreview';
export const FEATURE_SHARING = 'sharing';
export const FEATURE_PRINTING = 'printing';
export const FEATURE_OFFLINE = 'offline';

export const useFeatureFlag = (feature) => {
    const enabled = useMemo(() => localStorage.getItem(`feature/${feature}`), [ feature ]);
    return enabled;
};
