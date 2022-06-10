const objResourceInfo = {
  name: 'vue-select',
  css: {
    href: 'https://cdnjs.cloudflare.com/ajax/libs/vue-select/3.12.2/vue-select.min.css',

    crossorigin: {
      show: true,
      value: 'anonymous',
    },

    integrity: 'sha512-p1n2ZxNP0mD9WVdirzIZ8OKFirQ9p8vz0V+DBD2rl2ZbCwWw8020b9nO7DLaCAb14LW8AiRsJTvG6f0PyIK30w==',
  },
  js: {
    src:'https://cdnjs.cloudflare.com/ajax/libs/vue-select/3.12.2/vue-select.min.js',
    crossorigin: {
      show: true,
      value: 'anonymous',
    },
    integrity: 'sha512-WCT9aK0DQkbKnOj1pAHSTkg5Y3vYGFACNP/QvAfM0GfFZkuPfrxyRgOg4yrAxBEBBGfuf9kC6/SMuV6qDyFJjA==',
  },
}; // objResourceInfo

export const VueSelect = () => {
  return window.DynamicInsertExternalResouceHandler(objResourceInfo);
}; // VueSelect()
