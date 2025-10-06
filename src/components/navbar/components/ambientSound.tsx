import SfxUnit from "./sfxUnit";
import "./ambientSound.scss";

interface Props {
  sfxList: string[] | null,
};


export default function AmbientSound({
  sfxList
}: Props) {
  return (
    <div className="ambientsound-container">
      {sfxList?.map((sfx, i) => <SfxUnit key={i} name={sfx} /> )}
    </div>
  );
}