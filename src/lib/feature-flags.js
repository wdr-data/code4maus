import { useMemo } from 'react';
export const FEATURE_GAMESPREVIEW = 'gamesPreview';

export const useFeatureFlag = (feature) => {
    const enabled = useMemo(() => localStorage.getItem(`feature/${feature}`), [ feature ]);
    return enabled;
};
