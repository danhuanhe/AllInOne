<#-- JSON stringify -->
<#function stringify object={"__KEY_REPRESENT_FOR_NULL__": true} maxDepth=20>
  <#return _encode(object, 0, maxDepth) />
</#function>
<#function _encode object={"__KEY_REPRESENT_FOR_NULL__": true} depth=0 maxDepth=20>

  <#if maxDepth gt 0 && depth gt maxDepth>
    <#local object = '[[refering path depth exceeded]]' />
  </#if>

  <#local jsonStr = '' />

  <#-- sequence -->
  <#if object?is_sequence || object?is_collection || object?is_enumerable || object?is_indexable>
    <#local jsonStr = jsonStr + '[' />
    <#list object as item>
      <#local jsonStr = jsonStr + _encode(item, depth+1, maxDepth) + item_has_next?string(',','') />
    </#list>
    <#local jsonStr = jsonStr + ']' />

  <#-- string -->
  <#elseif object?is_string>
    <#local jsonStr = '"' + object?json_string + '"' />


  <#-- number -->
  <#elseif object?is_number>
    <#local jsonStr = object?c />
    <#if jsonStr == 'NaN'> <#-- Number.NaN -->
      <#local jsonStr = 'null' />
    </#if>

  <#-- boolean -->
  <#elseif object?is_boolean>
    <#local jsonStr = object?string('true','false') />

  <#-- date -->
  <#elseif object?is_date_like>
    <#local jsonStr = '"' + object?datetime?iso_utc_ms + '"' />

  <#-- macro -->
  <#elseif object?is_macro>
    <#local jsonStr = '"[[MACRO]]"' />

  <#-- function -->
  <#elseif object?is_directive>
    <#local jsonStr = '"[[DIRECTIVE]]"' />

  <#-- hash -->
  <#elseif object?is_hash || object?is_hash_ex>
    <#if object.__KEY_REPRESENT_FOR_NULL__??>
      <#local jsonStr = 'null' />
    <#else>

      <#local jsonStr = jsonStr + '{' />

      <#list object?keys as key>
        <#local jsonStr = jsonStr + '"' + key?json_string + '":' + _encode(object[key], depth+1, maxDepth) + key_has_next?string(',','') />
      </#list>

      <#local jsonStr = jsonStr + '}' />
    </#if>

  <#-- unknown -->
  <#else>
    <#local jsonStr = '"[[UNKNOWN]]"' />

  </#if>

  <#return jsonStr />
</#function>

<#-- head引入title、description等 -->
<#macro headWrapper>
  <head>
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=9" >
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="renderer" content="webkit">
    <link rel="icon" href="/aires/vendor/image/favicon.ico">
    <#nested/>
    <script>
    window.NRUM = window.NRUM || {};
    window.NRUM.config = {key:'80edeb5bda3047b49a8e679f543667d1',clientStart: +new Date()};
    (function() {var n = document.getElementsByTagName('script')[0],s = document.createElement('script');s.type = 'text/javascript';s.async = true;s.src = '//nos.netease.com/apmsdk/napm-web-min-1.1.6.js';n.parentNode.insertBefore(s, n);})();
    </script>
  </head>
</#macro>

<#-- body中引入webpack运行时代码 -->
<#macro bodyWrapper>
    <body>
      <#nested/>
      <!-- built files will be auto injected -->
    </body>
</#macro>

<#-- 引入页面全局信息，包括菜单、用户信息 -->
<#macro setting>
  <script>
    window.setting = window.setting || {};
    window.setting.user =${stringify(app.user!{})};
    window.setting.corpSetting =${stringify(app.corpSetting!{})};
    window.setting.corpPermission =${stringify(app.corpPermission!{})};
    window.setting.token =${stringify(app.base.token!"")};
  </script>
</#macro>

<#-- 引入页面服务端渲染的DOM和样式 -->
<#macro serverRenderReactDOM>
<div id="react-content">
</div>
</#macro>
