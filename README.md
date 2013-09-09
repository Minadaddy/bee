bee
=====
A build tool for front-end projects.

Unit Test
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
  <description>combo, minify</description>
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
  <!--minify-->
  <target name='minify'>
    <concat file='${src}/css/combo.css' destfile='${build}/css/combo.min.css'/>
  <target>
  <!--default-->
  <target name='build' depends='clean,create,combo,minify'/>
</project>
```

Why XML?
-------
* XML是国际标准格式，具有严谨的格式规范，编写起来简单明了，学习门槛低。
* 作为通用的数据格式，便于程序动态生成和建模，为可视化编辑提供支持。
* 支持注释。

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

#### concat
合并文件

```xml
<concat file='a.js,b.js,c.js' destfile='combo.js'/>
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

#### datauri
datauri某个css或图片

```xml
<datauri file='a.css' to='my-new-dir'/>
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

#### dirname
获取某个文件的目录名

```xml
<dirname file='${input}' property='file-dirname'/>
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

#### extname
获取文件的扩展名

```xml
<extname file='${input}' property='file-extname'/>
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

#### less
将less文件编译成css文件

```xml
<less file='reset.less' destfile='reset.css' encoding='utf-8'/>
```

#### loadfile
载入一个文件

```xml
<loadfile file='src/lib/myfile.js' encoding='utf-8'/>
```

#### minify
压缩优化文件

```xml
<minify file='reset.css' destfile='reset.min.css'/>
<minify file='myfie' destfile='myfile.min.js' type='js'/>
<minify file='logo.png' destfile='logo.png'/>
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

#### node
用node环境执行脚本

```xml
<node>
<![CDATA[
console.log(process);
]]>
</node>
```

#### rename
重命名某个文件或文件夹

```xml
<rename file='myfile.js' destfile='my-file.js'/>
```

#### replace
替换文件中的某个标示

```xml
<!--替换combo.js中的@version@字符串-->
<tstamp property='timestamp'/>
<replace token='@version@' value='{timestamp}' file='combo.js'/>
```

#### sleep
让程序sleep一段时间

```xml
<sleep value='1000'/>
<sleep>1000</sleep>
```

#### touch
创建一个文件

```xml
<touch file='readme.md'/>
<touch file='readme.txt' permission='755'>text content</touch>
```

#### tstamp
获取时间戳

```xml
<tstamp property='tstamp'/>
```

Bugs & Feedback
----------------

Please feel free to [report bugs](http://github.com/colorhook/bee/issues) or [feature requests](http://github.com/colorhook/bee/pulls).
You can send me private message on [github], or send me an email to: [colorhook@gmail.com]

License
-------

`bee` is free to use under MIT license. 