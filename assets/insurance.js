class InsuranceProduct extends HTMLElement {
  constructor() {
    super();

    this.product = this.querySelector('.js-insurance-product');
    this.entry = this.querySelector('.js-insurance-entry');
    this.mainSelect = this.querySelector('.js-insurance-main-select');
    this.checkbox = this.querySelector('.js-insurance-checkbox');
    this.checkboxesConsent = this.querySelectorAll('.js-insurance-consent');
    this.price = this.querySelector('.js-insurance-price');
    this.descriptions = this.querySelectorAll('.js-insurance-description');
    this.error = this.querySelector('.js-insurance-error');
    this.variantIdField = document.querySelectorAll('.js-insurance-variant-id');
    this.metafields = document.querySelectorAll('.js-insurance-field');
    this.productVariantId = document.querySelector('.js-insurance-product-variant-id');
    this.productMainSelector = document.querySelector('input[name="id"][data-product-id]');
    this.variantLabels = document.querySelectorAll('[data-option-name] > label');
    this.addToCart = document.querySelector('[data-pf-type="ProductATC"]');
    this.fakeAddToCart = null;
    this.isFormValid = false;
    this.mainSelectCurrentOption = null;
    
    this.init();
  }

  init() {
    this.handleVisibility();
    this.handleVariantChange();
    this.handleCheckboxConsent();
    this.validateForm();
    this.handleFields('disable');
    
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.js-fake-add-to-cart')) {
        return;
      }

      this.fakeAddToCart = event.target.closest('.js-fake-add-to-cart');

      this.validateForm();

      if (!this.checkbox.checked || (this.checkbox.checked && this.isFormValid)) {
        this.addToCart.click();
      }
    });
  }

  validateForm() {
    if (!this.checkbox.checked) {
      return;
    }

    this.isFormValid = true;

    // Show Select Error
    if (this.mainSelect.value == 0) {
      this.isFormValid = false;
      
      // Show error
      const error = this.mainSelect.parentNode.parentNode.querySelector('.js-insurance-error');
      error?.classList.remove('is-hidden');
    }
    
    // Show Consent Error
    this.checkboxesConsent.forEach(checkbox => {
      if (!checkbox.checked) {
        this.isFormValid = false;
        
        const error = checkbox.parentNode.querySelector('.js-insurance-error');
        // Show error
        checkbox.classList.add('error');
        error?.classList.remove('is-hidden');
      }
    });
  }

  showCheckboxesConsent() {
    this.checkboxesConsent.forEach(checkbox => {
      checkbox.parentNode.classList.remove('is-hidden');
    });
  }

  refreshEntryLink() { // TO DO - LOCALIZATION?
    const selectedOption = this.mainSelect.options[this.mainSelect.selectedIndex];
    const countryCode = selectedOption.dataset.countryCode;
    const languageCode = selectedOption.dataset.languageCode;

    if (!this.entry) return;

    this.entry.querySelectorAll('a').forEach(link => {
      const href = link.getAttribute('href');
      let newHref = href;

      
      // Replace Country
      if (href.includes('country=')) {
        const countryIndex = href.indexOf('country=');
        const currentCountryQuery = href.substring(countryIndex, countryIndex + 10);
        newHref = href.replace(currentCountryQuery, `country=${countryCode}`);
      }
      
       // Replace Lang
      if (href.includes('lang=')) {
        const languageIndex = href.indexOf('lang=');
        const currentLanguageQuery = href.substring(languageIndex, languageIndex + 7);
        newHref = newHref.replace(currentLanguageQuery, `lang=${languageCode}`);
      }

        link.setAttribute('href', newHref);
    });
  }

  refreshTermsAndConditionsLinks() { // TO DO - REWORK
    const selectedOption = this.mainSelect.options[this.mainSelect.selectedIndex];
    const countryCode = selectedOption.dataset.countryCode; // TO DO - LOCALIZATION?
    const languageCode = selectedOption.dataset.languageCode; // TO DO - LOCALIZATION?

    // Replace "Terms and Conditions" links URL with the correct Country Code and Language
    this.checkboxesConsent.forEach(checkbox => {
      checkbox.parentNode.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        let newHref = href;

        // Replace Country
        if (href.includes('country=')) {
          const countryIndex = href.indexOf('country=');
          const currentCountryQuery = href.substring(countryIndex, countryIndex + 10);
          newHref = href.replace(currentCountryQuery, `country=${countryCode}`);
        }

        // Replace Language
        if (href.includes('language=')) {
          const languageIndex = href.indexOf('language=');
          const currentLanguageQuery = href.substring(languageIndex, languageIndex + 11);
          newHref = newHref.replace(currentLanguageQuery, `language=${languageCode}`);
        }

        link.setAttribute('href', newHref);
      });
    });
  }

  handleVariantChange() {
    // Insurance Variant Change
    this.mainSelect.addEventListener('change', (event) => {
      this.mainSelectCurrentOption = this.mainSelect.options[this.mainSelect.selectedIndex];
      const variantId = this.mainSelect.value;
      const price = this.mainSelect.options[this.mainSelect.selectedIndex].dataset.price;

      this.price.textContent = price;
      this.variantIdField.forEach(field => field.value = variantId);
      this.error?.classList.add('is-hidden');

      this.refreshDescription();
      // this.refreshTermsAndConditionsLinks();
      // this.refreshEntryLink();
      this.showCheckboxesConsent();
    });

    // Product Variant change
    this.variantLabels.forEach(label => {
      label.addEventListener('click', (event) => {
        // Wait for the main select to get it's value changed
        // Not the greatest solution but it does the job, sorry
        setTimeout(() => {
          const variantId = this.productMainSelector.value;
          this.productVariantId.value = variantId;
        }, 100);
      });
    })
  }

  refreshDescription() {
    this.descriptions.forEach((description) => {
      const isHidden = description.getAttribute('id') != this.mainSelectCurrentOption.dataset.id;
      description.classList.toggle('is-hidden', isHidden);
    });
  }

  handleCheckboxConsent() {
    this.checkboxesConsent.forEach(checkbox => {
      checkbox.addEventListener('change', (event) => {
        if (checkbox.checked) {
          const error = checkbox.parentNode.querySelector('.js-insurance-error');

          error.classList.add('is-hidden');
          checkbox.classList.add('error');
        }
      });
    });
  }

  handleFields(status = null) {
    if (!status) return;

    switch (status) {
      case 'enable':
        this.product.classList.remove('is-hidden');
        this.metafields.forEach(field => field.removeAttribute('disabled'));
        return;
      case 'disable':
        this.product.classList.add('is-hidden');
        this.metafields.forEach(field => field.setAttribute('disabled', ''));
        return;
    }
  }

  handleVisibility() {
    this.checkbox.addEventListener('change', (event) => {      
      if (event.currentTarget.checked) { // Checked
        this.handleFields('enable');
      } else { // Not checked
        this.handleFields('disable');
      }
    });
  }
}

