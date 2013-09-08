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

`build.xml`文件：

```xml
<?xml version='1.0' encoding='utf-8'?>
<project name='using bee to build a project example'  basedir='.'>
  <description>combo, minify</description>
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
    <concat dir='${src}/css' file='dialog.css,photoswipe.css,slider.css,app.css' destfile='${build}/css/combo.css'/>
  <target>
  <!--minify-->
  <target name='minify'>
    <concat file='${src}/css/combo.css' destfile='${build}/css/combo.min.css'/>
  <target>
  <!--default-->
  <target name='build' depends='clean,create,combo,minify'/>
</project>
```

在build.xml文件夹下执行：

```shell
bee
```

Tasks
-------

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
<copy file='a.js' to='my-new-dir'/>
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
<echo>the server is running by port ${port}.</echo>
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


Bugs & Feedback
----------------

Please feel free to [report bugs](http://github.com/colorhook/bee/issues) or [feature requests](http://github.com/colorhook/bee/pulls).
You can send me private message on [github], or send me an email to: [colorhook@gmail.com]

License
-------

`bee` is free to use under MIT license. 