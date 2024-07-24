// chrome 86+
if(!Element.prototype.replaceChildren)
    Element.prototype.replaceChildren = function replaceChildren(...c) {
        this.textContent = '';
        this.append(...c);
}