import { throttle } from "lodash";

const Cursor = () => {
  const cursor = document.querySelector(".cursor");
  const links = document.querySelectorAll("[data-hover]");
  let isHover = false;

  const followMouse = (e) => {
    // disable mouse following if hovering a link
    if (!isHover) {
      // check coordinates of mouse
      // and apply to cursor element 'top' and 'left' properties
      cursor.style.transform = `translate(${e.pageX}px, ${e.pageY}px)`;
    }

    // If mouse leave viewport :::: work in progress
    if (
      e.clientY <= 0 ||
      e.clientX <= 0 ||
      e.clientX >= window.innerWidth ||
      e.clientY >= window.innerHeight
    ) {
      cursor.style.visibility = "hidden";
    } else {
      cursor.style.visibility = "visible";
    }
  };

  const linkHover = (e) => {
    isHover = true;
    // get size & position of hovered element
    let link = e.target.getBoundingClientRect();
    // to get border-radius of hovered element and give same value to cursor
    let linkStyles = getComputedStyle(e.target);
    // different values to style cursor on hover
    let linkInfo = {
      linkHeight: link.height,
      linkWidth: link.width,
      linkTop: link.top,
      linkLeft: link.left,
      borderRadius: linkStyles.borderRadius,
    };
    // change cursor size with hovered link values
    changeCursorSize(linkInfo);
  };

  const changeCursorSize = (link) => {
    // change position
    cursor.style.top = `${link.linkTop}px`;
    cursor.style.left = `${link.linkLeft}px`;
    // change size
    cursor.style.height = `${link.linkHeight}px`;
    cursor.style.width = `${link.linkWidth}px`;
    // change border-radius
    cursor.style.borderRadius = link.borderRadius;
    // overwriting computed styles to avoid shift
    cursor.style.transform = "translate(0, 0)";
    // cursor lighter when hovering a link for readability purposes
    cursor.style.opacity = "0.07";
    // apply transition duration with JS to disable transitions on mouse leave
    cursor.style.transitionDuration = "0.2s";
  };

  const releaseCursor = (e) => {
    isHover = false;
    // when mouse leave link, remove all the inline styles
    cursor.removeAttribute("style");
  };

  const followMouseHandler = throttle(followMouse, 10);

  // mouse event listener
  document.addEventListener("mousemove", followMouseHandler);
  // hover event listener
  links.forEach((link) => {
    link.addEventListener("mouseenter", linkHover);
  });
  links.forEach((link) => {
    link.addEventListener("mouseleave", releaseCursor);
  });
};

export default Cursor;
