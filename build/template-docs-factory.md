#{{name}}

{{#if syntax}}```js
{{syntax}}
```{{/if}}

{{{description}}}

|   |Type | Name | Description
|---|--- | --- | ---
{{#each params}}
|Param   |`{{#each type}}{{{this}}}{{#unless @last}}|{{/unless}}{{/each}}` | `{{#if optional}}[{{name}}]{{else}}{{name}}{{/if}}` | {{{description}}}
{{/each}}|Returns |`{{#each returns}}{{#each type}}{{{this}}}{{/each}}` | {{{description}}}{{/each}}

{{#if since}}
**Added v{{since}}**
{{/if}}