const typescript = require("rollup-plugin-typescript2");
const { name } = require("./package.json");

module.exports = {
	input: "src/index.ts",
	plugins: [typescript()],
	output: {
		file: `lib/${name}.js`,
		format: "umd",
		name,
		sourcemap: true
	}
};
