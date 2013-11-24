/*
	异步加载xml
	以树形图在页面展示
	2013-11-16
	whileking@gmail.com
	https://github.com/dragonwong
*/
	var stage_tree = document.getElementById("stage-tree"),
		xr_nodes = [];	/* xmlreader node */




    getXML("xml/example.xml", doLoadBack);

    function doLoadBack(back_data){
		stage_tree.innerHTML = xmlTree(back_data);

		//addXmlNodeEvent
		var nodes = Array.prototype.slice.call(stage_tree.querySelectorAll('.self'));

		nodes.forEach(function(item){
			item.onclick = function(){
				console.log(this);
			};
		});

    }

    function showNode(node){
    	

    }




	function xmlTree(back_data){

		//根节点
		var root = back_data.documentElement,
			xr_node_id = -1,
			xr_node_parent_stack = [];	/* 父节点反向栈 */

		xr_node_parent_stack[0] = {
			id: -1,
			children: []
		};

		//开始构建输出
		var output = '<ul>';

		//main
		(function main(node){


			var children = node.children,
				children_len = children.length;

			// console.log('this is: ' + node.nodeName);
			// console.log(xr_node_parent_stack.length);
			// console.log('---------------');

			xr_node_id++;

			var xr_node_parent = xr_node_parent_stack[0];
			//父元素子元素属性
			xr_node_parent.children.push(xr_node_id);

			var xr_node = {
				id: xr_node_id,
				name: node.nodeName,
				parent_id : xr_node_parent.id,
				children: []
			};

			xr_nodes.push(xr_node);
			
			




			//开始构建该节点
			output += '<li class="tree">';

				//开始构建自身内容
				output += '<div class="self">';

					//取该节点名字
					output += '<span class="nodeName">' + node.nodeName + '</span>';

					//取构建节点信息
					output += fragInfo(node, children_len);

				//结束构建该节点自身内容
				output += '</div>';


				//构建子节点内容
				if(children_len > 0){
					//如果有子节点

					xr_node_parent_stack.unshift(xr_node);	/* 父元素进栈 */
					

					//递归子节点
					output += '<ul class="tree">';
					for(var i=0; i<children_len; i++){
						arguments.callee(children[i]);
					}
					output += '</ul>';
					
					xr_node_parent_stack.shift();			/* 父元素出栈 */

				}else{
					//如果无子节点

				}

			//结束构建该节点
			output += '</li>';


		})(root);


		//结束构建输出
		output += '</ul>';

		return output;
	}


	/* lib */

	//构建节点信息
	function fragInfo(node, children_len){

		var fragment = '';
		
		//取节点信息-属性
		fragment += fragAttr(node);

		//如果无子节点
		//取节点信息-值
		if(children_len == 0){
			
			//Text or CDATASection
			//output += '<div class="nodeValue">' + '值：' + node.childNodes[0] + '</div>';
			var childNodes = node.childNodes,
				text_value = '';

			//如果有值
			if(childNodes.length){
				text_value = htmlEnCode(childNodes[0].nodeValue);
			}
			
			fragment += '<div class="nodeValue">' + 'value：' + text_value + '</div>';
		}

		//如果有内容，用div包装
		if(fragment){
			fragment = '<div class="nodeInfo">' + fragment + '</div>';
		}

		return fragment;
	}

	//构建节点信息-属性
	function fragAttr(node){

		var attr = node.attributes,
			attr_length = attr.length,
			fragment = '';

		//判断有无属性
		if(attr_length){
			//开始构建节点信息-属性
			fragment += '<div class="attr">';

				//tit
				fragment += '<div class="tit">attributes</div>';

				//开始构建属性列表
				fragment += '<ul class="attrList">';

					for(var i=0; i<attr_length; i++){
						fragment += '<li><span class="attrName">' + attr[i].nodeName + '</span>: <span class="attrValue">' + attr[i].nodeValue + '</li>';
					}

				//结束构建属性列表
				fragment += '</ul>';

			
			//结束构建节点信息-属性
			fragment += '</div>';
		}

		return fragment;
	}

	//转义组件开始
	function htmlEnCode(text){
        var temp = document.createElement("DIV"); 
        setInnerText(temp, text);
        text = temp.innerHTML;
        temp = null;

        return text; 
    }

    function setInnerText(element, text){                   //debug ff
        if(typeof element.textContent == "string"){
            element.textContent = text;
        }else{
            element.innerText = text;
        }
    }
	//转义组件结束

	//ajax
	function getXML(url, callback){
        var xhr = new XMLHttpRequest();

        xhr.open("get", url, true);
        xhr.send(null);

        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4){
                if((xhr.status>=200 && xhr.status<300) || xhr.status == 304){
                    callback(xhr.responseXML);
                }else{
                    console.log("failed: " + xhr.status);
                }
            }
        };
    }
