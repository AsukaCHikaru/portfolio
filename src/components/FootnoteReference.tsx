import { useContext } from "react";
import { TextBodyBlock } from "./ContentBlock";
import { SidenoteContext } from "./SidenoteContext";

export const FootnoteReference = ({ label }: { label: string }) => {
  const sidenotes = useContext(SidenoteContext);
  const body = sidenotes?.[label];

  if (!body) {
    return <sup>{label}</sup>;
  }

  return (
    <>
      <sup>{label}</sup>
      <aside>
        <sup>{label}</sup>
        {body.map((item, i) => (
          <TextBodyBlock body={item} key={i} />
        ))}
      </aside>
    </>
  );
};
