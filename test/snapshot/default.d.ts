// prettier-ignore

/**
 * Generated by i18n-type-generator
 * https://github.com/BeTomorrow/i18n-typegen
 */

declare module "translations" {
	type Translations = {
		"animals": { count: number };
		"welcome": { name: string | number };
		"age": { months: string | number;  days: string | number };
		"lorem": undefined;
	};

	type TranslationKeys = keyof Translations;

	type TranslationFunctionArgs<T extends TranslationKeys> = T extends TranslationKeys
		? Translations[T] extends undefined
			? [key: T]
			: [key: T, interpolates: Translations[T]]
		: never;

	type TranslationFunction = <T extends TranslationKeys>(...args: TranslationFunctionArgs<T>) => string;

	export { TranslationFunction, TranslationFunctionArgs, TranslationKeys };
}
