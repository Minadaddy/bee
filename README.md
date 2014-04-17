bee
=====
一个前端build工具

Unit Test (the service down?)
------
[![travis build status](https://api.travis-ci.org/colorhook/bee.png)](https://www.travis-ci.org/colorhook/bee)

Usage
-------

```
npm install bee -g
```

Summary
-------
一个`bee`工程可以包含多个task，一个task可以依赖多个其它task，当执行某个task，其依赖的task会现执行，其设计模式跟[`ant`](http://ant.apache.org/)类似。

在`build.xml`所在文件夹下执行：

```shell
bee
```

或者执行某个文件中的某个特殊的任务：
```
bee publish -f ./build/publish.xml 
```

`build.xml`文件：

```xml
<?xml version='1.0' encoding='utf-8'?>
<project name='using bee to build a project example'  basedir='.'>
  <description>clean, create, combo</description>
  <!-- 可以包含properties文件 -->
  <property file="version.properties"/>
  <property name="src" value="../src"/>
  <property name='build' value='../dist'/>
  <!--clean-->
  <target name='clean'>
    <delete dir='${build}'/>
  </target>
  <!--create-->
  <target name="create">
    <mkdir dir='${build}'/>
  </target>
  <!--combo-->
  <target name='combo'>
    <concat dir='${src}/css' file='dialog.css,photoswipe.css,slider.css,app.css'
         destfile='${build}/css/combo.css'/>
  <target>
  <!--default-->
  <target name='build' depends='clean,create,combo'/>
</project>
```

Why XML?
-------
* XML是国际标准格式，具有严谨的格式规范，编写起来简单明了，学习门槛低。
* 作为通用的数据格式，便于程序动态生成和建模，为可视化编辑提供支持。
* 支持注释。


Config
------

`bee` project有`name`, `description`, `level`等属性

* `name`				项目名次
* `description` 项目描述
* `basedir`			项目的根目录
* `level`				日志level，可以是`log`, `info`, `debug`, `warn`, `error`。默认是`debug`，即项目运行过程中不会输出`log`和`info`信息到控制台。

### npm


在build过程中，可能需要自定义脚本，这些脚本或许依赖某个`npm`包。基于这个需求场景，`bee`支持在build启动时根据配置来自动下载`npm`包。

```xml
<npm>node-uploader,node-uuid</npm>
```

安装到全局：

```xml
<npm g="true">coffee-script</npm>
```

### taskdef


在build过程中，很有可能依赖第三方npm插件，所以使用`taskdef`能很方便的加载使用到的插件，插件的下载和装配过程是`bee`自动完成的。

```xml
<taskdef npm="bee-less,bee-min@0.3.0"/>
```

当然也可以使用`taskdef`自定义插件

```xml
<taskdef>path/custom.js</taskdef>
```

详细的使用方法，可以参考后面的自定义插件这一段。


Tasks
-------
`bee`内置了一些常用的命令，很多都是从[`ant`](http://ant.apache.org/manual/index.html)工具上获得灵感。除此之外，我们可以很方便地定义自己的命令来扩充功能。

#### available
判断某个文件或文件夹是否存在

```xml
<available target='file-or-dir' property='target-exist'/>
```

#### basename
获得某个文件的basename

```xml
<basename file='${input}' property='file-basename'/>
```

#### dirname
获取某个文件的目录名

```xml
<dirname file='${input}' property='file-dirname'/>
```

#### extname
获取文件的扩展名

```xml
<extname file='${input}' property='file-extname'/>
```

#### touch
创建一个文件

```xml
<touch file='readme.md'/>
<touch file='readme.txt' permission='755'>text content</touch>
```

#### copy
复制某个文件或文件夹

```xml
<copy file='src/myfile.js' tofile='build/myfile.js'/>
<copy dir='src/lib' todir='dest'/>

<copy todir='dest'>
  <fileset src='src'>
    <exclude value='.svn'/>
  </fileset>
</copy>

```

#### delete
删除文件

```xml
<delete file='myfile'/>

<delete>
  <fileset dir="src">
    <exclude value='.svn'/>
  </fileset>
</delete>
```

```xml
<delete>
  <fileset dir='.'>
    <include glob='.svn'/>
  </fileset>
</delete>
```

#### mkdir
创建文件夹

```xml
<mkdir dir='~/Documents/app/bee-test/example'/>
<mkdir dir='${src}/lib'/>
```

#### move
复制某个文件或文件夹

```xml
<move file='tmp/myfile.js' tofile='build/myfile.js'/>
<move dir='tmp/lib' todir='dest'/>

<move todir='dest'>
  <fileset src='tmp'>
    <exclude value='.svn'/>
  </fileset>
</move>
```


#### rename
重命名某个文件或文件夹

```xml
<rename file='myfile.js' destfile='my-file.js'/>
```

#### echo
打印字符串控制台

```xml
<echo>the server is running on port ${port}.</echo>
```

#### exec
执行一段shell脚本

```xml
<exec>node myNodeApp.js</exec>
```

#### concat
合并文件

```xml
<concat files='a.js,b.js,c.js' destfile='combo.js'/>
```

更多的合并选项。

```xml
<concat>
  <!-- 自定义header，并删除每行的行前空白字符 -->
  <header trimleading="yes">
  ========
  header
  ========
  </header>

  <!-- 文件列表 -->
  <file>a.js</file>
  <file dir="optional-dir" name="b.js"/>
  <filelist dir="some-dir">
    <file>m.js</file>
    <file name="n.js"/>
  </filelist>

  <!-- 自定义footer -->
  <footer>
=========
  footer
=========
  </footer>
</concat>
```

#### condition
条件处理

```xml
<condition property="result">
  <os platform='win32'/>
  <equals arg1='${arg1}' arg2='${arg2}'/>
  <or>
    <available file='myfile'/>
  </or>
</condition>

<condition property='result' if='target-if' unless='target-unless'>
  <os platform='win32'/>
  <equals arg1='${arg1}' arg2='${arg2}'/>
  <or>
    <available file='myfile'/>
  </or>
</condition>
```

#### get
通过URL下载某个文件

```xml
<get url="https://raw.github.com/colorhook/bee/master/README.md" dest="README.md"/>
```

#### input
与用户交互在控制台中输入

```xml
<input property='username' message='please type your username?' defaultvalue='default-user'/>
<input property='password' password='true' message='please type your password?'/>
<echo>username: ${username} password: ${password}</echo>
```

#### loadfile
载入一个文件

```xml
<loadfile file='src/lib/myfile.js' encoding='utf-8' property="content"/>
<echo>${content}</echo>
<!--write to file-->
<touch file="build/lib/myfile.js'>${content}</touch>
```

#### replace
替换文件中的某个标识

```xml
<!--替换combo.js中的@version@字符串-->
<tstamp property='timestamp'/>
<replace token='@time@' value='${timestamp}' file='combo.js'/>
```

多值替换。需要注意的是，对于替换`?`这类正则语义字符需要在token定义中加入`\`进行转义：


```xml
<replace file="replace/hello.txt">
	<replacefilter token="@1@" value="#1#"/>
	<replacefilter token="#1#" value="?1?"/>
	<replacefilter token="\?1\?" value="!1!"/>
	<replacefilter token="!1!" value="z1z"/>
</replace>
```

#### sleep
让程序sleep一段时间

```xml
<sleep value='1000'/>
<sleep>1000</sleep>
```

#### tstamp
获取时间戳

```xml
<tstamp property='tstamp' pattern='yyyy-MM-dd HH:mm:ss'/>
```

#### node
用node环境执行脚本，在该环境下，存在一个名为`bee`的全局变量。

```xml
<node>
<![CDATA[
console.log(require('os').platform);
//当前运行的project
console.log(bee.project);
]]>
</node>
```

### 自定义插件

除了有内置的task插件可以用之外，还可以用第三方插件或者自己定义插件。

> 使用第三方插件：

#### less
[将less文件编译成css文件](http://github.com/colorhook/bee-less)

```xml
<?xml version='1.0' encoding='utf-8'?>
<project name='using bee-less to build a project example'  basedir='.'>
  <description>less</description>
  <deskdef npm='bee-less'/>
  <target name="build">
    <less src='reset.less' dest='reset.css' encoding='utf-8'/>
  </target>
</project>
```

#### datauri
[datauri某个css或图片](http://github.com/colorhook/bee-mail)

```xml
<?xml version='1.0' encoding='utf-8'?>
<project name='using bee-min to build a project example'  basedir='.'>
  <description>datauri</description>
  <deskdef npm='bee-min'/>
  <target name="build">
    <datauri src='a.css' dest='my-new-dir/a.css'/>
  </target>
</project>
```

#### min
[压缩优化js、css、图片文件](http://github.com/colorhook/bee-min)

```xml
<?xml version='1.0' encoding='utf-8'?>
<project name='using bee-min to build a project example'  basedir='.'>
  <description>min</description>
  <deskdef npm='bee-min'/>
  <target name="build">
    <min src='reset.css' dest='reset.min.css'/>
    <min file='myfie' destfile='myfile.min.js' type='js'/>
    <min file='logo.png' destfile='logo.png'/>
  </target>
</project>
```

#### mail
[发送邮件](http://github.com/colorhook/bee-mail)

```xml
<?xml version="1.0" encoding="utf-8"?>
<project name="bee mail project" description="bee mail test">

  <property name="user" value="colorhook@gmail.com"/>
  <property name="from" value="colorhook@gmail.com"/>
  <property name="to" value="colorhook@gmail.com"/>

  <target name="default">
    <input setproperty='gmail.password' message='your gmail password? ' password='true'/>
    <echo>${gmail.password}</echo>
    <mail service='Gmail'>
      <auth user='${user}' pass='${gmail.password}'/>
      <message from="${from}" to="${to}">
        <html>
            <![CDATA[
            <b>Hello</b>, <span style='color:red'>bee-mail</span>
            ]]>
        </html>
      </message>
    </mail>
  </target>

</project>
```

> 自定义内置插件。

新建一个文件`greeting.js`，并写入如下代码：

```js
module.exports = function(bee){
  bee.register('greeting', function(options){
    console.log('greeting: ' + options.value);
  });
}
```

在`greeting.js`相同目录新建一个文件`build.xml`，并写入如下内容：

```xml
<?xml version="1.0" encoding="utf-8"?>
<project name="custom plugin" description="bee example">

  <taskdef file="greeting.js"/>

  <property name='argv' value='Write a custom task without publish to npm'/>

  <target name="build">
    <greeting>${argv}</greeting>
  </target>
</project>
```

> childNodes

如上`greeting.js`所示，`xml`定义的task定义会变成object形式的js对象：

```xml
<taskName prop1='a'>
  <subprop prop2='b'>
    <key1 prop3='c'>value1</key1>
  </subprop>
</taskName>
```

经过`./XMLParser.js`解析之后

```js
module.exports = function(bee){
  bee.register('taskName', function(options){
    /**
    {
      prop1: 'a',
			value: '',
      childNodes: [
        {
					name: 'subprop',
					value: {
						prop2: 'b',
						value: '',
						childNodes: [
							{
								name: 'key1',
								value: {
									prop3: 'c',
									value: 'value1'
								}
							}
						]
					}
				}
      ]
    }
    **/
		console.log(options);
  });
}
```

xml2json的内部实现:

```javascript
xml2json: function(xml) {
	var obj = {
		childNodes: []
	};
	xml.attributes("*").each(function(attr) {
		obj[attr.localName()] = attr.toString();
	});
	if (xml.hasComplexContent()) {
		xml.children().each(function(child) {
			obj.childNodes.push({
				name: child.localName(),
				value: xu.xml2json(child)
			})
		});
	} else {
		if (!obj.value) {
			obj.value = this.text(xml);
		}
	}
	return obj;
}
```


Bugs & Feedback
----------------

Please feel free to [report bugs](http://github.com/colorhook/bee/issues) or [feature requests](http://github.com/colorhook/bee/pulls).
You can send me private message on [github], or send me an email to: [colorhook@gmail.com]

License
-------

`bee` is free to use under MIT license. 