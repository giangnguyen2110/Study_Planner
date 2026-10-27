const React = require('react');

const View = (props) => React.createElement('View', props, props.children);
const Text = (props) => React.createElement('Text', props, props.children);
const TouchableOpacity = (props) => React.createElement('TouchableOpacity', props, props.children);
const StyleSheet = {
  create: (styles) => styles,
  flatten: (styles) => (Array.isArray(styles) ? Object.assign({}, ...styles) : styles || {}),
};
const useColorScheme = () => 'light';

module.exports = {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Platform: { OS: 'ios', select: (obj) => obj.ios || obj.default },
};
