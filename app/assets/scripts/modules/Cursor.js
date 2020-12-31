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
  let cursorInfos = {
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
    // values change if hovering a text input
    // let cursorHeight = isTextInputHover ? 23 : 25;
    // let cursorWidth = isTextInputHover ? 2 : 25;
    // let cursorOpacity = isTextInputHover ? 0.25 : 0.15;
    // let cursorRadius = isTextInputHover ? 0 : "50%";
    // if mouse come back to viewport after having left it
    // disable anim duration to avoid cursor to 'run'
    // from viewport leaving point to entering point
    // let transitionDuration = cursor.style.visibility == "hidden" ? 0 : 0.2;
    defaultRoundCursor();
    // make the cursor visible again
    cursor.style.visibility = "visible";
    // disable mouse follow if hovering a link
    if (!isLinkHover) {
      // check coordinates of mouse
      // and apply to cursor element 'top' and 'left' properties
      gsap.to(cursor, {
        duration: cursorInfos.cursorTransition,
        x: e.pageX,
        y: e.pageY,
        height: cursorInfos.cursorHeight,
        width: cursorInfos.cursorWidth,
        opacity: cursorInfos.cursorOpacity,
        borderRadius: cursorInfos.cursorRadius,
      });
    }
  };

  const defaultRoundCursor = () => {
    // values change if hovering a text input
    cursorInfos.cursorHeight = isTextInputHover ? 23 : 25;
    cursorInfos.cursorWidth = isTextInputHover ? 2 : 25;
    cursorInfos.cursorOpacity = isTextInputHover ? 0.25 : 0.15;
    cursorInfos.cursorRadius = isTextInputHover ? 0 : "50%";
    // if mouse come back to viewport after having left it
    // disable anim duration to avoid cursor to 'run'
    // from viewport leaving point to entering point
    cursorInfos.cursorTransition = cursor.style.visibility == "hidden" ? 0 : 0.2;
    // make the cursor visible again
    cursor.style.visibility = "visible";
  };

  const getLinkInfo = (el) => {
    // get size & position of hovered element
    let link = el.getBoundingClientRect();
    // get border-radius of hovered element and give same value to cursor
    let linkStyles = getComputedStyle(el);
    // different values to style cursor on hover
    if (!isScrolling) {
      linkInfo.linkWidth = link.width;
      linkInfo.linkHeight = link.height;
      linkInfo.linkTop = link.top;
      linkInfo.linkLeft = link.left;
      linkInfo.borderRadius = linkStyles.borderRadius;
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
      console.log("ok");
      isLinkHover = true;
      // change cursor size with hovered link values
      changeCursorSize(linkInfo);
    } else {
    }
  };

  const changeCursorSize = (link) => {
    // gsap put the 'transform-origin' to 'center
    // need to add half the size of the element to the position values
    let yPosition = link.linkTop + link.linkHeight / 2;
    let xPosition = link.linkLeft + link.linkWidth / 2;
    // if
    if (isLinkHover & !checkOverflow()) {
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
    }
  };

  const releaseCursor = (e) => {
    isLinkHover = false;
    isTextInputHover = false;
    isOverflowing = false;
  };

  const hideCursor = (e) => {
    // If mouse leave viewport
    if (
      e.clientY <= 0 ||
      e.clientX <= 0 ||
      e.clientX >= window.innerWidth ||
      e.clientY >= window.innerHeight
    ) {
      // hide cursor
      cursor.style.visibility = "hidden";
    }
  };

  const checkOverflow = () => {
    // get size & position of tasks list
    let taskListTop = taskList.getBoundingClientRect().y;
    // if element top value is smaller than task list top value
    // means that the element is overflowing
    if (linkInfo.linkTop < taskListTop) {
      isOverflowing = true;
      return true;
    }
  };

  const translateHoveredElement = (e) => {
    if (checkOverflow()) {
      isOverflowing = true;
      isLinkHover = false;
    }
    // get size & position of tasks list
    // let taskListTop = e.target.getBoundingClientRect().y;
    // if element top value is smaller than task list top value
    // means that the element is overflowing
    // if (linkInfo.linkTop < taskListTop) {
    //   isOverflowing = true;
    //   isLinkHover = false;
    //   defaultRoundCursor();
    // }
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
    }
  };

  // Event Listener - mouse moving
  const followMouseHandler = throttle(followMouse, 10); // throttle event a minimum without affecting smoothness
  document.addEventListener("mousemove", followMouseHandler);
  // Event Listener - mouse leave viewport
  document.addEventListener("mouseleave", hideCursor);
  // Event Listener - mouse hover link
  links.forEach((link) => {
    link.addEventListener("mouseenter", linkHover);
  });
  // Event Listener - mouse leave link
  links.forEach((link) => {
    link.addEventListener("mouseleave", releaseCursor);
  });
  // Event Listener - scroll on tasks list
  taskList.addEventListener("scroll", translateHoveredElement);
};

export default Cursor;
