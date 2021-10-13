import { translations as en } from './en/en';
import { translations as es } from './es/es';
import { BaseTextContent } from './BaseTextContent';

export type TextLanguages = 'en' | 'es' | 'default';

const allTranslations: Record<TextLanguages, BaseTextContent> = {
    en: en,
    es: es,
    default: en,
};

export type TextReplacement = {
    placeHolder: string;
    replacement: string;
}

export class TextContent {
    private activeLanguage: TextLanguages;
    private activeContent: BaseTextContent;

    constructor(language: TextLanguages) {
        this.activeLanguage = language;
        this.activeContent = allTranslations[language];

        this.TextValue = this.TextValue.bind(this);
    }

    public TextValue(textKey: keyof BaseTextContent): string {
        return this.activeContent[textKey] || '';
    }

    public TextValueWithReplacement(textKey: keyof BaseTextContent, ...args: TextReplacement[]): string {
        let result = this.activeContent[textKey];

        if (!result) {
            return '';
        }

        for (let iArg = 0; iArg < args.length; iArg++) {
            const placeHolder = args[iArg].placeHolder;
            const replacement = args[iArg].replacement;

            if (placeHolder && replacement) {
                result = result.replace(placeHolder, replacement);
            }
        }

        return result;
    }
}
