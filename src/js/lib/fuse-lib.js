const objResourceInfo = {
  name: 'fuse',
  js: {
    src:'https://cdnjs.cloudflare.com/ajax/libs/fuse.js/6.4.6/fuse.min.js',
    crossorigin: {
      show: true,
      value: 'anonymous',
    },
    integrity: 'sha512-KnvCNMwWBGCfxdOtUpEtYgoM59HHgjHnsVGSxxgz7QH1DYeURk+am9p3J+gsOevfE29DV0V+/Dd52ykTKxN5fA==',
  },
}; // objResourceInfo

export const Fuse = () => {
  return window.DynamicInsertExternalResouceHandler(objResourceInfo);
}; // Fuse()
