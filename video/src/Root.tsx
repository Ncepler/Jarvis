import { Composition, Folder } from "remotion";
import { HookScene } from "./reel/HookScene";
import { ListScene } from "./reel/ListScene";
import { RevealScene } from "./reel/RevealScene";
import { TurnScene } from "./reel/TurnScene";
import { VilasReel } from "./reel/VilasReel";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Instagram">
        <Composition
          id="VilasReel"
          component={VilasReel}
          durationInFrames={452}
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>
      <Folder name="VilasReel-Scenes">
        <Composition
          id="Hook"
          component={HookScene}
          durationInFrames={84}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="List"
          component={ListScene}
          durationInFrames={140}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Turn"
          component={TurnScene}
          durationInFrames={78}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Reveal"
          component={RevealScene}
          durationInFrames={150}
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>
    </>
  );
};
