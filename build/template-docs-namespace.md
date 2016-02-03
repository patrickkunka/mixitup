# {{doclet.id}}

## Overview

{{{doclet.description}}}

## Members

{{#each members}}
### <a id="{{id}}">{{memberof}}.{{name}}</a>

{{#if syntax}}```js
{{syntax}}
```{{/if}}

{{{description}}}

{{#if isMethod}}
|   |Type | Name | Description
|---|--- | --- | ---
{{#each params}}
|Param   |`{{#each type}}{{#each this}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/each}}` | `{{#if optional}}[{{name}}]{{else}}{{name}}{{/if}}` | {{{description}}}
{{/each}}|Returns |{{#each returns}}`{{#each type}}{{#each this}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/each}}` | {{{description}}}{{/each}}
{{/if}}

{{#if isProperty}}
|Type{{#if defaultvalue}} | Default{{/if}}
|---{{#if defaultvalue}}  | ---{{/if}}
|`{{#each type.names}}{{{this}}}{{/each}}`{{#if defaultvalue}}| `{{{defaultvalue}}}`{{/if}}
{{/if}}

{{#if since}}
**Version added: {{since}}**
{{/if}}
{{/each}}