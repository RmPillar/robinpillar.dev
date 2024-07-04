import gsap from "gsap";

export const useMarquee = ({ speed = 40, gap = 30 }) => {
  // Template Refs/Reactives
  const marqueeRef = ref(null);
  const duplicates = ref(1);

  // Variables
  let timeline;

  // Methods
  const getDuplicates = () => {
    const duplicateCount = Math.ceil(marqueeRef.value.offsetWidth / window.innerWidth) + 2;

    return Array.from({ length: duplicateCount }, () => true).flat();
  };

  const initMarquee = () => {
    if (!marqueeRef.value) {
      return;
    }
    duplicates.value = getDuplicates();

    timeline && timeline.revert();
    timeline = gsap.timeline({
      paused: false,
      scrollTrigger: {
        trigger: marqueeRef.value,
        toggleActions: "play reset play reset",
        start: "top bottom",
        end: "bottom top-=100",
      },
    });

    let xFrom;
    let xTo;

    xFrom = -marqueeRef.value.offsetWidth - gap;
    xTo = 0;

    timeline.fromTo(
      marqueeRef.value,
      {
        x: xFrom,
      },
      {
        // x: (-marqueeRef.value.offsetWidth - 150) / (Math.ceil(marqueeRef.value.offsetWidth / window.innerWidth) + 2),
        x: xTo,
        duration: speed,
        ease: "none",
        repeat: -1,
      },
    );
  };

  return { timeline, initMarquee, duplicates, marqueeRef };
};
