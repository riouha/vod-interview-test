import React from "react";
import Uppy from "@uppy/core";
import Tus from "@uppy/tus";
import { Dashboard } from "@uppy/react";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";

export const Uploader = () => {
  const uppy = new Uppy({
    // meta: { type: 'avatar' },
    allowMultipleUploads: true,
    // restrictions: { maxNumberOfFiles: 1 },
    // autoProceed: true,
  });

  uppy.use(Tus, {
    endpoint: "http://127.0.0.1:4000/upload/",
    // chunckSize: 10000, //in bytes
    headers: {
      authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoicmlvdWhhIiwiaXNBY3RpdmUiOnRydWUsImlhdCI6MTY1MjA4OTg0NSwiZXhwIjoxNjUyNjk0NjQ1fQ.GWbmqSWvlnsZ_O150vBhdKuvIFPAUW0WZcyNUtbsAR0",
    },
    // metaFields
  });

  uppy.on("complete", (result) => {
    const url = result?.successful[0]?.uploadURL;
    console.log("successful upload => url: ", url);
  });

  return (
    <Dashboard
      uppy={uppy}
      // plugins={['Webcam']}
      proudlyDisplayPoweredByUppy={false}
      showProgressDetails={true}
      // hideUploadButton={true}
    />
  );
};
