---
layout: doc
outline: deep
---

# Vue 虚拟DOM与Diff算法

## 参考链接



## 源码地址



## VDOM - VNode结构

```js
// vDom.js
class vNode {
  constructor(tag, props, children, text, elm, context) {
    /*
        @param {String} tag 节点标签
        @param {VNodeData} attrs 节点数据: props, attrs, key, class, directives ...
        @param {Array<VNode>} children 子节点
        @param {String} text 文本
        @param {Node} elm 对应的真实DOM节点
        @param {VueComponent} context 组件实例
    */
    this.tag = tag;  
    this.props = props;  
    this.children = children; 
    this.text = text;
    this.elm = elm;
    this.context = context;
    this.key = data && this.data.key; // diff的唯一标识符
  }
}
```

::: details 举个简单的例子：

```vue
<template>
	<div class="vnode" :class={ 'show-node': isShow } v-show="isShow" >
        This is a VNode
    </div>
</template>

// 一个VNode
<script>
	function render() {
        return new VNode(
        	'div',
            {
                staticClass: 'vnode',
                class: {
                	'show-node': isShow
            	},
                /*
            	directives: [
                    {
                        rawName: 'v-show',
                        name: 'show',
                        value: isShow
                    }
            	],
            	*/
                show: isShow,
            	[ new VNode(undefined, undefined, undefined, 'This is a VNode') ]
            }
        )
    }
    
    /*
    	生成的VNode格式如下:
    		{
    			tag: 'div',
    			props: {
    				show: isShow,
    				staticClass: 'vnode',
    				class: {
    					'show-node': isShow
    				}
    			},
    			text: undefined,
    			children: [
    				{
    					tag: undefined,
    					props: undefined,
    					text: 'This is a VNode',
    					children: undefined
    				}
    			]
    		}
    */
</script>
```

:::
::: tip

一些暴露的封装好的`工具函数`

```js
export const createEmptyNode = (text) => {
    const node = new VNode();
    node.text = text;
    node.isComment = true;
    return node;
}

export const createTextNode = (val) => {
    return new VNode(undefined, undefined, undefined, String(val));
}

export const cloneVNode = (vnode) => {
    const cloned = new VNode(
		vnode.tag,
        vnode.props,
        vnode.text,
        vnode.children
    )
    cloned.key = vnode.key;
    clone.isCloned = true;
    return cloned;
}
```

:::



## VDOM - Render

### 1. _createElement

```js
// _createElement主要是对tag的逻辑判断
// (1) tagName绑定在attrs中 
if(isDef(attrs) && isDef(attrs.is)) {
    tag = attrs.is;
}
// (2) tagName不存在
if(!tag) {
    return createEmptyNode();
}

// (3) tagName 是 String类型
if(typeof tag === 'string') {
    return new VNode(tag, props, children, undefined, undefined, context);
} else {
// (4) tagName 非 String类型
    return createComponent(tag, props, context, children);
}
```

