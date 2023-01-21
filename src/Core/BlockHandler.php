<?php

namespace GutenbergForms\Core;

use GutenbergForms\Core\Blocks\Email;
use GutenbergForms\Core\Blocks\Textarea;

// TODO update Mocked Classes
// use GutenbergForms\Core\Blocks\Button;
// use GutenbergForms\Core\Blocks\Calculation;
use GutenbergForms\Core\Blocks\Checkbox;
use GutenbergForms\Core\Blocks\Column;
// use GutenbergForms\Core\Blocks\Components;
use GutenbergForms\Core\Blocks\Datepicker;
use GutenbergForms\Core\Blocks\File;
// use GutenbergForms\Core\Blocks\FormColumn;
// use GutenbergForms\Core\Blocks\FormSteps;
// use GutenbergForms\Core\Blocks\Group;
// use GutenbergForms\Core\Blocks\Hidden;
// use GutenbergForms\Core\Blocks\Name;
// use GutenbergForms\Core\Blocks\Number;
// use GutenbergForms\Core\Blocks\Phone;
// use GutenbergForms\Core\Blocks\ProgressBar;
// use GutenbergForms\Core\Blocks\Radio;
// use GutenbergForms\Core\Blocks\ReusableForms;
// use GutenbergForms\Core\Blocks\Select;
// use GutenbergForms\Core\Blocks\Step;
// use GutenbergForms\Core\Blocks\Text;
// use GutenbergForms\Core\Blocks\Website;
// use GutenbergForms\Core\Blocks\YesNo;



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
		Textarea::init();
		Email::init();
		// TODO update Mocked Classes
		// Button::init();
		// Calculation::init();
		Checkbox::init();
		Column::init();
		// Components::init();
		Datepicker::init();	
		File::init();
		// Form_Column::init();
		// Form_Steps::init();
		// Group::init();
		// Hidden::init();
		// Name::init();
		// Number::init();
		// Phone::init();
		// Progress_Bar::init();
		// Radio::init();
		// Reusable_Forms::init();
		// Select::init();
		// Step::init();
		// Text::init();
		// Website::init();
		// Yes_No::init();
	}
}
