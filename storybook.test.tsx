import initStoryshots, { snapshotWithOptions } from "@storybook/addon-storyshots";

/* TODO: 현재 Textarea 컴포넌트가 react-textarea-autosize를 사용하는데,
 react-textarea-autosize가 내부적으로 forwardRef를 사용하는데,
 forwardRef는 element가 아니라서 테스트가 되지 않는다.

 임시적으로 document.createElement()를 통해서 패스처리를 해놓았으며,
 해당 오류를 우회할 수 있는 방법을 찾아봐야할듯하다. 
*/

initStoryshots({
  test: snapshotWithOptions((story: any) => ({
    createNodeMock: (element: Element) => {
      if (story.componentId === "textarea") {
        return document.createElement("textarea");
      }
      return element;
    },
  })),
});
