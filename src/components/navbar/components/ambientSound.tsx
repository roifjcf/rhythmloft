import SfxUnit from "./sfxUnit";
import "./ambientSound.scss";

interface Props {
  sfxList: string[] | null;
  toggleSfx: (name: string) => void;
  sfxVolumes: { [key: string]: number };
  setSfxVolume: (name: string, volume: number) => void;
  sfxPlaying: { [key: string]: boolean };
}

export default function AmbientSound({
  sfxList,
  toggleSfx,
  sfxVolumes,
  setSfxVolume,
  sfxPlaying
}: Props) {

  return (
    <div className="ambientsound-container">
      {sfxList?.map((sfx, i) => (
        <SfxUnit
          key={i}
          name={sfx}
          toggleSfx={toggleSfx}
          volume={sfxVolumes[sfx] ?? 1}
          setVolume={setSfxVolume}
          isPlaying={sfxPlaying[sfx] ?? false}
        />
      ))}
    </div>
  );
}
