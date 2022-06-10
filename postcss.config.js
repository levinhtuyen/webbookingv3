module.exports = (opts = {}) => {
  return {
    postcssPlugin: "clean-css",
    prepare(result) {
      const variables = {};
      return {
        Declaration(node) {
          if (node.variable) {
            variables[node.prop] = node.value;
          }
        },
        OnceExit() {
          console.log(variables);
        },
      };
    },
  };
};
