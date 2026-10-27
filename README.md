# PD Integrated SHEQ Solutions — Website

Static website for PD Integrated SHEQ Solutions. Content is taken from the company profile.

## Structure

```
index.html            Home page: hero, about, services, ISO standards, industries, approach, why us, contact
privacy.html          POPIA privacy notice (draft, needs review)
assets/css/styles.css Styles and brand colours
assets/js/main.js     Menu, scroll effects, enquiry form, contact details
assets/img/           Logo (full and icon) and favicon
```

## Preview

Open `index.html` in a browser, or run a local server:

```
python3 -m http.server 8000
```

then visit http://localhost:8000.

## Before launch

- [ ] Add verified business email, telephone and address in the `CONTACT` object at the top of `assets/js/main.js`. Empty values stay hidden.
- [ ] Connect the enquiry form to a real backend or form service (e.g. Formspree, Netlify Forms, or a server endpoint). Until then it opens the visitor's email app when an email is set.
- [ ] Test form delivery, spam protection and confirmation messages.
- [ ] Have the privacy notice reviewed for POPIA and remove the draft note.
- [ ] Add company registration, VAT and B-BBEE details only once verified.
- [ ] Do not claim accreditation, certification, training-provider approval or client endorsements unless verified and authorised.
- [ ] A customer portal needs secure authentication, access control and protected storage. It cannot be built as a static page.
