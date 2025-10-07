import { useSfx } from "@/contexts/sfxContext";
import SfxUnit from "./sfxUnit";
import "./ambientSound.scss";

export default function AmbientSound() {
  const { sfxList, sfxVolumes, sfxPlaying, toggleSfx, setSfxVolume } = useSfx();

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