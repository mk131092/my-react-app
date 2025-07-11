import React, { useState } from "react";
import { CKEditor } from "ckeditor4-react";
import { useEffect } from "react";

const HistoEditor = ({ value, setValue, EditTable, setEditTable }) => {
  const [editor, setEditor] = useState(null);
  const [edit, setEdit] = useState(true);

  const onBeforeLoad = (e) => {
    setEditor(e.editor);
  };

  useEffect(() => {
    if (editor && edit) {
      editor.setData(value);
    }
  }, [value]);

  useEffect(() => {
    if (editor && EditTable) {
      editor.setData(value);
    }
  }, [value]);

  const onChange = (evt) => {
    setEdit(false);
    setEditTable(false);
    var newContent = evt.editor.getData();
    setValue(newContent);
  };

  const editorConfig = {
    extraPlugins: "basicstyles,justify,toolbar",
    toolbar: [
      {
        name: "basicstyles",
        items: ["Source", "Save", "NewPage", "Preview", "Print", "Templates"],
      },
      {
        name: "paragraph",
        items: [
          "JustifyLeft",
          "JustifyCenter",
          "JustifyRight",
          "JustifyBlock",
          "NumberedList",
          "BulletedList",
          "Language",
        ],
      },
      { name: "styles", items: ["FontSize"] },
    ],
  };

  return (
    <div id={"specificId"}>
      <CKEditor
        initData={value}
        onChange={onChange}
        onLoaded={onBeforeLoad}
        config={editorConfig}
      />
    </div>
  );
};

export default HistoEditor;
