=== Gutenberg Forms - WordPress Form Builder Plugin ===
Contributors: nikolaystrikhar
Tags: gutenberg form, contact form, multistep form, conditional form, gutenberg block, forms, form builder, custom form, contact button, contact me, custom contact form, form manager, form, forms builder, forms creator, captcha, recaptcha, Akismet, email form, web form, feedback form, email submit form, message form, contact form block
Requires at least: 5.8
Tested up to: 6.1.1
Requires PHP: 7.4
Stable tag: 2.2.9
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

The Next Generation WordPress Form Builder. Build forms directly within Gutenberg editor live. Add & arrange form fields like blocks.

== Description ==

**WordPress Form Builder Plugin - Gutenberg Forms**

This is the next generation **WordPress form builder plugin**. You can easily build your forms by adding form fields as gutenberg blocks within the Gutenberg Editor. You do not need to leave the editor to build your forms using some other drag & drop form builder. Now you can build your form within Gutenberg editor using Gutenberg Forms.

Gutenberg Forms adds a Form Block in Gutenberg and all the form fields are child blocks which you can add within the Form Block, nice and easy. You can add multiple contact forms, and you can customize the form within the Gutenberg Editor. Google reCAPTCHA integration added for spam filtering.

## Feature Highlights

The following are some of the main features, but there's more which you need to checkout by installing the plugin.

* No Bulky Form Builder - Build Forms Directly in Gutenberg Editor.
* Easy Form Layouts using builtin Form Columns Block.
* Create Multi-Step / Multi-Page Forms Easily.
* Conditional Logic - Show/hide fields conditionally.
* Form Entries - Form Entries are recorded in the database and accessible via WordPress admin.
* Use Forms Anywhere - You can create standalone forms using Gutenberg and use it anywhere using a shortcode. That Gutenberg Forms compatible with any WordPress page builder.
* Dynamically populate field values via URL parameters.
* Hidden field type with dynamic value tags.
* Spam Protection - Google reCaptcha & Akismet Integration.
* Email Notification Builder - Create a custom email notification content.
* Form Styles - Form & Field blocks come with different styles. (you can add yours as well).
* Responsive Forms - The forms you create are fully responsive.
* Import/Export Forms - Do it the same way you do with any Gutenberg block.
* More features you will find out while using the plugin.

## Documentation

