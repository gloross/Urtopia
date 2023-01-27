const selectors = {
  template: '.js-insurance-template'
}

class InsuranceProduct extends HTMLElement {
  constructor() {
    super();
    
    this.init();
  }

  init() {
  }
}

customElements.define('insurance-product', InsuranceProduct);

class Insurance {
  constructor() {
    this.template = document.querySelector(selectors.template);
    this.htmlString = this.template.innerHTML;
    this.html = this.createElementFromHTML(this.htmlString);
    this.element = document.querySelector('[data-pf-type="ProductATC"]');
    
    this.init();
  }
  
  init() {
    const parent = this.element.parentNode;

    parent.insertBefore(this.html, this.element);
  }

  createElementFromHTML(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
  
    return div.firstChild;
  }
}

const insurance = new Insurance();
