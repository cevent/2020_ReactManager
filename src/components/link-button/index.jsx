import React from 'react';
import './index.less';

/**
 * 外形为链接的按钮
 * @param props
 * @returns {*}
 * @constructor
 */
export default function LinkButton(props) {
  return <button {...props} className="link-button"></button>
}