Please read the docs before creating a support ticket here.
[https://gutenbergforms.com/docs](https://gutenbergforms.com/docs)

## Extensions

**MailPoet**
Our first add-on has been released. It is for MailPoet plugin that lets you connect Gutenberg Forms with MailPoet to send leads to your MailPoet list.

Read More & Install it, it's **FREE**.
[https://wordpress.org/plugins/guten-forms-mailpoet/](https://wordpress.org/plugins/guten-forms-mailpoet/)

**Mailchimp**
Mailchimp integration is ready as an add-on. Mailchimp add-on lets you connect your Mailchimp account with Gutenberg Forms to send leads to your selected list.

Read More & Install it, it's **FREE**.
[https://wordpress.org/plugins/guten-forms-mailchimp/](https://wordpress.org/plugins/guten-forms-mailchimp/)

**Akismet**
Akismet integration is ready as an add-on. It let’s you secure your forms from spammers. Akismet checks your contact form submissions against their global database of spam.

Read More & Install it, it's **FREE**.
[https://wordpress.org/plugins/guten-forms-akismet/](https://wordpress.org/plugins/guten-forms-akismet/)


## Share Your Feedback & Suggestions 👏

Your feedback, ideas and suggestions would be really helpful in adding & improving the features that you need. We have set up a tool to collect your feedback and prioritize the features based on votes.

[https://github.com/nikolaystrikhar/gutenberg-forms/issues](https://github.com/nikolaystrikhar/gutenberg-forms/issues)

== Upgrade Notice ==

== Installation ==

1. Upload the entire plugin folder to the `/wp-content/plugins/` directory.
1. Activate the plugin through the 'Plugins' menu in WordPress.

Once Activated, you will find the 'Gutenberg Forms' block in the Gutenberg editor.

For basic usage, you can also have a look at the plugin website [Gutenberg Forms](https://gutenbergforms.com).

== Screenshots ==

1. WordPress Form Builder Plugin - Gutenberg Forms
2. Adding New Field
3. Rearrange Form Fields via Drag & Drop or Up & Down buttons.
4. Form Settings
5. Email Builder
6. Form Styles

== Changelog ==

For more information, visit [Gutenberg Forms](https://gutenbergforms.com)

= 2.2.9 = 15 Jan 2023

- Security: Everyone had access to the form entries via WP API
- Security: Prevent direct access to .php files
- Security: Other security fixes
- Add: Add a block inserter button to the form block
- Update: Removed a "required" switcher from all blocks, it's already available in fields settings, no need to have it twice
- Update: Blocks are ordered better and grouped in a "Gutenberg Forms" category
- Update: Improve WP admin screens a bit
- Update: Entries management works the default WP way
- Update: Form templates, they all have to be updated, so hiding for now to avoid confusions
- Update: Remove Extendify
- Update: Update text domain and more strings can be translated
- Update: Minimum PHP version is 7.4 and minimum WP version is 5.8
- Fix: A block showing existing forms did not work at all
- Fix: Missing conditions for the number field
- Fix: Google recaptcha now respects the WP language setting
- Fix: "From" field for emails did not work in most cases, now it uses reply-to which is what users wanted
- Fix: Field IDs with accents on letters were breaking most of the functionality
- Fix: Initial conditions (when a form appears) were not working for conditional fields
- Fix: Conditional text fields did not work

= 2.2.8.3 = 5 Jan 2023

- Fix: Plugin was broken on wp.org
- Update: Compatibility with WP 6.1.1

= 2.2.8.1 = 16 May 2022

- Updated plugin author and plugin author URI
- Updated compatibility for WP 5.9

= 2.2.8 = 23 Mar 2022

- Fixed: Wrong include path for wp-load.php - https://github.com/WPChill/gutenberg-forms/pull/226
- Updated: Extendify SDK - https://github.com/WPChill/gutenberg-forms/pull/233

= 2.2.7 = 2 Feb 2022

- Fixed email trigger cc @ilangleben19
- Recaptcha enqueueing when forms are not present (https://github.com/WPChill/gutenberg-forms/issues/200, #190, #195 )
- Fixed broken dashboard in WP 5.9
- Redone build for dashboard
- Updated React, Redux, ReactDOM to WP versions

= 2.2.6 = 3 Jan 2022

- Updated Contributors

= 2.2.5 = 29 Nov 2021

- Added: Fully Translatable

= 2.2.2 = 14 Sep 2021

- Improve: Templates Library

= 2.2.1 = 26 Aug 2021

- Improve: Templates Library

= 2.2.0 = 12 Aug 2021

- Improve: Templates Library

= 2.1.9 = 13 July 2021

- Improve: Templates Library
- Fixed: Bugs

= 2.1.8 = 5 July 2021

- Fixed: Bugs

= 2.1.7 = 29 Jun 2021

- New: Toggle to enable/disable Extendify library
- Improved: Updates to the pattern and template library

= 2.1.6 = 17 Jun 2021

- Fixed: Bugs

= 2.1.5 = 17 Jun 2021

- New: Improved Template library SDK

= 2.1.4 = 25 May 2021

- Improved: Template library SDK

= 2.1.3 = 11 May 2021

- Fixed: minor bug in previous release

= 2.1.2 = 11 May 2021

- Fixed: minor bug in previous release

= 2.1.1 = 11 May 2021

- Fixed: Bugs

= 2.1.0 = 29 Apr 2021

- New: Access to the Extendify template and pattern library

= 2.0.1 = 5 Oct 2020

- New: Export Entries Feature
- Fixed: Bugs Reported by users

= 2.0.0 = 31 Aug 2020

- New: Form Summary Screen (Beta)
- Fixed: Bugs
- Improved: Code

= 1.9.0 = 11 Aug 2020

- Improved: Form Entries Screen
- New: Chart Added for Form Entries
- Fixed: Email Incoding issue for Message field type
- Fixed: Bugs

= 1.8.0 = 25 July 2020

- New: Akismet Addon Released
- Added: Prefix & Suffix Options for fields
- Added: Option to add Set Spam & Error Message
- Fixed: Bugs

= 1.7.0 = 15 July 2020

- Added: Mailchimp Integration
- Added: Option to adjust width in Form Columns
- Improved: Dashboard & Add-on Management
- Fixed: Bugs

= 1.6.0 = 04 July 2020

- Improved: Multi step form creation
- Added: Progress Bar for multi step form
- Fixed: Bugs

= 1.5.0 = 23 June 2020

- Added: Dynamically populate field values
- Added: Server side preview for saved forms
- Added: Hidden field with merge tag inserter (UNDER-PROGRESS)
- Fixed: Bugs

= 1.4.0 = 03 June 2020

- Added: Mailpoet Integration ( Separate addon )
- Fixed: Bugs
- Improved: Code

= 1.3.0 = 28 Apr 2020

- Improved: Email Notification Builder is moved in the sidebar
- Added: Admin Page Using Gutenberg Components
- Improved: Google ReCaptcha settings added in admin page
- Added: Default validation Messages in admin page
- Added: From Field in the Email Notification Builder
- Added: All Data tag in the Email Notification Builder
- Fixed: File Upload Bugs
- Added: Form Actions - Now you can enable/disable any action like form entries, email notification etc

= 1.2.0 = 11 Apr 2020

- New: Now form entries are recorded in database
- New: forms CPT - Create forms and use anywhere using shortcode
- New: Templates Library - Start creating forms quickly with ready to use templates
- Added: Bulk Add Option for select, radio and checkbox fields
- Fixed: Bugs
- Improved: Code

= 1.1.0 = 28 Mar 2020

- Added: Multi Step feature
- Added: File Upload Field
- Fixed: Bugs
- Improved: Code
- Added: Min / Max Length for Text and Message Fields
- Added: Option To Hide Form On Success
- Improved: Button Block
- Improved: Group Block

= 1.0.9 = 21 Mar 2020

- Fixed: Bugs
- Improved: Code

= 1.0.8 = 7 Mar 2020

- Fixed: Bugs
- Improved: UI and organized options
- Added: New style for radio and checkbox fields

= 1.0.7 = 28 Feb 2020

- Added: Form Theme Options
- Improved: form columns can now be changed after selection
- Improved: Better organized options for form
- Improved: Number field

= 1.0.6 = 22 Feb 2020

- Added: Custom Pattern Option for Messages,Text,Phone,Name fields
- Added: Option to define Custom validation Messages for All fields
- Added: Option to define default validation Messages in the main form block
- Added: Basic Conditional Logic to All fields
- Added: Form Button Block with actions Submit/Reset
- Added: Option to disable default Submit Button
- Added: Calculation Block
- Fixed: Bug fixes

= 1.0.5 = 15 Feb 2020

- Fixed: Frontend Styling
- Added: Inline field Styling
- Improved: Sanitization
- Added: Image Select for Checkbox, Radio
- Improved: Options UI for Checkbox,Radio,Select
- Improved: Form Markup
- Added: Form Group Block
- Added: Yes/No Field
- Added: Required Text Option

= 1.0.4 = 04 Feb 2020

- Re-done the entire plugin from scratch to work with the latest Gutenberg APIs.
- Added: Email Notification Builder
- Added: Form Columns Block
- Added: Transform Fields to Another functionality

= 1.0.1 = 18 Oct 2018

- Fixed: Minor issues.

= 1.0.0 = 16 Oct 2018

- Initial release with the basic functionality and fields added.