customElements.define('insurance-product', InsuranceProduct);

class Insurance {
  constructor() {
    this.templateInsuranceProduct = document.querySelector('.js-insurance-product-template');
    this.templateInsuranceMetafields = document.querySelector('.js-insurance-metafields-template');
    this.addToCart = document.querySelector('[data-pf-type="ProductATC"]');
    this.mainVariantInput = document.querySelector('input[name="id"]');
    this.fakeButton = null;
    
    if (!this.templateInsuranceProduct || !this.templateInsuranceMetafields) return;
    
    this.init();
  }
  
  init() {
    this.generateFakeAddToCart();
    this.moveInsuranceMetafieldsInPlace();
    this.moveInsuranceProductInPlace();
  }
  
  moveInsuranceMetafieldsInPlace() {
    const htmlString = this.templateInsuranceMetafields.innerHTML;
    const html = this.createElementFromHTML(htmlString);

    document.querySelector(this.templateInsuranceMetafields.dataset.appendTo).prepend(html);
  }

  generateFakeAddToCart() {
    this.fakeButton = this.addToCart.cloneNode(true);
    this.fakeButton.removeAttribute('data-pf-type');
    this.fakeButton.removeAttribute('onclick');
    this.fakeButton.classList.add('js-fake-add-to-cart');

    this.insertBefore(this.fakeButton, this.addToCart);
    
    this.addToCart.style.display = 'none';
  }
  
  moveInsuranceProductInPlace() {
    const htmlString = this.templateInsuranceProduct.innerHTML;
    const html = this.createElementFromHTML(htmlString);

    this.insertBefore(html, this.fakeButton);
  }
  
  insertBefore(element, selector) {
    const parent = selector.parentNode;
    
    parent.insertBefore(element, selector); 
  }
  
  createElementFromHTML(htmlString) {
    const div = document.createElement('div');

    div.innerHTML = htmlString.trim();

    return div.firstChild;
  }
}

const insurance = new Insurance();
