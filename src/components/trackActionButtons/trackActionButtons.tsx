import { usePlayer } from "@/contexts/playerContext";
import Icon from "../icon/icon";
import { trackInterface } from "@/common/type";
import { isInCustomPlaylist } from "@/utils/trackHelpers";
import "./trackactionbuttons.scss";


interface Props {
  track: trackInterface;
};

export default function TrackActionButtons({
  track
}: Props) {
  
  const {
      customTracks,
      toggleCustomTrack,
      toggleIgnoredTrack,
    } = usePlayer();

    
  return (
    <div className="trackactionbuttons-container">
      <Icon
        src={isInCustomPlaylist(track, customTracks) ? "img/icons/favorite-fill.png" : "img/icons/favorite.png"}
        alt="Add/remove current track from custom playlist"
        onClick={(e) => {e.stopPropagation(); toggleCustomTrack(track)}}
        size="sm"
      />
      <Icon
        src="img/icons/block.png"
        alt="Ignore track"
        onClick={(e) => {e.stopPropagation(); toggleIgnoredTrack(track)}}
        size="sm"
      />
    </div>
  );
}