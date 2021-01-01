import gsap from "gsap";
import { throttle } from "lodash";

const Cursor = () => {
  const cursor = document.querySelector(".cursor");
  const links = document.querySelectorAll("[data-hover]");
  const taskList = document.querySelector(".taskcard__container");

  let isLinkHover = false;
  let isTextInputHover = false;
  let isScrolling = false;
  let isOverflowing = false;
  let currentHoveredLink;
  // init cursor's infos to use in multiple functions
  let cursorInfo = {
    cursorHeight: 25,
    cursorWidth: 25,
    cursorOpacity: 0.15,
    cursorRadius: "50%",
    cursorTransition: 0.2,
  };
  // init link's infos to use in multiple functions
  let linkInfo = {
    linkWidth: 0,
    linkHeight: 0,
    linkTop: 0,
    linkLeft: 0,
    borderRadius: 0,
  };

  const followMouse = (e) => {
    // if mouse come back to viewport after having left it
    // disable anim duration to avoid cursor to ‘transition'
    // from viewport leaving point to viewport entering point
    cursorInfo.cursorTransition = cursor.style.visibility == "hidden" ? 0 : 0.2;
    // make the cursor visible again
    cursor.style.visibility = "visible";
    // disable mouse follow if hovering a link
    if (!isLinkHover || (isLinkHover && isOverflowing)) {
      // check coordinates of mouse
      // and apply to cursor element 'top' and 'left' properties
      gsap.to(cursor, {
        duration: cursorInfo.cursorTransition,
        x: e.pageX,
        y: e.pageY,
        height: cursorInfo.cursorHeight,
        width: cursorInfo.cursorWidth,
        opacity: cursorInfo.cursorOpacity,
        borderRadius: cursorInfo.cursorRadius,
      });
    }
  };

  const getLinkInfo = (el) => {
    // get size & position of hovered element
    let link = el.getBoundingClientRect();
    // get border-radius of hovered element and give same value to cursor
    let linkStyles = window.getComputedStyle(el);
    // different values to style cursor on hover
    if (!isScrolling) {
      linkInfo.linkWidth = link.width;
      linkInfo.linkHeight = link.height;
      linkInfo.linkTop = link.top;
      linkInfo.linkLeft = link.left;
      linkInfo.borderRadius = linkStyles.borderTopLeftRadius;
    }
  };

  const linkHover = (e) => {
    // assign current link hovered (useful in 'translateHoveredElement' function)
    currentHoveredLink = e.target;
    // get hovered link's infos
    getLinkInfo(e.target);
    // do not 'scale & freeze' cursor when hovering text input
    if (e.target.nodeName == "INPUT") {
      isTextInputHover = true;
      isLinkHover = false;
    } else if (!checkOverflow()) {
      isLinkHover = true;
    }
    // change cursor size with hovered link values
    changeCursorSize(linkInfo);
  };

  const movingCursorShape = () => {
    // values change if hovering a text input
    cursorInfo.cursorHeight = isTextInputHover ? 23 : 25;
    cursorInfo.cursorWidth = isTextInputHover ? 2 : 25;
    cursorInfo.cursorOpacity = isTextInputHover ? 0.25 : 0.15;
    cursorInfo.cursorRadius = isTextInputHover ? "0" : "50%";
    // make the cursor visible again
    cursor.style.visibility = "visible";
  };

  const changeCursorSize = (link) => {
    if (isLinkHover) {
      // gsap put the 'transform-origin' to 'center
      // need to add half the size of the element to the position values
      let yPosition = link.linkTop + link.linkHeight / 2;
      let xPosition = link.linkLeft + link.linkWidth / 2;
      // give cursor the same values as the hovered link
      gsap.to(cursor, {
        duration: 0.25,
        x: xPosition,
        y: yPosition,
        height: link.linkHeight,
        width: link.linkWidth,
        borderRadius: link.borderRadius,
        opacity: 0.05,
        ease: "power4.out",
      });
    } else {
      // determine which shape ('default' or 'text-input') the moving cursor should get
      movingCursorShape();

      gsap.to(cursor, {
        duration: cursorInfo.cursorTransition,
        height: cursorInfo.cursorHeight,
        width: cursorInfo.cursorWidth,
        opacity: cursorInfo.cursorOpacity,
        borderRadius: cursorInfo.cursorRadius,
      });
    }
  };

  const releaseCursor = () => {
    isLinkHover = false;
    isTextInputHover = false;
    isOverflowing = false;
    changeCursorSize();
  };

  const hideCursor = (e) => {
    // If mouse leave viewport
    if (
      e.pageY <= 0 ||
      e.pageX <= 0 ||
      e.pageX >= window.innerWidth ||
      e.pageY >= window.innerHeight
    ) {
      // hide cursor
      cursor.style.visibility = "hidden";
      console.log("hidden");
    }
  };

  const checkOverflow = () => {
    // get size & position of tasks list
    let taskListInfo = taskList.getBoundingClientRect();
    let taskListTop = taskListInfo.y;
    let taskListBottom = taskListInfo.y + taskListInfo.height;
    // if element is in tasks list
    // && if element top value is smaller than task list top value
    // OR element bottom value is bigger than sum of task list top value + height
    // -> means that the element is overflowing
    if (
      (taskList.contains(currentHoveredLink) && linkInfo.linkTop < taskListTop) ||
      (taskList.contains(currentHoveredLink) &&
        linkInfo.linkTop + linkInfo.linkHeight > taskListBottom)
    ) {
      // isOverflowing = true;
      return true;
    } else {
      // isOverflowing = false;
      return false;
    }
  };

  const translateHoveredElement = (e) => {
    if (checkOverflow()) {
      isOverflowing = true;
      isLinkHover = false;
    }
    // update link infos
    getLinkInfo(currentHoveredLink);
    // gsap put the 'transform-origin' to 'center
    // need to add half the size of the element to the position values
    let yPosition = linkInfo.linkTop + linkInfo.linkHeight / 2;

    if (!isOverflowing) {
      gsap.to(cursor, {
        duration: 0,
        y: yPosition,
      });
    } else {
      releaseCursor();
    }
  };

  // Event Listener - mouse moving
  const followMouseHandler = throttle(followMouse, 10); // throttle event a minimum without affecting smoothness
  document.addEventListener("mousemove", followMouseHandler);
  // Event Listener - mouse hover link
  links.forEach((link) => {
    link.addEventListener("mouseenter", linkHover);
  });
  // Event Listener - mouse leave link
  links.forEach((link) => {
    link.addEventListener("mouseleave", releaseCursor);
  });
  // Event Listener - mouse leave viewport
  document.addEventListener("mouseleave", hideCursor);
  // Event Listener - scroll on tasks list
  taskList.addEventListener("scroll", translateHoveredElement);
};

export default Cursor;
