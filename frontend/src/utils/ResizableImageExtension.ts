import { Node } from "@tiptap/core";

export const ResizableImageExtension = Node.create({
  name: "resizableImage",
  content: "inline*",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      width: {
        default: "100%",
      },
      height: {
        default: "auto",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "img[src]",
        getAttrs: (dom) => ({
          src: dom.getAttribute("src"),
          alt: dom.getAttribute("alt"),
          width: dom.getAttribute("width"),
          height: dom.getAttribute("height"),
        }),
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return ["img", HTMLAttributes];
  },

  addNodeView() {
    return ({ node, editor, getPos }) => {
      const img = document.createElement("img");
      img.src = node.attrs.src;
      img.alt = node.attrs.alt;
      img.style.width = node.attrs.width;
      img.style.height = node.attrs.height;
      img.style.display = "block"; // Ensure the image is a block element

      // Create a delete button
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "×";
      deleteButton.style.position = "absolute";
      deleteButton.style.top = "0";
      deleteButton.style.right = "0";
      deleteButton.style.background = "red";
      deleteButton.style.color = "white";
      deleteButton.style.border = "none";
      deleteButton.style.borderRadius = "50%";
      deleteButton.style.cursor = "pointer";
      deleteButton.style.padding = "4px 8px";

      // Handle delete button click
      deleteButton.addEventListener("click", () => {
        // if (typeof getPos === "function") {
        //   editor.view.dispatch(
        //     editor.view.state.tr.delete(getPos(), getPos() + node.nodeSize)
        //   );
        // }
        if (typeof getPos === "function") {
          // Call the custom handleClick function with the image src
          // if (this.options.handleClick) {
          //   editor.getAttributes("resizableImage").src, editor;
          //   this.options.handleClick(node.attrs.src);
          // }
          if (this.options.handleClick) {
            this.options.handleClick(node.attrs.src, editor);
          }
          // Remove the image from the editor
          // editor.view.dispatch(
          //   editor.view.state.tr.delete(getPos(), getPos() + node.nodeSize)
          // );
        }
      });

      // Create resize handles for all sides and corners
      const createResizeHandle = (position, cursor) => {
        const handle = document.createElement("div");
        handle.style.position = "absolute";
        handle.style.cursor = cursor;
        handle.style.backgroundColor = "#3B82F6";
        handle.style.width = "10px";
        handle.style.height = "10px";

        switch (position) {
          case "top":
            handle.style.top = "0";
            handle.style.left = "50%";
            handle.style.transform = "translateX(-50%)";
            break;
          case "bottom":
            handle.style.bottom = "0";
            handle.style.left = "50%";
            handle.style.transform = "translateX(-50%)";
            break;
          case "left":
            handle.style.left = "0";
            handle.style.top = "50%";
            handle.style.transform = "translateY(-50%)";
            break;
          case "right":
            handle.style.right = "0";
            handle.style.top = "50%";
            handle.style.transform = "translateY(-50%)";
            break;
          case "top-left":
            handle.style.top = "0";
            handle.style.left = "0";
            break;
          case "top-right":
            handle.style.top = "0";
            handle.style.right = "0";
            break;
          case "bottom-left":
            handle.style.bottom = "0";
            handle.style.left = "0";
            break;
          case "bottom-right":
            handle.style.bottom = "0";
            handle.style.right = "0";
            break;
          default:
            break;
        }

        return handle;
      };

      // Add resize handles
      const resizeHandles = [
        createResizeHandle("top", "n-resize"),
        createResizeHandle("bottom", "s-resize"),
        createResizeHandle("left", "w-resize"),
        createResizeHandle("right", "e-resize"),
        createResizeHandle("top-left", "nw-resize"),
        createResizeHandle("top-right", "ne-resize"),
        createResizeHandle("bottom-left", "sw-resize"),
        createResizeHandle("bottom-right", "se-resize"),
      ];

      const container = document.createElement("div");
      container.style.position = "relative";
      container.style.display = "inline-block";
      container.appendChild(img);
      container.appendChild(deleteButton); // Add the delete button
      resizeHandles.forEach((handle) => container.appendChild(handle));

      // Resize logic
      const onMouseDown = (event, position) => {
        event.preventDefault();
        const startX = event.clientX;
        const startY = event.clientY;
        const startWidth = img.clientWidth;
        const startHeight = img.clientHeight;
        const startLeft = img.offsetLeft;
        const startTop = img.offsetTop;

        const onMouseMove = (event) => {
          const deltaX = event.clientX - startX;
          const deltaY = event.clientY - startY;

          let newWidth = startWidth;
          let newHeight = startHeight;
          let newLeft = startLeft;
          let newTop = startTop;

          switch (position) {
            case "top":
              newHeight = startHeight - deltaY;
              newTop = startTop + deltaY;
              break;
            case "bottom":
              newHeight = startHeight + deltaY;
              break;
            case "left":
              newWidth = startWidth - deltaX;
              newLeft = startLeft + deltaX;
              break;
            case "right":
              newWidth = startWidth + deltaX;
              break;
            case "top-left":
              newWidth = startWidth - deltaX;
              newHeight = startHeight - deltaY;
              newLeft = startLeft + deltaX;
              newTop = startTop + deltaY;
              break;
            case "top-right":
              newWidth = startWidth + deltaX;
              newHeight = startHeight - deltaY;
              newTop = startTop + deltaY;
              break;
            case "bottom-left":
              newWidth = startWidth - deltaX;
              newHeight = startHeight + deltaY;
              newLeft = startLeft + deltaX;
              break;
            case "bottom-right":
              newWidth = startWidth + deltaX;
              newHeight = startHeight + deltaY;
              break;
            default:
              break;
          }

          img.style.width = `${newWidth}px`;
          img.style.height = `${newHeight}px`;
          img.style.left = `${newLeft}px`;
          img.style.top = `${newTop}px`;
        };

        const onMouseUp = () => {
          window.removeEventListener("mousemove", onMouseMove);
          window.removeEventListener("mouseup", onMouseUp);

          if (typeof getPos === "function") {
            editor.view.dispatch(
              editor.view.state.tr.setNodeMarkup(getPos(), undefined, {
                ...node.attrs,
                width: `${img.clientWidth}px`,
                height: `${img.clientHeight}px`,
              })
            );
          }
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
      };

      // Attach event listeners to resize handles
      resizeHandles.forEach((handle, index) => {
        const position = [
          "top",
          "bottom",
          "left",
          "right",
          "top-left",
          "top-right",
          "bottom-left",
          "bottom-right",
        ][index];
        handle.addEventListener("mousedown", (event) =>
          onMouseDown(event, position)
        );
      });

      return {
        dom: container,
        contentDOM: null,
      };
    };
  },
});
