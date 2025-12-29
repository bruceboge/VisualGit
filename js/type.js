const words = ["Systems.", "Code.", "Automation.", "Ideas."];
let i = 0, j = 0, current = "", isDeleting = false;
const el = document.getElementById("type");

function type() {
  if (i < words.length) {
    if (!isDeleting && j <= words[i].length) {
      current = words[i].slice(0, j++);
    } else if (isDeleting && j >= 0) {
      current = words[i].slice(0, j--);
    }

    el.textContent = current;

    if (j === words[i].length) isDeleting = true;
    if (j === 0 && isDeleting) {
      isDeleting = false;
      i++;
    }
  }
  setTimeout(type, 120);
}
type();
