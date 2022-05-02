import {bootPrintformer} from "./plugins";

window.onload = () => {
  const editorIframe = document.getElementById('editor-iframe');

  bootPrintformer(editorIframe)
    .then(editor => {
      // Connect your UI to the editor
    });
}
