import { SET_SELECTED_MARKER, SET_SHOW_ROUTE } from './types';

export const setSelectedMarker = (marker) => ({
  type: SET_SELECTED_MARKER,
  payload: marker,
});

export const setShowRoute = (showRoute) => ({
  type: SET_SHOW_ROUTE,
  payload: showRoute,
});