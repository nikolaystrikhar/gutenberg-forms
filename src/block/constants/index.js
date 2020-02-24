const languages = {
	spanish: {
		required: "necesario"
	}
};

export function translator(lang, word) {
	return languages[lang][word]; //return the translation;
}


//!THIS FEATURE IS UNDER PROGRESS/DEVELOPMENT