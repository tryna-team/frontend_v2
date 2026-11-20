const {
  withStorybook,
} = require('@storybook/react-native/withStorybook');

const { getDefaultConfig } = require("expo/metro-config");

module.exports = withStorybook(getDefaultConfig(__dirname));
