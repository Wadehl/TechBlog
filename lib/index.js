/*
 * @Author: Kevin
 * @Date: 2023-09-07 22:38:21
 * @LastEditors: Kevin
 * @Github: https://github.com/Wadehl
 * @LastEditTime: 2023-09-07 22:38:21
 * @description: As Us using markdown-editor like Typora, if we use path like '/image.png' to insert image, it will be wrong in the preview of Typora. So we need to replace the path to 'image.png' to make it right.
 */
'use strict';

export function replaceImagePath(md, type, _mdOptions = null) {
  const defaultRenderer = md.renderer.rules['image'];

  md.renderer.rules['image'] = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    const path = token.attrGet('src');
    if (path && !path.match(/^(http|https|\/)/)) {
      const publicIndex = path.indexOf('public');
      if (publicIndex > -1) {
        token.attrSet('src', path.slice(publicIndex + 6));
      }
    }
    return defaultRenderer(tokens, idx, options, env, self);
  };
}
