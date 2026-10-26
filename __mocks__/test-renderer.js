const rtr = require('react-test-renderer');

function createRoot(options) {
  let root = null;
  return {
    render(element) {
      if (!root) {
        root = rtr.create(element, options);
      } else {
        root.update(element);
      }
    },
    unmount() {
      if (root) {
        root.unmount();
      }
    },
    get container() {
      return root;
    },
  };
}

module.exports = {
  ...rtr,
  createRoot,
};
