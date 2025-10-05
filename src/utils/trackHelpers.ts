import { trackInterface } from "../common/type";

/**
 * Checks if a given track is in the ignored tracks list
 * @param track The target track
 * @param ignoredTracks The current list of ignored tracks
 * @returns true if the track is ignored, false otherwise
 */
export function isTrackIgnored(track: trackInterface, ignoredTracks: trackInterface[] | null): boolean {
  if (!track || !ignoredTracks) return false;
  return ignoredTracks.some(t => t.name === track.name);
}


/**
 * Check if the specified track is in the custom playlist
 * @param track Target track
 * @param customTracks Current custom tracks list
 * @returns true if the track is in the custom playlist
 */
export function isInCustomPlaylist(track: trackInterface, customTracks: trackInterface[] | null): boolean {
  if (!track || !customTracks) return false;
  return customTracks.some(t => t.name === track.name);
}