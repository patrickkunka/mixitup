# {{doclet.id}}

## Overview

{{{doclet.description}}}

## Members

{{#each members}}
### <a id="{{id}}">{{memberof}}.{{name}}</a>

{{#if isMethod}}|   |Type | Name | Description
|---|--- | --- | ---
{{#each params}}
|Param   |`{{#each type}}{{this}}{{#unless @last}}|{{/unless}}{{/each}}` | `{{#if optional}}[{{name}}]{{else}}{{name}}{{/if}}` | {{description}}
{{/each}}|Returns |`{{#each returns}}{{#each type}}{{{this}}}{{/each}}` | {{description}}{{/each}}
{{/if}}{{#if isProperty}}

{{/if}}{{{description}}}{{#unless @last}}

{{/unless}}{{/each}}