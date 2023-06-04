import initStoryshots from "@storybook/addon-storyshots";
import { render } from "@testing-library/react";

// TODO: templates와 pages를 위한 테스팅이 필요하다

const reactTestingLibrarySerializer = {
  print: (val: any, serialize: any, indent: any) => serialize(val.container.firstChild),
  test: (val: any) => val && val.hasOwnProperty("container"),
};

initStoryshots({
  renderer: render,
  snapshotSerializers: [reactTestingLibrarySerializer],
});
