bee
=====
A build tool for front-end projects.

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


Bugs & Feedback
----------------

Please feel free to [report bugs](http://github.com/colorhook/bee/issues) or [feature requests](http://github.com/colorhook/bee/pulls).
You can send me private message on [github], or send me an email to: [colorhook@gmail.com]

License
-------

`bee` is free to use under MIT license. 