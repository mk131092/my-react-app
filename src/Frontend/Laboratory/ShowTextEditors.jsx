import { useEffect, useState } from "react";
import HistoEditor from "./HistoEditor";

const ShowTextEditors = ({ value, onChange, name }) => {
  const [Editor, setEditor] = useState("");
  const [Editable, setEditable] = useState(false);

  useEffect(() => {
    onChange(name, Editor);
  }, [Editor]);

  return (
    <>
      <div>
        <HistoEditor
          value={value}
          setValue={setEditor}
          EditTable={Editable}
          setEditTable={setEditable}
        />
      </div>
    </>
  );
};

export default ShowTextEditors;
