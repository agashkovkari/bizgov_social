document.querySelectorAll('.swiper').forEach(function (elem) {
  new Swiper(elem, {
    grabCursor: true,
    slidesPerView: 1,
    autoHeight: true,
    navigation: {
      nextEl: elem.nextElementSibling.nextElementSibling,
      prevEl: elem.nextElementSibling,
    },
    breakpoints: {
      320: {
        spaceBetween: 30,
      },
      768: {
        spaceBetween: 50,
      },
      1024: {
        spaceBetween: 100,
      },
    },
  });
});

function goToAnchor() {
  const anchors = document.querySelectorAll("a[href*='#']");

  if (anchors.length < 1) return;

  anchors.forEach((curAnchor) => {
    const anchor = curAnchor;

    anchor.addEventListener('click', (e) => {
      const blockID = anchor.getAttribute('href').substring(1);
      const blockPos = window.pageYOffset + document.getElementById(blockID).getBoundingClientRect().top;
      const offsetPosition = blockPos - 50;

      e.preventDefault();

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    });
  });
}

function modals() {
  const links = document.querySelectorAll('[data-target]');

  if (links.length < 1) return;

  links.forEach((link) => {
    link.addEventListener('click', () => {
      const modals = document.querySelectorAll('[data-modal]');

      modals.forEach((modal) => {
        if (modal.dataset.modal === link.dataset.target) {
          modal.classList.remove('hidden');
        }
      });
    });
  });
}

function closeLayout() {
  const layouts = document.querySelectorAll('.layout');

  if (layouts.length < 1) return;

  layouts.forEach((layout) => {
    const closeBtn = layout.querySelector('.layout__close');

    layout.addEventListener('click', (e) => {
      const target = e.target;

      if (!target.classList.contains('layout')) {
        return;
      }

      layout.classList.add('hidden');
    });

    closeBtn.addEventListener('click', () => {
      layout.classList.add('hidden');
    });
  });
}

function scrollToTopClick(obj) {
  const targets = document.querySelectorAll(`.${obj}`);

  targets.forEach((target) => {
    target.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

function isEmail(emailAddress) {
  var pattern = new RegExp(
    /^(('[\w-\s]+')|([\w-]+(?:\.[\w-]+)*)|('[\w-\s]+')([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
  );
  return pattern.test(emailAddress);
}

function formEvents() {
  const currentForm = document.querySelector('.request-form');

  if (!currentForm) return;

  const fields = currentForm.querySelectorAll('input[type="text"], input[type="email"], textarea');
  const submits = currentForm.querySelectorAll('input[type="submit"]');

  for (let field of fields) {
    field.addEventListener('blur', () => {
      if (field.value && field.value !== field.defaultValue) {
        field.classList.remove('error');
      }

      if (field.classList.contains('email')) {
        if (field.value && field.value !== field.defaultValue && !isEmail(field.value)) {
          field.classList.add('error');
        }
      }
    });
  }

  for (let submit of submits) {
    submit.addEventListener('click', (e) => {
      e.preventDefault();

      for (let field of fields) {
        if (field.classList.contains('required')) {
          if (!field.value || field.value == field.defaultValue || field.value === ' ' || field.value === '-') {
            field.classList.add('error');
          } else {
            field.classList.remove('error');
          }
        }

        if (field.classList.contains('email')) {
          if (field.value && field.value !== field.defaultValue && !isEmail(field.value)) {
            field.classList.add('error');
          } else if (field.classList.contains('required')) {
            if (!field.value || field.value == field.defaultValue) {
              field.classList.add('error');
            } else {
              field.classList.remove('error');
            }
          } else {
            field.classList.remove('error');
          }
        }

        if (field.classList.contains('inn')) {
          if (
            field.value &&
            field.value !== field.defaultValue &&
            field.value.length !== 10 &&
            field.value.length !== 12
          ) {
            field.classList.add('error');
          } else if (field.classList.contains('required')) {
            if (!field.value || field.value == field.defaultValue) {
              field.classList.add('error');
            } else {
              field.classList.remove('error');
            }
          } else {
            field.classList.remove('error');
          }
        }
      }

      const errors = currentForm.querySelectorAll('.error').length;

      if (errors >= 1) {
        return;
      }

      function consolidateFields(form) {
        const consolidate = form.querySelector('input.consolidate');
        const fields = [...form.querySelectorAll('input[type="text"], input[type="email"], textarea')];
        const consolidateMap = [];

        fields.forEach((el) => {
          if (
            !el.classList.contains('fio') &&
            !el.classList.contains('company') &&
            !el.classList.contains('phone') &&
            !el.classList.contains('email')
          ) {
            consolidateMap.push(`${el.placeholder.replaceAll('*', '')}: ${el.value}`);
          }
        });

        consolidate.value = consolidateMap.join('\n\r');
      }

      consolidateFields(currentForm);

      const lid = currentForm.getAttribute('landing-id');
      let config = {};

      config = {
        fields: {
          Contact: currentForm.querySelector('.fio'),
          Account: currentForm.querySelector('.company'),
          MobilePhone: currentForm.querySelector('.phone'),
          Email: currentForm.querySelector('.email'),
          Commentary: currentForm.querySelector('.consolidate'),
          InpVidSLID: currentForm.querySelector('.field__product'),
          UF_CRM_PODKATEGORIYA: currentForm.querySelector('.field__subcat'),
          UF_CRM_WEBSITE: currentForm.querySelector('.field__href'),
          BpmHref: currentForm.querySelector('.field__href'),
          LeadType: currentForm.querySelector('.field__leadtype'),
        },
        landingId: lid,
        serviceUrl: 'https://cp.moscow-export.com/rest/773/v3lauws2elvtk0ko/TerraSoft.SaveWebFormObjectData.json',
        redirectUrl: '',
      };

      function createObject() {
        landing.createObjectFromLanding(config);
      }

      createObject();

      try {
        window.api.forms.submit({
          lid: lid,
          fields: Object.keys(config.fields).reduce(function (acc, k) {
            try {
              acc[k] = config.fields[k].value;
            } catch (e) {}
            return acc;
          }, {}),
        });
      } catch (error) {
        console.warn(error);
      }

      currentForm.parentElement.querySelector('.form-success').classList.remove('hidden');
      currentForm.classList.add('hidden');
    });
  }
}

function requestBtnToggle(obj) {
  const targets = document.querySelectorAll(`.${obj}`);
  const requestBlock = document.querySelector(`#request`);

  if (!requestBlock) return;

  const windowTopPosition = window.pageYOffset;
  const targetPosition = {
    top: window.pageYOffset + requestBlock.getBoundingClientRect().top,
    bottom: window.pageYOffset + requestBlock.getBoundingClientRect().bottom,
  };

  targets.forEach((target) => {
    if (
      windowTopPosition > document.documentElement.clientHeight / 3 &&
      targetPosition.top >= windowTopPosition + document.documentElement.clientHeight - 200
    ) {
      target.classList.remove('hidden');
    } else {
      target.classList.add('hidden');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  goToAnchor();
  modals();
  closeLayout();
  scrollToTopClick('top-arrow');
  formEvents();
  requestBtnToggle('request-btn');

  $('input.phone').mask('+7 (999) 999-99-99', {
    selectOnFocus: true,
    completed: function () {
      this.css('color', 'rgb(255,255,255)');
    },
  });
});

window.addEventListener('scroll', function () {
  requestBtnToggle('request-btn');
});
