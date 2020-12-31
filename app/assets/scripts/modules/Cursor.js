import gsap from "gsap";
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
      gsap.to(cursor, {
        duration: 0.2,
        x: e.pageX,
        y: e.pageY,
        height: 25,
        width: 25,
        opacity: 0.15,
        borderRadius: "50%",
      });
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
    // cursor.style.top = `${link.linkTop}px`;
    // cursor.style.left = `${link.linkLeft}px`;
    let yPosition = link.linkTop + link.linkHeight / 2;
    let xPosition = link.linkLeft + link.linkWidth / 2;

    if (isHover) {
      gsap.to(cursor, {
        duration: 0.25,
        x: xPosition,
        y: yPosition,
        height: link.linkHeight,
        width: link.linkWidth,
        borderRadius: link.borderRadius,
        opacity: 0.07,
        ease: "power4.out",
      });
    }
    // change size
    // cursor.style.height = `${link.linkHeight}px`;
    // cursor.style.width = `${link.linkWidth}px`;
    // change border-radius
    // cursor.style.borderRadius = link.borderRadius;
    // overwriting computed styles to avoid shift
    // cursor.style.transform = "translate(0, 0)";
    // cursor lighter when hovering a link for readability purposes
    // cursor.style.opacity = "0.07";
    // apply transition duration with JS to disable transitions on mouse leave
    // cursor.style.transitionDuration = "0.2s";
  };

  const releaseCursor = (e) => {
    isHover = false;
    // when mouse leave link, remove all the inline styles
    gsap.to(cursor, {
      duration: 0.1,
      height: 30,
      width: 30,
      borderRadius: "50%",
    });
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
