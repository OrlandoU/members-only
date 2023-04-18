window.onload = function () {
    // scroll to element
    const delement = document.querySelector('#postId').textContent;
    const element = document.getElementById(delement)
    element.scrollIntoView({ behavior: 'smooth' });
};