import { useMemo, useState, useEffect } from 'react'

export const FEATURE_GAMESPREVIEW = 'gamesPreview'
export const FEATURE_SHARING = 'sharing'
export const FEATURE_PRINTING = 'printing'
export const FEATURE_OFFLINE = 'offline'

export const features = {
  [FEATURE_GAMESPREVIEW]: {
    description: 'Games Preview: Unveröffentlichte Lernspiele im Menü anzeigen',
  },
  [FEATURE_OFFLINE]: {
    description:
      'Offline Support: Programmieren mit der Maus ohne Internet benutzen (nur Chrome)',
  },
  [FEATURE_SHARING]: {
    description:
      'Teilen Toolbox: Screenshot oder GIF der Bühne aufnehmen und per QR-Code herunterladen',
  },
  [FEATURE_PRINTING]: {
    description:
      'Screenshots drucken: ermöglicht Screenshots mit Button Layout zu drucken (nur mit Teilen Toolbox und Print Server nutzbar)',
  },
}

export const localStorageKey = (id) => `feature/${id}`

export const useFeatureState = () => {
  const [featureState, setFeatureState] = useState({})
  useEffect(() => {
    const nextState = {}
    Object.keys(features).forEach((id) => {
      nextState[id] = Boolean(localStorage.getItem(localStorageKey(id)))
    })
    setFeatureState(nextState)
  }, [])
  return useMemo(
    () =>
      Object.entries(features).map(([id, def]) => {
        return {
          id,
          description: def.description,
          enabled: featureState[id],
          toggle: () => {
            if (featureState[id]) {
              localStorage.removeItem(localStorageKey(id))
            } else {
              localStorage.setItem(localStorageKey(id), 'true')
            }
            setFeatureState({
              ...featureState,
              [id]: !featureState[id],
            })
          },
        }
      }),
    [featureState, setFeatureState]
  )
}

export const isFeatureEnabled = (feature) =>
  localStorage.getItem(localStorageKey(feature))

export const useFeatureFlag = (feature) =>
  useMemo(() => isFeatureEnabled(feature), [feature])
