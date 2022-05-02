import EventEmitter from 'eventemitter3';
import Connector from "@rissc/printformer-editor-client/dist/Connector";
import EditorClient from "@rissc/printformer-editor-client/dist/EditorClient";

/**
 * @param url URL
 * @returns {{}}
 */
function parseSearchPath(url) {
  if (url.search.length === 0) return {};

  return url.search.substring(1)
    .split('&')
    .map(pair => pair.split('='))
    .reduce((acc, pair) => {
      acc[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
      return acc;
    }, {});
}

/**
 * @param editorIframe HTMLIFrameElement
 * @returns Promise<EditorClient>
 */
export function bootPrintformer(editorIframe) {
  let url = new URL(location.href);
  let query = parseSearchPath(url);

  if (process.env.NODE_ENV === 'development') {
    url = new URL(process.env.PF_URL);
    query = {draft: process.env.PF_DRAFT, api_token: process.env.PF_TOKEN};
    if (query.api_token) {
      editorIframe.src = `${url.origin}/editor/${query.draft}/embed?api_token=${query.api_token}`;
    } else {
      editorIframe.src = `${url.origin}/editor/${query.draft}/embed`;
    }
  } else {
    if (query.api_token) {
      editorIframe.src = `/editor/${query.draft}/embed?api_token=${query.api_token}`;
    } else {
      editorIframe.src = `/editor/${query.draft}/embed`;
    }
  }
  const events = new EventEmitter();
  const connector = new Connector();

  return connector.connect(editorIframe, events)
}
