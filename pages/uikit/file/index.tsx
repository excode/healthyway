import { useContext, useRef } from "react";

import { LangContext } from "hooks/lan";
import { FileUpload } from "primereact/fileupload";
import { Toast } from "primereact/toast";

const FileDemo = () => {
  const toast = useRef<Toast>(null);
  const { textFormat } = useContext(LangContext);

  const onUpload = () => {
    toast.current?.show({
      severity: "info",
      summary: "Success",
      detail: "File Uploaded",
      life: 3000,
    });
  };

  return (
    <div className="grid">
      <Toast
        position={`${textFormat === "rtl" ? "top-left" : "top-right"}`}
        ref={toast}
      ></Toast>
      <div className="col-12">
        <div className="card">
          <h5>Advanced</h5>
          <FileUpload
            name="demo[]"
            url="/api/upload"
            onUpload={onUpload}
            multiple
            accept="image/*"
            maxFileSize={1000000}
          />

          <h5>Basic</h5>
          <FileUpload
            mode="basic"
            name="demo[]"
            url="/api/upload"
            accept="image/*"
            maxFileSize={1000000}
            onUpload={onUpload}
          />
        </div>
      </div>
    </div>
  );
};

export default FileDemo;
