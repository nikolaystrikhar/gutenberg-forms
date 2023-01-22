<?php

namespace GutenbergForms\Core;

use GutenbergForms\Core\Blocks\Email;
use GutenbergForms\Core\Blocks\Textarea;
use GutenbergForms\Core\Blocks\Checkbox;
use GutenbergForms\Core\Blocks\File;
use GutenbergForms\Core\Blocks\Button;
use GutenbergForms\Core\Blocks\Calculation;
use GutenbergForms\Core\Blocks\Hidden;
use GutenbergForms\Core\Blocks\Name;
use GutenbergForms\Core\Blocks\Number;
use GutenbergForms\Core\Blocks\Phone;
use GutenbergForms\Core\Blocks\Progress;
use GutenbergForms\Core\Blocks\Radio;
use GutenbergForms\Core\Blocks\ReusableForms;
use GutenbergForms\Core\Blocks\Select;
use GutenbergForms\Core\Blocks\Text;
use GutenbergForms\Core\Blocks\Toggle;
use GutenbergForms\Core\Blocks\Website;

/**
 * Handles Gutenberg blocks.
 *
 * @since 2.9.9.1
 */
class BlockHandler {
	/**
	 * Initiates blocks.
	 *
	 * @since 2.9.9.1
	 *
	 * @return void
	 */
	public static function init(): void {
		Text::init();
		Number::init();
		Textarea::init();
		Hidden::init();
		Email::init();
		Name::init();
		Phone::init();
		Toggle::init();
		Website::init();
		File::init();
		Select::init();
		Radio::init();
		Checkbox::init();
		Button::init();
		Calculation::init();
		Progress::init();
		// TODO: update the following classes.
		// Form_Steps::init();
		// Step::init();
		// Column::init(); // TODO: investigate 2 of our column blocks and a compatibility with the core column block.
		// FormColumn::init(); // TODO: investigate 2 of our column blocks and a compatibility with the core column block.
		// FormGroup::init(); // TODO: investigate our group block and a compatibility with the core column block.
		ReusableForms::init();
		// Datepicker::init(); // TODO: decide what to about it.
	}
}
