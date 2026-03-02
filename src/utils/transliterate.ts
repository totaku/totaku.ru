/**
 * Транслитерация русского текста в латиницу для URL
 */
export function transliterate(text: string): string {
  const translitMap: Record<string, string> = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'yo',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'y',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'h',
    ц: 'ts',
    ч: 'ch',
    ш: 'sh',
    щ: 'sch',
    ъ: '',
    ы: 'y',
    ь: '',
    э: 'e',
    ю: 'yu',
    я: 'ya',
  };

  // Сначала транслитерируем
  const transliterated = text
    .toLowerCase()
    .split('')
    .map((char) => (translitMap[char] !== undefined ? translitMap[char] : char))
    .join('');

  // Затем заменяем все что не латиница/цифры на дефис и чистим
  return transliterated
    .replace(/[^a-z0-9]+/g, '-') // Заменяем все не-буквы на дефис
    .replace(/^-+|-+$/g, ''); // Убираем дефисы в начале и конце
}
