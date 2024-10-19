import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


export default [
	{ files: ["**/*.{js,mjs,cjs,ts}"] },
	{ files: ["**/*.js"], languageOptions: { sourceType: "script" } },
	{ languageOptions: { globals: globals.node } },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	tseslint.config(...tseslint.configs.strict)
];