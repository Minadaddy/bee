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

```xml
<available platform='win32' property='iswin32'/>
```

#### basename

```xml
<basename file='${input}' property='file-basename'/>
```

#### concat

```xml
<concat file='a.js,b.js,c.js' destfile='combo.js'/>
```

#### condition

```xml
<copy file='a.js' to='my-new-dir'/>
```

#### copy

```xml
<copy file='a.js' to='my-new-dir'/>
```

#### datauri

```xml
<datauri file='a.js' to='my-new-dir'/>
```

#### delete

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

```xml
<dirname file='${input}' property='file-dirname'/>
```

#### echo

```xml
<echo>the server is running by port ${port}.</echo>
```

#### exec

```xml
<exec>node myNodeApp.js</exec>
```

#### extname

```xml
<extname file='${input}' property='file-extname'/>
```

#### get

```xml
<get url=''/>
```


Bugs & Feedback
----------------

Please feel free to [report bugs](http://github.com/colorhook/bee/issues) or [feature requests](http://github.com/colorhook/bee/pulls).
You can send me private message on [github], or send me an email to: [colorhook@gmail.com]

License
-------

`bee` is free to use under MIT license. 