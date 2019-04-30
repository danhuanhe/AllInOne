<#include "../common/macro.ftl">
<!DOCTYPE html>
<html lang="en">
<@headWrapper>
<title>管理系统-首页</title>
<% for (var i = 0; i < htmlWebpackPlugin.files.css.length; i++) { %>
  <link href="<%= htmlWebpackPlugin.files.css[i] %>" rel="stylesheet">
<% } %>
</@headWrapper>
<body>
<@bodyWrapper>
  <@setting >
  </@setting>
<div id="react-content"></div>
</@bodyWrapper>
</body>
</html>
<% for (var i = 0; i < htmlWebpackPlugin.files.js.length; i++) { %>
  <script crossorigin="anonymous" src="<%= htmlWebpackPlugin.files.js[i] %>"></script>
<% } %>
